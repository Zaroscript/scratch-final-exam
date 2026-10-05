(() => {
  'use strict';

  const SB = window.SB;
  const { esc, shuffle, CATS, blockHTML, scriptHTML, scriptsHTML } = SB;
  const EXAM = window.EXAM;
  const PROJECT = window.PROJECT;
  const QS = EXAM.questions;
  const N = QS.length;
  const TOTAL_MS = EXAM.minutes * 60 * 1000;
  const screen = document.getElementById('screen');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- التخزين (آمن إذا كان محظوراً) ---------- */
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem('scratchExam.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem('scratchExam.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- الصوت ---------- */
  let actx = null;
  let muted = store.get('muted', false);
  const SFX = {
    tap: [[640, .05]],
    ok: [[523, .1], [659, .1], [784, .2]],
    warn: [[440, .12], [440, .12]],
    win: [[523, .13], [659, .13], [784, .13], [1047, .35]],
    done: [[392, .15], [330, .3]]
  };
  function beep(name) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      for (const [f, d] of SFX[name]) {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(actx.destination);
        o.start(t);
        o.stop(t + d + 0.02);
        t += d * 0.9;
      }
    } catch (e) { /* ignore */ }
  }
  const soundBtn = $('#soundBtn');
  function paintSound() {
    soundBtn.textContent = muted ? '🔇' : '🔊';
    soundBtn.setAttribute('aria-pressed', String(!muted));
    soundBtn.setAttribute('aria-label', muted ? 'تشغيل الصوت' : 'كتم الصوت');
  }
  soundBtn.onclick = () => { muted = !muted; store.set('muted', muted); paintSound(); beep('tap'); };
  paintSound();

  const optHTML = (o) => {
    if (typeof o === 'string') return o;
    if (o.script) return scriptHTML(o.script);
    return `<span class="oic" aria-hidden="true">${o.i}</span><span>${o.t}</span>`;
  };
  /* طرف في سؤال التوصيل: كتلة أو نص */
  const sideHTML = (x) => (Array.isArray(x) ? blockHTML(x) : `<span class="ptxt">${x}</span>`);

  /* ---------- المحاكي (مسرح صغير) ---------- */
  const stageHTML = () => `
    <div class="sim">
      <div class="stage" id="stage" role="img" aria-label="مسرح سكراتش">
        <svg class="trail" viewBox="0 0 480 360" preserveAspectRatio="none"><polyline id="trail" points=""></polyline></svg>
        <span class="spr" id="spr">🐱</span>
        <span class="bubble" id="bub" hidden></span>
      </div>
      <div class="sim-btns">
        <button class="btn green" id="runBtn" type="button">▶ شغّل الكود</button>
        <button class="btn ghost" id="resetBtn" type="button">↺ من جديد</button>
      </div>
    </div>`;

  const sim = { run: 0 };
  function setupSim(q) {
    const stage = $('#stage');
    if (!stage) return;
    const spr = $('#spr'), bub = $('#bub'), trail = $('#trail');
    const start = q.simStart || { x: 0, y: 0 };
    let x, y, dir, pts;
    const show = () => {
      const l = ((x + 240) / 480) * 100 + '%';
      const t = ((180 - y) / 360) * 100 + '%';
      spr.style.left = l; spr.style.top = t;
      spr.style.transform = `translate(-50%,-50%) rotate(${dir - 90}deg)`;
      bub.style.left = l; bub.style.top = t;
      trail.setAttribute('points', pts.join(' '));
    };
    const mark = () => pts.push(`${(x + 240).toFixed(1)},${(180 - y).toFixed(1)}`);
    const reset = () => {
      sim.run++;
      x = start.x; y = start.y; dir = 90; pts = [];
      bub.hidden = true;
      spr.style.transition = 'none'; bub.style.transition = 'none';
      mark(); show();
      void spr.offsetWidth;
      spr.style.transition = ''; bub.style.transition = '';
    };
    const program = (q.script || []).filter((b) => b[0] !== 'flag');

    async function exec(list, id) {
      for (const [k, ...a] of list) {
        if (id !== sim.run) return;
        if (k === 'move') {
          const r = (dir * Math.PI) / 180;
          x += a[0] * Math.sin(r); y += a[0] * Math.cos(r);
          mark(); show(); await sleep(480);
        } else if (k === 'turn') {
          dir += (a[0] === 'l' ? -1 : 1) * a[1];
          show(); await sleep(300);
        } else if (k === 'goto') {
          x = a[0]; y = a[1]; mark(); show(); await sleep(480);
        } else if (k === 'changex') {
          x += a[0]; mark(); show(); await sleep(480);
        } else if (k === 'changey') {
          y += a[0]; mark(); show(); await sleep(480);
        } else if (k === 'say') {
          bub.textContent = a[0]; bub.hidden = false;
          await sleep(a[1] ? Math.min(a[1], 2) * 700 : 900);
          if (id !== sim.run) return;
          if (a[1]) bub.hidden = true;
        } else if (k === 'wait') {
          await sleep(Math.min(a[0], 2) * 400);
        } else if (k === 'repeat') {
          for (let i = 0; i < a[0]; i++) { await exec(a[1], id); if (id !== sim.run) return; }
        }
      }
    }
    $('#runBtn').onclick = async () => {
      reset();
      const id = sim.run;
      beep('tap');
      await sleep(120);
      await exec(program, id);
    };
    $('#resetBtn').onclick = reset;
    reset();
  }

  /* ---------- الحالة العامة ---------- */
  const state = {
    name: store.get('name', ''),
    active: false,       // الامتحان جارٍ
    i: 0,
    resp: [],            // إجابات الطفل (حسب نوع السؤال)
    shuf: [],            // ترتيب عشوائي ثابت لكل سؤال
    endAt: 0, startAt: 0,
    tick: null, warned: 0,
    onKey: null
  };
  const LET = ['أ', 'ب', 'ج', 'د', 'هـ'];
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };

  document.addEventListener('keydown', (e) => { if (state.onKey && !e.ctrlKey && !e.metaKey && !e.altKey) state.onKey(e); });
  window.addEventListener('beforeunload', (e) => { if (state.active) { e.preventDefault(); e.returnValue = ''; } });

  function setScreen(html) {
    sim.run++;
    state.onKey = null;
    screen.innerHTML = html;
    window.scrollTo({ top: 0 });
  }

  /* ---------- نافذة منبثقة ---------- */
  function modal({ icon, title, body, actions }) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="mTitle">
      <div class="m-ico" aria-hidden="true">${icon}</div><h2 id="mTitle">${title}</h2><p>${body}</p>
      <div class="btn-row">${actions.map((a, i) => `<button class="btn ${a.cls || ''}" type="button" data-a="${i}">${a.label}</button>`).join('')}</div></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    $$('button', ov).forEach((b) => b.onclick = () => { close(); const a = actions[+b.dataset.a]; if (a.onClick) a.onClick(); });
    $('button', ov).focus();
    return close;
  }

  /* ---------- أنواع الأسئلة ----------
     render(q, box, ctx)  يرسم السؤال ويحفظ الإجابة عبر ctx.save
     done(q, r)           هل الإجابة مكتملة؟
     grade(q, r)          هل الإجابة صحيحة؟
     show(q, r)           إجابة الطفل للمراجعة
     sol(q)               الإجابة الصحيحة
  */
  const TYPES = {
    mcq: {
      render(q, box, ctx) {
        const order = ctx.shuf(() => shuffle(q.options.map((_, i) => i)));
        box.innerHTML = `<div class="opts" role="group" aria-label="الاختيارات">${order.map((oi, n) =>
          `<button class="opt" type="button" data-i="${oi}" aria-pressed="false"><span class="badge">${LET[n]}</span><span class="otxt">${optHTML(q.options[oi])}</span><span class="mark" aria-hidden="true"></span></button>`).join('')}</div>`;
        const btns = $$('.opt', box);
        const paint = () => btns.forEach((b) => { const on = +b.dataset.i === ctx.resp; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); });
        btns.forEach((b) => b.onclick = () => { ctx.save(+b.dataset.i); beep('tap'); paint(); });
        paint();
        state.onKey = (e) => { const n = +e.key; if (n >= 1 && n <= btns.length) btns[n - 1].click(); };
      },
      done: (q, r) => r !== undefined,
      grade: (q, r) => r === q.answer,
      show: (q, r) => optHTML(q.options[r]),
      sol: (q) => optHTML(q.options[q.answer])
    },

    tf: {
      render(q, box, ctx) {
        box.innerHTML = `<div class="opts two" role="group" aria-label="صح أو خطأ">
          <button class="opt" type="button" data-v="true" aria-pressed="false"><span class="otxt">✅ صح</span></button>
          <button class="opt" type="button" data-v="false" aria-pressed="false"><span class="otxt">❌ خطأ</span></button></div>`;
        const btns = $$('.opt', box);
        const paint = () => btns.forEach((b) => { const on = (b.dataset.v === 'true') === ctx.resp; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); });
        btns.forEach((b) => b.onclick = () => { ctx.save(b.dataset.v === 'true'); beep('tap'); paint(); });
        paint();
        state.onKey = (e) => { if (e.key === '1') btns[0].click(); if (e.key === '2') btns[1].click(); };
      },
      done: (q, r) => r !== undefined,
      grade: (q, r) => r === q.answer,
      show: (q, r) => (r ? 'صح' : 'خطأ'),
      sol: (q) => (q.answer ? 'صح' : 'خطأ')
    },

    order: {
      render(q, box, ctx) {
        const n = q.items.length;
        const pool = ctx.shuf(() => {
          let p = shuffle([...Array(n).keys()]);
          while (n > 1 && p.every((v, i) => v === i)) p = shuffle(p);
          return p;
        });
        const placed = ctx.resp ? [...ctx.resp] : [];
        box.innerHTML = '<p class="tip">اضغط على الكتل بالترتيب الصحيح. واضغط على كتلة في الأعلى لإرجاعها.</p><div class="drop" id="drop"></div><div class="pool" id="pool"></div>';
        const drop = $('#drop'), poolEl = $('#pool');
        function paint() {
          drop.innerHTML = placed.map((idx, pos) =>
            `<button class="slotb" type="button" data-i="${idx}" aria-label="إرجاع الكتلة رقم ${pos + 1}"><span class="num">${pos + 1}</span>${blockHTML(q.items[idx])}</button>`).join('') +
            (placed.length < n ? `<span class="empty-slot">${placed.length ? 'اختر الكتلة التالية...' : 'ابدأ باختيار الكتلة الأولى من الأسفل 👇'}</span>` : '');
          poolEl.innerHTML = pool.filter((i) => !placed.includes(i)).map((idx) =>
            `<button class="poolb" type="button" data-i="${idx}">${blockHTML(q.items[idx])}</button>`).join('');
          $$('.slotb', drop).forEach((b) => b.onclick = () => { placed.splice(placed.indexOf(+b.dataset.i), 1); ctx.save(placed.slice()); beep('tap'); paint(); });
          $$('.poolb', poolEl).forEach((b) => b.onclick = () => { placed.push(+b.dataset.i); ctx.save(placed.slice()); beep('tap'); paint(); });
        }
        paint();
      },
      done: (q, r) => !!r && r.length === q.items.length,
      grade: (q, r) => !!r && r.length === q.items.length && r.every((v, i) => v === i),
      show: (q, r) => (r && r.length ? scriptHTML(r.map((i) => q.items[i])) : '—'),
      sol: (q) => scriptHTML(q.items)
    },

    match: {
      render(q, box, ctx) {
        const n = q.pairs.length;
        const rightOrder = ctx.shuf(() => shuffle([...Array(n).keys()]));
        const map = ctx.resp ? [...ctx.resp] : new Array(n).fill(null);
        let sel = null;
        box.innerHTML = `<p class="tip">اضغط على عنصر من اليمين، ثم اضغط على ما يناسبه من اليسار.</p>
          <div class="match">
            <div class="col">${q.pairs.map((p, i) => `<button class="mi" type="button" data-l="${i}">${sideHTML(p[0])}<span class="pn"></span></button>`).join('')}</div>
            <div class="col">${rightOrder.map((ri) => `<button class="mi" type="button" data-r="${ri}">${sideHTML(q.pairs[ri][1])}<span class="pn"></span></button>`).join('')}</div>
          </div>`;
        const L = $$('[data-l]', box), R = $$('[data-r]', box);
        function paint() {
          L.forEach((b, i) => {
            b.className = 'mi' + (sel === i ? ' sel' : '') + (map[i] !== null ? ` paired pc${i % 4}` : '');
            b.querySelector('.pn').textContent = map[i] !== null ? i + 1 : '';
          });
          R.forEach((b) => {
            const li = map.indexOf(+b.dataset.r);
            b.className = 'mi' + (li >= 0 ? ` paired pc${li % 4}` : '');
            b.querySelector('.pn').textContent = li >= 0 ? li + 1 : '';
          });
        }
        L.forEach((b, i) => b.onclick = () => { sel = sel === i ? null : i; beep('tap'); paint(); });
        R.forEach((b) => b.onclick = () => {
          if (sel === null) return;
          const ri = +b.dataset.r;
          const prev = map.indexOf(ri);
          if (prev >= 0) map[prev] = null;
          map[sel] = ri; sel = null;
          ctx.save(map.slice()); beep('tap'); paint();
        });
        paint();
      },
      done: (q, r) => !!r && r.every((v) => v !== null),
      grade: (q, r) => !!r && r.every((v, i) => v === i),
      show: (q, r) => q.pairs.map((p, i) => {
        const got = r && r[i] !== null && r[i] !== undefined ? sideHTML(q.pairs[r[i]][1]) : '—';
        const ok = r && r[i] === i;
        return `<div class="solrow">${sideHTML(p[0])} ← <span class="pairs-ans ${ok ? 'ok' : 'bad'}">${got}</span></div>`;
      }).join(''),
      sol: (q) => q.pairs.map((p) => `<div class="solrow">${sideHTML(p[0])} ← <span class="pairs-ans ok">${sideHTML(p[1])}</span></div>`).join('')
    },

    pick: {
      render(q, box, ctx) {
        box.innerHTML = `<p class="tip">اضغط على الكتلة الخاطئة.</p><div class="script pickable">${q.script.map((s, i) => `<button class="pk" type="button" data-i="${i}" aria-pressed="false">${blockHTML(s)}</button>`).join('')}</div>`;
        const btns = $$('.pk', box);
        const paint = () => btns.forEach((b) => { const on = +b.dataset.i === ctx.resp; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); });
        btns.forEach((b) => b.onclick = () => { ctx.save(+b.dataset.i); beep('tap'); paint(); });
        paint();
      },
      done: (q, r) => r !== undefined,
      grade: (q, r) => r === q.answer,
      show: (q, r) => `<div class="script">${blockHTML(q.script[r])}</div>`,
      sol: (q) => q.solution
    },

    /* ركّب الكود بنفسك */
    build: {
      render(q, box, ctx) {
        const order = ctx.shuf(() => shuffle(q.palette.map((_, i) => i)));
        SB.builder.create(box, {
          palette: q.palette, order, initial: ctx.resp,
          onChange: (specs) => ctx.save(specs)
        });
      },
      done: (q, r) => Array.isArray(r) && r.length > 0,
      grade: (q, r) => SB.builder.matches(r, q.solution, q.alts),
      show: (q, r) => (r && r.length ? scriptHTML(r) : '—'),
      sol: (q) => scriptHTML(q.solution)
    }
  };

  const isDone = (i) => TYPES[QS[i].type].done(QS[i], state.resp[i]);
  const answeredCount = () => QS.reduce((n, _, i) => n + (isDone(i) ? 1 : 0), 0);

  /* ---------- شاشة الترحيب ---------- */
  const projProgress = () => {
    const d = store.get('proj.done', {});
    return PROJECT.steps.filter((s) => d[s.id]).length;
  };

  function showHome() {
    state.active = false;
    clearInterval(state.tick);
    document.body.classList.remove('print-cert');
    const best = store.get('best', null);
    const examDone = store.get('examDone', false);
    const pp = projProgress();
    const PN = PROJECT.steps.length;
    setScreen(`
      <section class="card hero">
        <span class="hero-cat" aria-hidden="true">🐱</span>
        <h1>${esc(EXAM.title)}</h1>
        <p>أهلاً بك يا صانع الألعاب! اختبر معلوماتك عن أوامر سكراتش، ثم اصنع لعبتك الخاصة في مشروع التخرج.</p>
        <ul class="rules">
          <li>📝 ${N} سؤالاً</li>
          <li>⏳ ${EXAM.minutes} دقيقة</li>
          <li>💯 الدرجة من 100</li>
          <li>🧩 أسئلة تركّب فيها الكود بنفسك</li>
          <li>↔ تقدر ترجع لأي سؤال وتغيّر إجابتك</li>
          <li>📜 شهادة باسمك في النهاية</li>
        </ul>
        <div class="field">
          <label for="nameIn">اكتب اسمك (سيظهر على الشهادة):</label>
          <input id="nameIn" type="text" maxlength="30" autocomplete="off" placeholder="مثال: أحمد محمد" value="${esc(state.name)}" aria-describedby="nameErr">
          <div class="err" id="nameErr" role="alert" hidden>اكتب اسمك أولاً حتى نكتبه على الشهادة 😊</div>
        </div>
        <div class="btn-row"><button class="btn primary big" id="startBtn" type="button">ابدأ الامتحان ◀</button></div>
        ${best !== null ? `<p class="best-line">🏅 أفضل درجة لك: <b>${best}</b> من 100</p>` : ''}
        ${examDone ? `<div class="proj-promo"><span class="pp-ico" aria-hidden="true">🎓</span><div><b>${esc(PROJECT.title)}</b><br><small>أنجزت ${pp} من ${PN} خطوات</small></div><button class="btn green" id="projBtn" type="button">${pp ? 'أكمل المشروع' : 'ابدأ المشروع'} ◀</button></div>` : ''}
      </section>`);
    const nameIn = $('#nameIn');
    const start = () => {
      const v = nameIn.value.trim();
      if (!v) { $('#nameErr').hidden = false; nameIn.focus(); return; }
      state.name = v;
      store.set('name', v);
      startExam();
    };
    $('#startBtn').onclick = start;
    const pb = $('#projBtn');
    if (pb) pb.onclick = () => { if (nameIn.value.trim()) { state.name = nameIn.value.trim(); store.set('name', state.name); } showProject(); };
    nameIn.onkeydown = (e) => { if (e.key === 'Enter') start(); };
    nameIn.oninput = () => { $('#nameErr').hidden = true; };
  }

  /* ---------- بدء الامتحان ---------- */
  function startExam() {
    state.active = true;
    state.i = 0; state.resp = []; state.shuf = []; state.warned = 0;
    state.startAt = Date.now();
    state.endAt = state.startAt + TOTAL_MS;
    clearInterval(state.tick);
    state.tick = setInterval(onTick, 250);
    beep('tap');
    renderQuestion();
  }

  function onTick() {
    const left = state.endAt - Date.now();
    const t = $('#timer');
    if (t) {
      t.textContent = '⏳ ' + fmt(left);
      t.classList.toggle('warn', left <= 5 * 60000 && left > 60000);
      t.classList.toggle('danger', left <= 60000);
    }
    const live = $('#live');
    if (left <= 5 * 60000 && state.warned < 1) { state.warned = 1; beep('warn'); if (live) live.textContent = 'باقي 5 دقائق'; }
    if (left <= 60000 && state.warned < 2) { state.warned = 2; beep('warn'); if (live) live.textContent = 'باقي دقيقة واحدة'; }
    if (left <= 0 && state.active) timeUp();
  }

  function timeUp() {
    state.active = false;
    clearInterval(state.tick);
    $$('.overlay').forEach((o) => o.remove());
    beep('done');
    modal({
      icon: '⏰', title: 'انتهى الوقت!',
      body: 'تم تسليم إجاباتك تلقائياً. هيا نشوف نتيجتك!',
      actions: [{ label: 'اعرض نتيجتي 🏆', cls: 'primary', onClick: () => showResults() }]
    });
  }

  /* ---------- شاشة السؤال ---------- */
  function renderQuestion() {
    const q = QS[state.i];
    const type = TYPES[q.type];
    const ans = answeredCount();
    setScreen(`
      <section class="card q-card" aria-labelledby="qtext">
        <div class="q-meta">
          <span class="chip">سؤال ${state.i + 1} من ${N}</span>
          <span class="chip ok" id="answeredChip">✅ أجبت عن ${ans}</span>
          <span class="chip timer" id="timer" role="timer" aria-label="الوقت المتبقي">⏳ ${fmt(state.endAt - Date.now())}</span>
        </div>
        <div class="progress" role="progressbar" aria-label="عدد الأسئلة المجاب عنها" aria-valuemin="0" aria-valuemax="${N}" aria-valuenow="${ans}"><i id="bar" style="width:${(ans / N) * 100}%"></i></div>
        <nav class="navdots" aria-label="أرقام الأسئلة">${QS.map((_, i) =>
          `<button type="button" class="${isDone(i) ? 'done' : ''}${i === state.i ? ' cur' : ''}" data-go="${i}" aria-label="السؤال ${i + 1}${isDone(i) ? ' (تمت الإجابة)' : ''}"${i === state.i ? ' aria-current="step"' : ''}>${i + 1}</button>`).join('')}</nav>
        ${q.type === 'build' ? '<span class="qtag">🧩 ركّب الكود بنفسك</span>' : ''}
        <h2 class="q-text" id="qtext" tabindex="-1">${q.q}</h2>
        ${q.visual ? SB.visual(q.visual) : ''}
        ${(q.script || q.scripts) && q.type !== 'pick' ? scriptsHTML(q) : ''}
        ${q.sim ? stageHTML() : ''}
        <div id="answer"></div>
        <div class="navbtns">
          <button class="btn" id="prevBtn" type="button"${state.i === 0 ? ' disabled' : ''}>▶ السابق</button>
          ${state.i === N - 1
            ? '<button class="btn green" id="finishBtn" type="button">🏁 تسليم الامتحان</button>'
            : '<button class="btn primary" id="nextBtn" type="button">التالي ◀</button>'}
        </div>
        ${state.i === N - 1 ? '' : '<div class="finish-row"><button class="btn ghost small" id="finishBtn2" type="button">🏁 تسليم الامتحان الآن</button></div>'}
        <div class="sr-only" id="live" aria-live="polite"></div>
      </section>`);
    onTick();

    $$('.navdots button').forEach((b) => b.onclick = () => go(+b.dataset.go));
    $('#prevBtn').onclick = () => go(state.i - 1);
    const nb = $('#nextBtn'); if (nb) nb.onclick = () => go(state.i + 1);
    $$('#finishBtn, #finishBtn2').forEach((b) => b.onclick = askFinish);

    setupSim(q);
    const idx = state.i;
    const ctx = {
      resp: state.resp[idx],
      save(v) {
        state.resp[idx] = v;
        ctx.resp = v;
        const c = answeredCount();
        $('#answeredChip').textContent = '✅ أجبت عن ' + c;
        $('#bar').style.width = (c / N) * 100 + '%';
        $('.progress').setAttribute('aria-valuenow', c);
        $(`.navdots [data-go="${idx}"]`).classList.toggle('done', isDone(idx));
      },
      shuf(make) { return state.shuf[idx] || (state.shuf[idx] = make()); }
    };
    type.render(q, $('#answer'), ctx);
    $('#qtext').focus({ preventScroll: true });
  }

  function go(i) {
    if (i < 0 || i >= N || !state.active) return;
    state.i = i;
    renderQuestion();
  }

  function askFinish() {
    const left = N - answeredCount();
    modal({
      icon: left ? '🤔' : '🏁',
      title: 'تسليم الامتحان؟',
      body: left
        ? `ما زال عندك <b>${left}</b> ${left === 1 ? 'سؤال' : 'أسئلة'} بدون إجابة كاملة. هل تريد التسليم الآن؟`
        : 'أجبت عن كل الأسئلة. هل أنت متأكد أنك تريد تسليم الامتحان؟',
      actions: [
        { label: 'أكمل الامتحان', cls: '' },
        { label: 'سلّم الامتحان ✔', cls: 'primary', onClick: () => { state.active = false; clearInterval(state.tick); showResults(); } }
      ]
    });
  }

  /* ---------- النتيجة ---------- */
  function rating(score) {
    if (score >= 90) return { t: 'امتياز', msg: 'أنت صانع ألعاب محترف! 🏆' };
    if (score >= 80) return { t: 'جيد جداً', msg: 'أداء رائع، قريب جداً من الدرجة الكاملة! 🌟' };
    if (score >= 65) return { t: 'جيد', msg: 'نتيجة جيدة، راجع الأخطاء وستتحسن أكثر. 👍' };
    if (score >= 50) return { t: 'مقبول', msg: 'بداية جيدة! راجع إجاباتك وحاول مرة أخرى. 💪' };
    return { t: 'مشاركة', msg: 'كل مبرمج كبير بدأ بخطوة. راجع الشرح وجرّب مرة أخرى! 🌱' };
  }

  const dateAr = () => new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  function showResults() {
    state.active = false;
    clearInterval(state.tick);
    store.set('examDone', true);
    const items = QS.map((q, i) => {
      const t = TYPES[q.type];
      const r = state.resp[i];
      const done = t.done(q, r);
      return { q, i, r, done, ok: done && t.grade(q, r) };
    });
    const correct = items.filter((x) => x.ok).length;
    const skipped = items.filter((x) => !x.done).length;
    const wrong = N - correct - skipped;
    const score = Math.round((correct / N) * 100);
    const used = Math.min(Date.now() - state.startAt, TOTAL_MS);
    const rt = rating(score);
    const prevBest = store.get('best', null);
    if (prevBest === null || score > prevBest) store.set('best', score);
    const color = score >= 65 ? '#17794a' : score >= 50 ? '#9a5d00' : '#b83232';
    const stars = score >= 90 ? 3 : score >= 65 ? 2 : 1;
    const pp = projProgress();

    setScreen(`
      <section class="card result" id="resultTop">
        <div class="ring" style="--p:0;--ringc:${color}" id="ring" role="img" aria-label="الدرجة ${score} من 100"><b>${score}</b><small>من 100</small></div>
        <div class="stars" aria-label="${stars} من 3 نجوم">${[1, 2, 3].map((n) => `<span class="${n <= stars ? '' : 'off'}">⭐</span>`).join('')}</div>
        <h2>${esc(state.name)}، تقديرك: ${rt.t}</h2>
        <p>${rt.msg}</p>
        <div class="stats">
          <span class="stat good">✅ ${correct} صحيحة</span>
          <span class="stat bad">❌ ${wrong} خاطئة</span>
          ${skipped ? `<span class="stat skip">➖ ${skipped} بلا إجابة</span>` : ''}
          <span class="stat">⏱ ${fmt(used)} من ${EXAM.minutes}:00</span>
        </div>
        <div class="btn-row">
          <button class="btn primary" data-jump="reviewCard" type="button">🔍 راجع إجاباتك</button>
          <button class="btn green" data-jump="certCard" type="button">📜 شهادتك</button>
          <button class="btn" id="again" type="button">🔁 امتحان جديد</button>
        </div>
      </section>

      <section class="card proj-promo big" aria-label="مشروع التخرج">
        <span class="pp-ico" aria-hidden="true">🎓</span>
        <div><h2 class="sec-title" style="margin:0">الخطوة التالية: ${esc(PROJECT.title)}</h2>
        <p style="margin:4px 0 0;color:var(--muted)">هتصنع لعبة كاملة بنفسك خطوة بخطوة${pp ? ` (أنجزت ${pp} من ${PROJECT.steps.length})` : ''}.</p></div>
        <button class="btn green big" id="projGo" type="button">${pp ? 'أكمل المشروع' : 'ابدأ المشروع'} ◀</button>
      </section>

      <section class="card" id="reviewCard" aria-labelledby="revTitle">
        <h2 id="revTitle" class="sec-title">🔍 مراجعة الإجابات</h2>
        <div class="filters" role="group" aria-label="تصفية الأسئلة">
          <button type="button" class="fchip on" data-f="all">الكل (${N})</button>
          <button type="button" class="fchip" data-f="ok">الصحيحة (${correct})</button>
          <button type="button" class="fchip" data-f="bad">الأخطاء (${wrong + skipped})</button>
        </div>
        <div id="rlist">${items.map(reviewItem).join('')}</div>
        <div class="empty-note" id="emptyNote" hidden>🎉 لا توجد أسئلة هنا!</div>
      </section>

      <section class="card cert-card" id="certCard" aria-labelledby="certTitle">
        <h2 id="certTitle" class="sec-title no-print">📜 شهادتك</h2>
        <div class="cert"><div class="cert-in">
          <div class="cert-ico" aria-hidden="true">🏅</div>
          <h3>شهادة ${score >= 50 ? 'تقدير' : 'مشاركة'}</h3>
          <p>نشهد بأن البطل</p>
          <div class="cert-name">${esc(state.name)}</div>
          <p>أتمّ ${esc(EXAM.title)}<br>وحصل على <b>${score}</b> من 100 بتقدير <b>${rt.t}</b></p>
          <div class="cert-foot"><span>${dateAr()}</span><span>${'⭐'.repeat(stars)}</span></div>
        </div></div>
        <div class="btn-row no-print"><button class="btn green" id="print" type="button">🖨 اطبع الشهادة أو احفظها PDF</button></div>
      </section>`);

    $$('[data-jump]').forEach((b) => b.onclick = () => $('#' + b.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('#again').onclick = showHome;
    $('#projGo').onclick = () => showProject();
    $$('.fchip').forEach((b) => b.onclick = () => {
      $$('.fchip').forEach((x) => x.classList.toggle('on', x === b));
      let shown = 0;
      $$('.ritem').forEach((el) => {
        const show = b.dataset.f === 'all' || (b.dataset.f === 'ok' ? el.dataset.s === 'ok' : el.dataset.s !== 'ok');
        el.hidden = !show; if (show) shown++;
      });
      $('#emptyNote').hidden = shown > 0;
    });
    wirePrint();

    beep(score >= 50 ? 'win' : 'done');
    if (score >= 50) confetti();
    const ring = $('#ring'), t0 = performance.now();
    (function tick(t) {
      const k = Math.min(1, (t - t0) / 900);
      ring.style.setProperty('--p', Math.round(score * k));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function wirePrint() {
    const pr = $('#print');
    if (!pr) return;
    pr.onclick = () => { document.body.classList.add('print-cert'); window.print(); };
    window.addEventListener('afterprint', () => document.body.classList.remove('print-cert'));
  }

  function reviewItem(x) {
    const { q, i, r, done, ok } = x;
    const t = TYPES[q.type];
    const status = ok ? 'ok' : done ? 'bad' : 'skip';
    const label = ok ? '✔ إجابة صحيحة' : done ? '✖ إجابة خاطئة' : '➖ لم تُكمل الإجابة';
    return `<article class="ritem ${status}" data-s="${status}">
      <div class="rhead"><span class="rn">${i + 1}</span><span class="rs">${label}</span>${q.type === 'build' ? '<span class="qtag">🧩 ركّب الكود</span>' : ''}</div>
      <div class="qn">${q.q}</div>
      ${q.visual ? SB.visual(q.visual) : ''}
      ${q.script || q.scripts ? scriptsHTML(q) : ''}
      ${ok ? '' : `<div class="yours"><b>إجابتك:</b> ${r === undefined ? '— لم تُجب' : t.show(q, r)}</div>`}
      <div class="sol"><b>${ok ? 'إجابتك الصحيحة:' : 'الإجابة الصحيحة:'}</b> ${t.sol(q)}</div>
      ${q.explain ? `<p class="why">💡 ${q.explain}</p>` : ''}
    </article>`;
  }

  /* ============================================================
     مشروع التخرج
     ============================================================ */
  const projDone = () => store.get('proj.done', {});

  function showProject(idx) {
    const steps = PROJECT.steps;
    if (idx === undefined) idx = Math.min(store.get('proj.step', 0), steps.length - 1);
    store.set('proj.step', idx);
    const step = steps[idx];
    const last = idx === steps.length - 1;
    const doneMap = projDone();
    const count = () => steps.filter((s) => projDone()[s.id]).length;

    setScreen(`
      <section class="card proj-card" aria-labelledby="ptitle">
        <div class="q-meta">
          <span class="chip purple">🎓 ${esc(PROJECT.game)}</span>
          <span class="chip ok" id="pCount">✅ أنجزت ${count()} من ${steps.length}</span>
          <a class="btn small green" id="openScratch" href="${PROJECT.editorUrl}" target="_blank" rel="noopener">🔗 افتح Scratch</a>
        </div>
        <div class="progress" role="progressbar" aria-label="تقدمك في المشروع" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${count()}"><i id="pBar" style="width:${(count() / steps.length) * 100}%"></i></div>
        <nav class="navdots" aria-label="خطوات المشروع">${steps.map((s, i) =>
          `<button type="button" class="${doneMap[s.id] ? 'done' : ''}${i === idx ? ' cur' : ''}" data-pg="${i}" aria-label="الخطوة ${i + 1}: ${esc(s.title)}"${i === idx ? ' aria-current="step"' : ''}>${i + 1}</button>`).join('')}</nav>

        ${idx === 0 ? `<div class="proj-intro"><span class="hero-cat sm" aria-hidden="true">🎮</span><p>${PROJECT.intro}</p></div>` : ''}

        <h2 class="q-text" id="ptitle" tabindex="-1">${step.emoji} الخطوة ${idx + 1}: ${step.title}</h2>
        <p class="goal">${step.goal}</p>
        ${step.visual ? SB.visual(step.visual) : ''}

        <h3 class="sub">📋 ماذا تفعل في Scratch؟</h3>
        <ol class="tasks">${step.tasks.map((t) => `<li>${t}</li>`).join('')}</ol>

        ${step.blocks && step.blocks.length ? `<h3 class="sub">🧩 الكتل التي ستحتاجها</h3>
          <div class="script need">${step.blocks.map(blockHTML).join('')}</div>` : ''}

        ${step.bonus ? `<h3 class="sub">🚀 تحديات إضافية (اختيارية)</h3><ul class="tasks bonus">${step.bonus.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}

        ${step.practice ? `<details class="practice" id="practice">
          <summary>🎮 جرّب ترتيب الكتل هنا أولاً (اختياري)</summary>
          <div id="pbox"></div>
          <div class="btn-row">
            <button class="btn primary" id="pcheck" type="button">✔ تحقق من الكود</button>
            <button class="btn ghost" id="psol" type="button">👀 أرني الحل</button>
          </div>
          <div class="pfb" id="pfb" role="status" hidden></div>
          <div id="psolbox" hidden></div>
        </details>` : ''}

        ${step.tip ? `<div class="tipbox">💡 ${step.tip}</div>` : ''}

        <div class="btn-row"><button class="btn ${doneMap[step.id] ? 'green' : ''}" id="doneBtn" type="button" aria-pressed="${!!doneMap[step.id]}">${doneMap[step.id] ? '✅ أنجزت هذه الخطوة' : '⬜ أنجزت هذه الخطوة؟ اضغط للتأكيد'}</button></div>

        <div class="navbtns">
          <button class="btn" id="pPrev" type="button"${idx === 0 ? ' disabled' : ''}>▶ السابق</button>
          <button class="btn primary" id="pNext" type="button">${last ? '🎓 شهادة المشروع' : 'التالي ◀'}</button>
        </div>
        <div class="finish-row"><button class="btn ghost small" id="pHome" type="button">🏠 الرئيسية</button></div>
      </section>`);

    $$('[data-pg]').forEach((b) => b.onclick = () => showProject(+b.dataset.pg));
    $('#pPrev').onclick = () => showProject(idx - 1);
    $('#pHome').onclick = showHome;
    $('#pNext').onclick = () => {
      if (!last) { showProject(idx + 1); return; }
      const left = steps.length - count();
      if (left === 0) { showProjectDone(); return; }
      modal({
        icon: '🧱', title: 'لسه فيه خطوات!',
        body: `باقي <b>${left}</b> ${left === 1 ? 'خطوة' : 'خطوات'} لم تُؤكَّد بعد. أكملها أولاً ثم احصل على شهادة المشروع.`,
        actions: [{ label: 'حسناً', cls: 'primary' }]
      });
    };
    $('#doneBtn').onclick = () => {
      const d = projDone();
      d[step.id] = !d[step.id];
      store.set('proj.done', d);
      const b = $('#doneBtn');
      b.classList.toggle('green', !!d[step.id]);
      b.setAttribute('aria-pressed', String(!!d[step.id]));
      b.textContent = d[step.id] ? '✅ أنجزت هذه الخطوة' : '⬜ أنجزت هذه الخطوة؟ اضغط للتأكيد';
      $(`[data-pg="${idx}"]`).classList.toggle('done', !!d[step.id]);
      const c = count();
      $('#pCount').textContent = `✅ أنجزت ${c} من ${steps.length}`;
      $('#pBar').style.width = (c / steps.length) * 100 + '%';
      beep(d[step.id] ? 'ok' : 'tap');
      if (d[step.id] && c === steps.length) {
        confetti();
        modal({
          icon: '🎉', title: 'أنجزت كل الخطوات!',
          body: 'مبروك! لعبتك جاهزة. اضغط لتحصل على شهادة مشروع التخرج.',
          actions: [{ label: 'لاحقاً', cls: '' }, { label: 'شهادة المشروع 🎓', cls: 'primary', onClick: showProjectDone }]
        });
      }
    };

    /* التمرين */
    if (step.practice) {
      const pr = step.practice;
      let cur = pr.initial || [];
      const fb = $('#pfb');
      SB.builder.create($('#pbox'), {
        palette: pr.palette,
        order: shuffle(pr.palette.map((_, i) => i)),
        initial: pr.initial,
        onChange: (s) => { cur = s; fb.hidden = true; }
      });
      $('#pcheck').onclick = () => {
        const d = SB.builder.diagnose(cur, pr.solution);
        fb.className = 'pfb ' + (d.ok ? 'ok' : 'bad');
        fb.innerHTML = d.html + (d.ok || !pr.hint ? '' : `<div class="phint">💡 ${pr.hint}</div>`);
        fb.hidden = false;
        beep(d.ok ? 'ok' : 'tap');
      };
      $('#psol').onclick = () => {
        const sb = $('#psolbox');
        sb.innerHTML = `<p class="tip">هذا هو الكود الكامل:</p>${scriptHTML(pr.solution)}`;
        sb.hidden = false;
      };
    }
    $('#ptitle').focus({ preventScroll: true });
  }

  function showProjectDone() {
    const total = PROJECT.steps.length;
    setScreen(`
      <section class="card result">
        <div class="hero-cat" aria-hidden="true">🏆</div>
        <h2>مبروك ${esc(state.name || 'يا بطل')}! أنجزت ${esc(PROJECT.game)}</h2>
        <p>صنعت لعبة كاملة بنفسك في ${total} خطوات. هذا هو الكود النهائي:</p>
        <div class="scripts final">${PROJECT.finalScripts.map((f) => `<div><div class="duo-sp" style="font-size:1rem">${esc(f.sprite)}</div>${scriptHTML(f.script)}</div>`).join('')}</div>
        <div class="btn-row">
          <button class="btn" id="pBack" type="button">▶ ارجع للخطوات</button>
          <button class="btn" id="pHome2" type="button">🏠 الرئيسية</button>
        </div>
      </section>

      <section class="card cert-card" id="certCard" aria-labelledby="certTitle">
        <h2 id="certTitle" class="sec-title no-print">📜 شهادة مشروع التخرج</h2>
        <div class="cert"><div class="cert-in">
          <div class="cert-ico" aria-hidden="true">🎓</div>
          <h3>شهادة مشروع التخرج</h3>
          <p>نشهد بأن البطل</p>
          <div class="cert-name">${esc(state.name || 'يا بطل')}</div>
          <p>أتمّ بنجاح مشروع صناعة اللعبة<br><b class="en" dir="ltr">${esc(PROJECT.game)}</b><br>على برنامج <b class="en" dir="ltr">Scratch</b></p>
          <div class="cert-foot"><span>${dateAr()}</span><span>🌟🌟🌟</span></div>
        </div></div>
        <div class="btn-row no-print"><button class="btn green" id="print" type="button">🖨 اطبع الشهادة أو احفظها PDF</button></div>
      </section>`);
    $('#pBack').onclick = () => showProject(PROJECT.steps.length - 1);
    $('#pHome2').onclick = showHome;
    wirePrint();
    beep('win');
    confetti();
  }

  /* ---------- الاحتفال ---------- */
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = $('#confetti');
    const ctx = cv.getContext('2d');
    const W = (cv.width = window.innerWidth);
    const H = (cv.height = window.innerHeight);
    const cols = Object.values(CATS);
    const ps = Array.from({ length: 140 }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * H * 0.5,
      w: 6 + Math.random() * 8, h: 8 + Math.random() * 10,
      c: pick(cols), vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3,
      r: Math.random() * 6, vr: -0.2 + Math.random() * 0.4
    }));
    const end = performance.now() + 4200;
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t < end) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(performance.now());
  }

  /* ---------- الرأس ---------- */
  $('#homeBtn').onclick = () => {
    if (!state.active) { showHome(); return; }
    modal({
      icon: '⚠️', title: 'ترك الامتحان؟',
      body: 'لو رجعت للرئيسية ستضيع إجاباتك الحالية.',
      actions: [
        { label: 'أكمل الامتحان', cls: 'primary' },
        { label: 'اخرج', cls: '', onClick: showHome }
      ]
    });
  };

  showHome();
})();
