import { spawn } from 'node:child_process';

const chromePath = process.argv[2] || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9233;
const url = 'http://127.0.0.1:4175/';

const child = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,1100',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];

async function main() {
  let target = null;
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (target) break;
    } catch {
      /* retry */
    }
    await sleep(200);
  }
  if (!target) throw new Error('CDP page target did not start');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) p.reject(new Error(JSON.stringify(m.error)));
      else p.resolve(m.result);
    } else if (m.method === 'Runtime.exceptionThrown') {
      errors.push('EXCEPTION: ' + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || 'unknown'));
    } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      const t = m.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      if (!/favicon|Download the React DevTools/i.test(t)) errors.push('CONSOLE.ERROR: ' + t.slice(0, 400));
    } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      if (!/favicon/i.test(m.params.entry.text)) errors.push('LOG.ERROR: ' + m.params.entry.text.slice(0, 400));
    }
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');

  const ev = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('EVAL: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  };

  await send('Page.navigate', { url });
  await sleep(9000); // preloader + scenes

  const report = {};
  report.sections = await ev(`[...document.querySelectorAll('section[id]')].map(s => s.id)`);

  // 1) Desktop nav links present
  report.navLabels = await ev(`[...document.querySelectorAll('header a')].map(a => a.textContent.trim()).filter(Boolean).slice(0,12)`);

  // 2) Click Contact nav -> scroll
  await ev(`(() => { const a = [...document.querySelectorAll('header a')].find(x => x.textContent.trim() === 'Contact'); if (a) a.click(); return !!a; })()`);
  await sleep(1600);
  report.hashAfterContact = await ev('location.hash');

  // 3) Scroll to projects, open Certifications tab
  await ev(`document.querySelector('#projects')?.scrollIntoView()`);
  await sleep(700);
  await ev(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Certifications'); if (b) b.click(); return !!b; })()`);
  await sleep(1200);
  report.certCardCount = await ev(`document.querySelectorAll('button[aria-label^="View "]').length`);
  report.certLabels = await ev(`[...document.querySelectorAll('button[aria-label^="View "]')].map(b => b.getAttribute('aria-label'))`);

  // 4) Open the Hugging Face certificate modal
  const clickedHf = await ev(`(() => { const b = [...document.querySelectorAll('button[aria-label^="View "]')].find(x => x.getAttribute('aria-label').includes('The LLM Course')); if (b) b.click(); return !!b; })()`);
  await sleep(1700);
  report.hfClicked = clickedHf;
  report.modalOpen = await ev(`!!document.querySelector('[role="dialog"]')`);
  const bodyText = await ev('document.body.innerText');
  report.certInModal = bodyText.includes('Certificate of Achievement');
  report.nameInModal = bodyText.includes('Varun B P');
  report.downloadControls = await ev(`!!document.querySelector('button[aria-label*="Download"]') || [...document.querySelectorAll('button')].some(b => /Download PNG/i.test(b.textContent))`);
  report.dateInModal = bodyText.includes('2026-07-06');
  report.courseInModal = bodyText.includes('1. Fundamentals of LLMs');
  // Header should be fully removed once its exit animation finishes; if it is
  // still animating, it must at least be effectively invisible (opacity ~0).
  report.navbarHiddenWhileModal = await ev(`(() => {
    const h = document.querySelector('header');
    if (!h) return true;
    const w = h.closest('.fixed') || h;
    const cs = getComputedStyle(w);
    return parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden' || cs.display === 'none';
  })()`);

  // 5) Close modal with Escape
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(700);
  report.modalClosedOnEscape = await ev(`!document.querySelector('[role="dialog"]')`);

  // 5b) Credential filters + status-labelled "open" program modal
  report.certFilterButtons = await ev(`[...document.querySelectorAll('button[aria-pressed]')].map(b => b.textContent.trim())`);
  await ev(`(() => { const b = [...document.querySelectorAll('button[aria-pressed]')].find(x => x.textContent.trim() === 'AI & ML'); if (b) b.click(); return !!b; })()`);
  await sleep(900);
  report.filteredCardCount = await ev(`document.querySelectorAll('button[aria-label^="View "]').length`);
  const openClicked = await ev(`(() => { const b = [...document.querySelectorAll('button[aria-label^="View "]')].find(x => x.getAttribute('aria-label').includes('Elements of AI')); if (b) b.click(); return !!b; })()`);
  await sleep(1100);
  report.openProgramClicked = openClicked;
  const openText = (await ev('document.body.innerText')).toLowerCase();
  report.openStatusShown = openText.includes('available to earn') || openText.includes('earn');
  report.openPreviewLabel = openText.includes('sample preview') || openText.includes('not an issued certificate') || openText.includes('not an official certificate') || openText.includes('not earned');
  report.openStartCta = openText.includes('start free program');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(600);
  // back to All for the remaining checks
  await ev(`(() => { const b = [...document.querySelectorAll('button[aria-pressed]')].find(x => x.textContent.trim() === 'All'); if (b) b.click(); return !!b; })()`);
  await sleep(700);

  // 6) Projects tab -> flagship spotlight present
  await ev(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Projects'); if (b) b.click(); return !!b; })()`);
  await sleep(1200);
  // CSS text-transform may uppercase innerText, so compare case-insensitively.
  const pt = (await ev('document.body.innerText')).toLowerCase();
  report.flagshipSpotlight = pt.includes('flagship · 2026') && pt.includes('aurelia ai');
  report.sTierCount = await ev(`document.querySelectorAll('section button[aria-label^="Details"]').length`);

  // 7) Verify link hrefs on page
  report.links = await ev(`[...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith('http')))].slice(0, 20)`);

  report.errors = errors;
  console.log(JSON.stringify(report, null, 2));
  ws.close();
  child.kill();
  process.exit(0);
}

main().catch((e) => {
  console.error('AUDIT FAILED', e);
  errors.forEach((x) => console.error(x));
  child.kill();
  process.exit(1);
});
