import { spawn } from 'node:child_process';

const chromePath = process.argv[2] || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9234;
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
    } catch { /* retry */ }
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
  const keyEscape = async () => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  };

  await send('Page.navigate', { url });
  await sleep(9000);

  const out = { cards: [] };
  await ev(`document.querySelector('#projects')?.scrollIntoView()`);
  await sleep(700);
  await ev(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Certifications'); if (b) b.click(); return !!b; })()`);
  await sleep(1200);

  out.cardCount = await ev(`document.querySelectorAll('button[aria-label^="View "]').length`);
  out.labels = await ev(`[...document.querySelectorAll('button[aria-label^="View "]')].map(b => b.getAttribute('aria-label'))`);
  // No horizontal overflow at desktop
  out.noOverflowDesktop = await ev(`document.documentElement.scrollWidth <= window.innerWidth + 1`);

  const n = out.cardCount;
  for (let i = 0; i < n; i++) {
    const label = await ev(`[...document.querySelectorAll('button[aria-label^="View "]')][${i}]?.getAttribute('aria-label')`);
    await ev(`[...document.querySelectorAll('button[aria-label^="View "]')][${i}]?.click()`);
    await sleep(1100);
    const modalOpen = await ev(`!!document.querySelector('[role="dialog"]')`);
    const bodyText = await ev('document.body.innerText');
    const hasTitle = label ? bodyText.includes(label.split(' — ')[0].replace('View ', '')) : false;
    const hasCta = /Open |Start free |Verify on issuer/i.test(bodyText);
    const hasVerify = /Verify on issuer site|Open certificate file/i.test(bodyText);
    const hasClose = await ev(`!!document.querySelector('[role="dialog"] button[aria-label="Close credential"]')`);
    const ctaHrefs = await ev(`[...document.querySelectorAll('[role="dialog"] a[href^="http"]')].map(a => a.href)`);
    const ctaOk = ctaHrefs.length > 0 && ctaHrefs.every((h) => /^https:\/\//.test(h));
    // Click the primary CTA's href validity is checked statically; do NOT navigate away.
    await keyEscape();
    await sleep(1200);
    const closed = await ev(`!document.querySelector('[role="dialog"]')`);
    out.cards.push({ label, modalOpen, hasTitle, hasCta, hasVerify, hasClose, ctaOk, closed });
  }

  // Filter coverage: every filter button renders the expected card count
  const expectedFilters = { All: 15, Earned: 5, Completed: 4, Available: 6, 'LLM & Gen AI': 9, 'AI & ML': 3, 'Cloud & Data': 2, Cybersecurity: 1 };
  out.filters = {};
  for (const fname of Object.keys(expectedFilters)) {
    await ev(`(function(){var b=[...document.querySelectorAll('button[aria-pressed]')].find(function(x){return x.textContent.trim()==='${fname}'});if(b)b.click();return !!b})()`);
    await sleep(800);
    const count = await ev(`document.querySelectorAll('button[aria-label^="View "]').length`);
    out.filters[fname] = { expected: expectedFilters[fname], got: count, ok: count === expectedFilters[fname] };
  }
  out.allFiltersOk = Object.values(out.filters).every((f) => f.ok);
  // back to All for mobile checks
  await ev(`(function(){var b=[...document.querySelectorAll('button[aria-pressed]')].find(function(x){return x.textContent.trim()==='All'});if(b)b.click();return !!b})()`);
  await sleep(700);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(1200);
  out.mobileOverflow = await ev(`document.documentElement.scrollWidth <= window.innerWidth + 1`);
  out.mobileCardCount = await ev(`document.querySelectorAll('button[aria-label^="View "]').length`);
  await ev(`[...document.querySelectorAll('button[aria-label^="View "]')][0]?.click()`);
  await sleep(1100);
  out.mobileModal = await ev(`!!document.querySelector('[role="dialog"]')`);
  await keyEscape();
  await sleep(500);

  out.errors = errors;
  out.allModalsOk = out.cards.every((c) => c.modalOpen && c.hasTitle && c.hasCta && c.closed);
  out.pass = out.allModalsOk && out.allFiltersOk && errors.length === 0;
  console.log(JSON.stringify(out, null, 2));
  ws.close();
  child.kill();
  process.exit(out.pass ? 0 : 1);
}

main().catch((e) => {
  console.error('CERT-E2E FAILED', e);
  errors.forEach((x) => console.error(x));
  child.kill();
  process.exit(1);
});
