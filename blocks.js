/* ============================================================
   blocks.js: تعريف كتل سكراتش وطريقة رسمها (مشترك بين الامتحان والمشروع)
   ============================================================ */
(() => {
  'use strict';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  };

  const CATS = {
    events: '#FFBF00', motion: '#4C97FF', looks: '#9966FF', sound: '#CF63CF',
    control: '#FFAB19', sensing: '#5CB1D6', operators: '#59C059', variables: '#FF8C1A'
  };
  const CAT_NAME = {
    events: 'Events', motion: 'Motion', looks: 'Looks', sound: 'Sound',
    control: 'Control', sensing: 'Sensing', operators: 'Operators', variables: 'Variables'
  };

  const FLAG = '<svg class="flag" viewBox="0 0 20 22" width="20" height="22" aria-label="green flag" role="img"><path d="M3 1v20" stroke="#1a1a40" stroke-width="2.5" stroke-linecap="round"/><path d="M4 3c4-2 7 2 12 0v9c-5 2-8-2-12 0z" fill="#4CBF56" stroke="#1a1a40" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  /* خانة إدخال: نص/رقم، أو {r:'pick random 1 to 10'} لكتلة بداخل الخانة */
  const inp = (v) => (v && typeof v === 'object'
    ? `<span class="inp rp" style="--rc:${CATS[v.cat || 'operators']}">${esc(v.r)}</span>`
    : `<span class="inp">${esc(v)}</span>`);
  /* شرط: نص (استشعار) أو {t:'lives < 1', cat:'operators'} */
  const boolPill = (c) => {
    const o = typeof c === 'object' ? c : { t: c };
    return `<span class="bool" style="--bc:${CATS[o.cat || 'sensing']}">${esc(o.t)}</span>`;
  };

  const DEFS = {
    flag:        { cat: 'events', hat: true, html: () => `when ${FLAG} clicked` },
    key:         { cat: 'events', hat: true, html: (k) => `when ${inp(k)} key pressed` },
    clicked:     { cat: 'events', hat: true, html: () => 'when this sprite clicked' },
    receive:     { cat: 'events', hat: true, html: (m) => `when I receive ${inp(m)}` },
    broadcast:   { cat: 'events', html: (m) => `broadcast ${inp(m)}` },
    move:        { cat: 'motion', html: (n) => `move ${inp(n)} steps` },
    turn:        { cat: 'motion', html: (d, n) => `turn ${d === 'l' ? '↺' : '↻'} ${inp(n)} degrees` },
    goto:        { cat: 'motion', html: (x, y) => `go to x: ${inp(x)} y: ${inp(y)}` },
    gotorandom:  { cat: 'motion', html: () => `go to ${inp('random position')}` },
    gotomouse:   { cat: 'motion', html: () => `go to ${inp('mouse-pointer')}` },
    towards:     { cat: 'motion', html: (t) => `point towards ${inp(t)}` },
    changex:     { cat: 'motion', html: (n) => `change x by ${inp(n)}` },
    changey:     { cat: 'motion', html: (n) => `change y by ${inp(n)}` },
    bounce:      { cat: 'motion', html: () => 'if on edge, bounce' },
    say:         { cat: 'looks', html: (t, s) => (s ? `say ${inp(t)} for ${inp(s)} seconds` : `say ${inp(t)}`) },
    costume:     { cat: 'looks', html: () => 'next costume' },
    backdrop:    { cat: 'looks', html: (b) => `switch backdrop to ${inp(b)}` },
    setsize:     { cat: 'looks', html: (n) => `set size to ${inp(n)} %` },
    hide:        { cat: 'looks', html: () => 'hide' },
    show:        { cat: 'looks', html: () => 'show' },
    sound:       { cat: 'sound', html: (n) => `start sound ${inp(n)}` },
    soundwait:   { cat: 'sound', html: (n) => `play sound ${inp(n)} until done` },
    wait:        { cat: 'control', html: (n) => `wait ${inp(n)} seconds` },
    stopall:     { cat: 'control', html: () => `stop ${inp('all')}` },
    clone:       { cat: 'control', html: () => `create clone of ${inp('myself')}` },
    repeat:      { cat: 'control', c: true, html: (n) => `repeat ${inp(n)}` },
    forever:     { cat: 'control', c: true, html: () => 'forever' },
    if:          { cat: 'control', c: true, html: (cond) => `if ${boolPill(cond)} then` },
    setvar:      { cat: 'variables', html: (v, n) => `set ${inp(v)} to ${inp(n)}` },
    changevar:   { cat: 'variables', html: (v, n) => `change ${inp(v)} by ${inp(n)}` },
    touching:    { cat: 'sensing', bool: true, html: (c) => `touching ${esc(c)}?` },
    keypressed:  { cat: 'sensing', bool: true, html: (k) => `key ${esc(k)} pressed?` },
    timer:       { cat: 'sensing', rep: true, html: () => 'timer' },
    mousex:      { cat: 'sensing', rep: true, html: () => 'mouse x' }
  };

  function blockHTML(spec) {
    const [kind, ...args] = spec;
    const d = DEFS[kind];
    if (!d) throw new Error('كتلة غير معروفة: ' + kind);
    const color = CATS[d.cat];
    if (d.c) {
      const kids = args.pop();
      return `<span class="cb" style="--c:${color}"><span class="brow">${d.html(...args)}</span><span class="cin">${kids.map(blockHTML).join('')}</span><span class="cend"></span></span>`;
    }
    const cls = 'blk' + (d.hat ? ' hat' : '') + (d.bool ? ' boolblk' : '') + (d.rep ? ' rep' : '');
    return `<span class="${cls}" style="--c:${color}">${d.html(...args)}</span>`;
  }
  const scriptHTML = (s) => `<div class="script">${s.map(blockHTML).join('')}</div>`;
  const scriptsHTML = (q) => (q.scripts ? `<div class="scripts">${q.scripts.map(scriptHTML).join('')}</div>` : scriptHTML(q.script));

  window.SB = { esc, shuffle, CATS, CAT_NAME, FLAG, DEFS, inp, boolPill, blockHTML, scriptHTML, scriptsHTML };
})();
