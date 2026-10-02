/**
 * Headless-Chrome QA for the portfolio.
 *
 *   npm run preview -- --port 4175   # in one shell
 *   node qa-check.mjs                # in another
 *
 * Checks: console errors/warnings, uncaught exceptions, failed requests,
 * section anchors, responsive overflow at 8 widths, ⌘K palette, mobile menu,
 * sticky project stack, marquee media budget, external link hygiene, and the
 * resume asset. Exit code 1 on any failure.
 */
import { spawn } from 'node:child_process';

const chromePath = process.argv[2] || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9234;
const url = process.argv[3] || 'http://127.0.0.1:4175/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const failures = [];
const notes = [];
const check = (label, ok, detail = '') => {
  if (ok) console.log(`  PASS  ${label}`);
  else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
    failures.push(label);
  }
};

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let ws;
let msgId = 0;
const pending = new Map();
const consoleErrors = [];
const consoleWarnings = [];
const pageErrors = [];
const failedRequests = [];

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? 'evaluate failed');
  }
  return result.result.value;
};

async function main() {
  let target = null;
  for (let i = 0; i < 60; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (target) break;
    } catch {
      /* retry */
    }
    await sleep(200);
  }
  if (!target) throw new Error('Chrome CDP target did not start');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    if (message.method === 'Runtime.consoleAPICalled') {
      const text = (message.params.args ?? [])
        .map((arg) => arg.value ?? arg.description ?? '')
        .join(' ');
      if (message.params.type === 'error') consoleErrors.push(text);
      if (message.params.type === 'warning') consoleWarnings.push(text);
    }
    if (message.method === 'Runtime.exceptionThrown') {
      pageErrors.push(message.params.exceptionDetails?.exception?.description ?? 'exception');
    }
    if (message.method === 'Network.loadingFailed') {
      failedRequests.push(`${message.params.errorText} (${message.params.type})`);
    }
  });

  await send('Runtime.enable');
  await send('Network.enable');
  await send('Page.enable');
  await send('Log.enable');

  console.log(`\n▸ Loading ${url}`);
  await send('Page.navigate', { url });
  await sleep(2500);

  // ---------------- Structure ----------------
  console.log('\n▸ Structure');
  const structure = await evaluate(`(() => {
    const ids = ['home','about','capabilities','projects','skills','education','certifications','achievements','contact'];
    const missing = ids.filter((id) => !document.getElementById(id));
    const anchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href'));
    const brokenAnchors = [...new Set(anchors)].filter((href) => href.length > 1 && !document.querySelector(href));
    const emptyAnchors = anchors.filter((href) => href === '#').length;
    const navLinks = document.querySelectorAll('header nav a').length;
    const h1s = [...document.querySelectorAll('h1')].map((el) => el.textContent.trim());
    const external = [...document.querySelectorAll('a[href^="http"]')].map((a) => ({
      href: a.href,
      rel: a.rel,
      target: a.target,
      external: !a.href.startsWith(location.origin),
    }));
    const badExternal = external.filter((l) => l.external && !(l.rel.includes('noopener') && l.target === '_blank'));
    return { missing, brokenAnchors, emptyAnchors, navLinks, h1s, externalCount: external.length, badExternal };
  })()`);

  const duplicateIds = await evaluate(`(() => {
    const counts = {};
    document.querySelectorAll('[id]').forEach((el) => {
      counts[el.id] = (counts[el.id] || 0) + 1;
    });
    return Object.entries(counts).filter(([, n]) => n > 1).map(([id]) => id);
  })()`);
  check('no duplicate element ids', duplicateIds.length === 0, duplicateIds.join(', '));
  check('all nine sections present', structure.missing.length === 0, structure.missing.join(', '));
  check('no broken in-page anchors', structure.brokenAnchors.length === 0, structure.brokenAnchors.join(', '));
  check('no empty "#" anchors', structure.emptyAnchors === 0, `${structure.emptyAnchors} found`);
  check('desktop nav has 8 links', structure.navLinks === 8, `found ${structure.navLinks}`);
  check('exactly one <h1>', structure.h1s.length === 1, JSON.stringify(structure.h1s));
  check('h1 shows the real name', (structure.h1s[0] || '').includes('Varun B P'), structure.h1s[0]);
  check('all external links open safely', structure.badExternal.length === 0, JSON.stringify(structure.badExternal.slice(0, 3)));

  const forbidden = await evaluate(`/\\bJack\\b|Nextlevel Studio|Aura Brand|Solaris Digital/.test(document.body.innerText)`);
  check('no template identity left in the copy', forbidden === false);

  // ---------------- Resume + contact assets ----------------
  console.log('\n▸ Assets');
  const resumeHref = await evaluate(
    `document.querySelector('a[href*="Resume.pdf"]')?.getAttribute('href') ?? document.querySelector('a[download$=".pdf"]')?.getAttribute('href') ?? ''`,
  );
  check('resume link present', Boolean(resumeHref), resumeHref);
  if (resumeHref) {
    const response = await fetch(new URL(resumeHref, url).href, { method: 'HEAD' });
    check('resume file resolves', response.ok, `HTTP ${response.status}`);
  }
  const photoOk = await evaluate(
    `(() => { const img = document.querySelector('img[src*="varun-bp"]'); return img ? img.complete && img.naturalWidth > 0 : false; })()`,
  );
  check('hero portrait loaded', photoOk === true);

  // ---------------- Sticky project stack ----------------
  console.log('\n▸ Projects');
  const sticky = await evaluate(`(() => {
    const nodes = [...document.querySelectorAll('#projects article')];
    const stacked = nodes.filter((n) => {
      const wrap = n.parentElement;
      return wrap && getComputedStyle(wrap).position === 'sticky';
    });
    const cards = [...document.querySelectorAll('#projects a[href*="github.com/Varunbp06/"]')].map((a) => a.href);
    const unique = [...new Set(cards)];
    return { total: nodes.length, stacked: stacked.length, unique };
  })()`);
  check('three featured cards render', sticky.total >= 3, `found ${sticky.total}`);
  check('featured cards are sticky-stacked', sticky.stacked === 3, `stacked ${sticky.stacked}`);
  check(
    'featured GitHub links point at real repos',
    ['nexamind-ai', 'aurevia-health-ai', 'aurelia-ai'].every((slug) =>
      sticky.unique.some((href) => href.includes(slug)),
    ),
    sticky.unique.join(' , '),
  );

  const cardFit = await evaluate(`(() => {
    return [...document.querySelectorAll('#projects article')].map((card) => {
      const inner = card.firstElementChild;
      return { over: card.scrollHeight - card.clientHeight, inner: inner ? inner.scrollHeight - inner.clientHeight : 0 };
    });
  })()`);
  check(
    'featured card content fits its frame',
    cardFit.every((c) => c.over <= 2 && c.inner <= 2),
    JSON.stringify(cardFit),
  );

  const liveLinks = await evaluate(
    `[...new Set([...document.querySelectorAll('#projects a[href^="https://"]')].map((a) => a.href).filter((h) => h.includes('vercel.app')))]`,
  );
  check('three live demo links present', liveLinks.length >= 3, liveLinks.join(' , '));

  // ---------------- Marquee media budget ----------------
  console.log('\n▸ Marquee');
  await evaluate(`document.querySelector('section[aria-label*="preview reel"]')?.scrollIntoView()`);
  await sleep(2500);
  const marquee = await evaluate(`(() => {
    const section = document.querySelector('section[aria-label*="preview reel"]');
    if (!section) return null;
    const imgs = [...section.querySelectorAll('img')];
    const tiles = section.querySelectorAll('div.flex.w-max > div').length;
    return { mounted: imgs.filter((i) => i.getAttribute('src')).length, tiles };
  })()`);
  check('marquee section exists', Boolean(marquee));
  if (marquee) {
    check('marquee mounts 22+ tiles across both rows', marquee.tiles >= 22, `${marquee.tiles} tiles`);
    check('marquee media stays inside its budget', marquee.mounted <= 8, `${marquee.mounted} live GIFs`);
    check('marquee actually renders preview media', marquee.mounted >= 3, `${marquee.mounted} live GIFs`);
  }

  // ---------------- Command palette ----------------
  console.log('\n▸ Interaction');
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
  await sleep(400);
  await evaluate(
    `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))`,
  );
  await sleep(500);
  const paletteOpen = await evaluate(`Boolean(document.querySelector('[aria-label="Command palette"]'))`);
  check('⌘K opens the command palette', paletteOpen === true);
  if (paletteOpen) {
    await evaluate(
      `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`,
    );
    await sleep(400);
    const closed = await evaluate(`!document.querySelector('[aria-label="Command palette"]')`);
    check('Escape closes the palette', closed === true);
  }

  // Palette keyboard flow: type, arrow, Enter runs the command.
  await evaluate(
    `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))`,
  );
  await sleep(500);
  await evaluate(`(() => {
    const input = document.querySelector('[aria-label="Search commands"]');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'contact');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await sleep(400);
  await evaluate(
    `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))`,
  );
  await sleep(1600);
  const paletteNavigated = await evaluate(`(() => {
    const target = document.getElementById('contact');
    if (!target) return false;
    return Math.abs(target.getBoundingClientRect().top) < window.innerHeight;
  })()`);
  check('palette Enter navigates to the matching section', paletteNavigated === true);

  // Marquee motion: the track transform must move as the page scrolls.
  await evaluate(
    `document.querySelector('section[aria-label*="preview reel"]')?.scrollIntoView()`,
  );
  await sleep(900);
  const marqueeMotion = await evaluate(`(() => {
    const track = document.querySelector('section[aria-label*="preview reel"] div.flex.w-max');
    return track ? track.style.transform : null;
  })()`);
  await evaluate(`window.scrollBy(0, -160)`);
  await sleep(900);
  const marqueeAfter = await evaluate(`(() => {
    const track = document.querySelector('section[aria-label*="preview reel"] div.flex.w-max');
    return track ? track.style.transform : null;
  })()`);
  check(
    'marquee rows track scroll',
    Boolean(marqueeMotion) && marqueeMotion !== marqueeAfter,
    `${marqueeMotion} -> ${marqueeAfter}`,
  );

  const navWorks = await evaluate(`(() => {
    const link = [...document.querySelectorAll('header nav a')].find((a) => a.textContent.trim() === 'Projects');
    if (!link) return false;
    link.click();
    return true;
  })()`);
  await sleep(1400);
  const scrolledToProjects = await evaluate(`window.scrollY > 400`);
  check('nav link scrolls to a section', navWorks && scrolledToProjects);

  // ---------------- Responsive ----------------
  console.log('\n▸ Responsive widths');
  const widths = [360, 390, 430, 640, 768, 1024, 1280, 1440, 1920];
  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await sleep(600);
    const audit = await evaluate(`(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const clipped = [...document.querySelectorAll('h1, h2, a, button')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > doc.clientWidth + 2 || r.left < -2);
        })
        .map((el) => el.tagName + ':' + (el.textContent || '').trim().slice(0, 24));
      const tiny = [...document.querySelectorAll('a, button')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.height < 24;
        })
        .map((el) =>
          el.tagName +
          ':' +
          (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 28),
        );
      return { overflow, clipped: clipped.slice(0, 4), tiny: tiny.length, tinyList: [...new Set(tiny)].slice(0, 8) };
    })()`);
    check(`no horizontal overflow at ${width}px`, audit.overflow <= 1, `overflow ${audit.overflow}px`);
    check(`nothing clipped at ${width}px`, audit.clipped.length === 0, audit.clipped.join(' , '));
    if (audit.tiny > 0 && width === 390)
      notes.push(`${width}px: ${audit.tiny} small targets — ${audit.tinyList.join(' , ')}`);
  }

  // Mobile navigation menu
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await evaluate('window.scrollTo(0,0)');
  await sleep(500);
  const menuTest = await evaluate(`(() => {
    const trigger = [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === 'Open navigation menu');
    if (!trigger) return 'no-trigger';
    trigger.click();
    return 'clicked';
  })()`);
  await sleep(500);
  const menuOpen = await evaluate(
    `Boolean(document.querySelector('[aria-label="Navigation menu"]'))`,
  );
  check('mobile menu opens at 390px', menuTest === 'clicked' && menuOpen === true, menuTest);
  if (menuOpen) {
    await evaluate(
      `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`,
    );
    await sleep(400);
    const menuClosed = await evaluate(`!document.querySelector('[aria-label="Navigation menu"]')`);
    check('Escape closes the mobile menu', menuClosed === true);
  }

  // ---------------- Reduced motion ----------------
  console.log('\n▸ Reduced motion');
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await send('Page.navigate', { url });
  await sleep(2500);
  const reduced = await evaluate(`(() => {
    const ids = ['home','about','projects','contact'];
    const missing = ids.filter((id) => !document.getElementById(id));
    const visible = [...document.querySelectorAll('#home h1, #about h2, #projects h3')].filter(
      (el) => el.getBoundingClientRect().height > 0,
    ).length;
    return { missing, visible, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  })()`);
  check('reduced motion keeps every section', reduced.missing.length === 0, reduced.missing.join(', '));
  check('reduced motion keeps content visible', reduced.visible >= 3, `${reduced.visible} headings visible`);
  check('reduced motion has no overflow', reduced.overflow <= 1, `overflow ${reduced.overflow}px`);
  await send('Emulation.setEmulatedMedia', { features: [] });

  // ---------------- Console hygiene ----------------
  console.log('\n▸ Console');
  const ignorable = (text) =>
    /favicon|Download the React DevTools|vite|WebSocket is closed/i.test(text);
  const realErrors = consoleErrors.filter((text) => !ignorable(text));
  const realPageErrors = pageErrors.filter((text) => !ignorable(text));
  const realFailed = failedRequests.filter(
    (text) => !/favicon|ERR_ABORTED|net::ERR_INTERNET_DISCONNECTED/i.test(text),
  );
  check('no console errors', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));
  check('no uncaught exceptions', realPageErrors.length === 0, realPageErrors.slice(0, 2).join(' | '));
  check('no failed requests', realFailed.length === 0, realFailed.slice(0, 3).join(' | '));
  if (consoleWarnings.length) notes.push(`${consoleWarnings.length} console warnings: ${consoleWarnings.slice(0, 2).join(' | ')}`);

  if (notes.length) {
    console.log('\n▸ Notes');
    notes.forEach((note) => console.log(`  · ${note}`));
  }

  console.log(
    `\n${failures.length === 0 ? '✅ ALL CHECKS PASSED' : `❌ ${failures.length} CHECK(S) FAILED`}\n`,
  );
}

main()
  .catch((error) => {
    console.error('\nQA run crashed:', error.message);
    failures.push(`crash: ${error.message}`);
  })
  .finally(async () => {
    try {
      ws?.close();
    } catch {
      /* ignore */
    }
    chrome.kill();
    await sleep(200);
    process.exit(failures.length ? 1 : 0);
  });
