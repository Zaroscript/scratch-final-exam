/* ============================================================
   builder.js: أداة «ركّب الكود بنفسك»
   - اضغط على كتلة من الأسفل لتُضاف في المكان المحدد (الشريط الأصفر)
   - أو اسحبها وأفلتها في أي مكان داخل منطقة الكود
   - الكتل ذات الشكل C (مثل forever و if) تستقبل كتلاً بداخلها
   ============================================================ */
(() => {
  'use strict';
  const { DEFS, blockHTML, scriptHTML, esc } = window.SB;

  /* ---------- تحويل بين الشكل المخزَّن والشكل الداخلي ---------- */
  const fromSpec = (spec) => {
    const [k, ...a] = spec;
    if (DEFS[k].c) { const kids = a.pop(); return { k, a, kids: kids.map(fromSpec) }; }
    return { k, a };
  };
  const toSpec = (n) => (DEFS[n.k].c ? [n.k, ...n.a, n.kids.map(toSpec)] : [n.k, ...n.a]);
  const isHat = (k) => !!DEFS[k].hat;
  const parsePath = (s) => (s ? s.split('.').filter((x) => x !== '').map(Number) : []);

  /* ---------- مقارنة الحلول ---------- */
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const matches = (resp, sol, alts) => !!resp && [sol, ...(alts || [])].some((s) => same(resp, s));

  /* قائمة مسطحة برؤوس الكتل (بدون الأبناء) لتشخيص الأخطاء */
  const flat = (script, out = []) => {
    script.forEach((s) => {
      const d = DEFS[s[0]];
      if (d.c) { out.push(JSON.stringify(s.slice(0, -1))); flat(s[s.length - 1], out); } else out.push(JSON.stringify(s));
    });
    return out;
  };
  /* يرجع رسالة مساعدة تشرح للطالب ما ينقصه دون أن تعطيه الحل كاملاً */
  function diagnose(resp, sol, alts) {
    if (!resp || !resp.length) return { ok: false, html: 'ابدأ بإضافة الكتل من الأسفل 👇' };
    if (matches(resp, sol, alts)) return { ok: true, html: '🎉 ممتاز! الكود صحيح.' };
    const have = flat(resp), need = flat(sol);
    const miss = need.filter((x) => { const i = have.indexOf(x); if (i >= 0) { have.splice(i, 1); return false; } return true; });
    const extra = have;
    const show = (j) => blockHTML(JSON.parse(j).concat(DEFS[JSON.parse(j)[0]].c ? [[]] : []));
    if (miss.length) return { ok: false, html: `ينقصك كتلة مثل: ${show(miss[0])}` };
    if (extra.length) return { ok: false, html: `عندك كتلة زيادة لا نحتاجها: ${show(extra[0])}` };
    return { ok: false, html: 'الكتل صحيحة 👍 لكن الترتيب أو مكانها داخل الكتل الأخرى غير صحيح. جرّب مرة أخرى.' };
  }

  /* ---------- الأداة نفسها ---------- */
  /* opts: { palette:[spec], order:[indexes], initial:[spec], onChange(specs) } */
  function create(box, opts) {
    const { palette, onChange } = opts;
    const order = opts.order || palette.map((_, i) => i);
    let tree = (opts.initial || []).map(fromSpec);
    let active = { c: [], i: tree.length };
    let msgTimer = null;
    let suppressClick = false;

    const listAt = (c) => c.reduce((l, idx) => l[idx].kids, tree);
    const emit = () => onChange && onChange(tree.map(toSpec));

    function flash(text) {
      const m = box.querySelector('.bld-msg');
      if (!m) return;
      m.textContent = text; m.hidden = false;
      clearTimeout(msgTimer);
      msgTimer = setTimeout(() => { m.hidden = true; }, 2600);
    }

    /* ---- الرسم ---- */
    function slotHTML(c, i, list) {
      const on = active.c.join('.') === c.join('.') && active.i === i;
      const empty = list.length === 0;
      const label = empty ? (c.length ? 'ضع الكتل هنا' : 'اضغط على كتلة من الأسفل أو اسحبها هنا') : '';
      return `<button class="slot${on ? ' on' : ''}${empty ? ' empty' : ''}" type="button" data-c="${c.join('.')}" data-i="${i}" aria-label="مكان الإدراج رقم ${i + 1}${on ? ' (المحدد)' : ''}">${label}</button>`;
    }
    function listHTML(list, c) {
      let out = '';
      /* لا نعرض خانة قبل كتلة البداية */
      if (!(c.length === 0 && list[0] && isHat(list[0].k))) out += slotHTML(c, 0, list);
      list.forEach((n, i) => { out += nodeHTML(n, c, i) + slotHTML(c, i + 1, list); });
      return out;
    }
    function nodeHTML(n, c, i) {
      const d = DEFS[n.k];
      const color = window.SB.CATS[d.cat];
      const del = `<button class="bdel" type="button" data-del="1" data-c="${c.join('.')}" data-i="${i}" aria-label="احذف الكتلة">✕</button>`;
      const at = `data-nc="${c.join('.')}" data-ni="${i}"`;
      if (d.c) {
        const inner = listHTML(n.kids, [...c, i]);
        return `<span class="cb" ${at} style="--c:${color}"><span class="brow">${d.html(...n.a)}${del}</span><span class="cin">${inner}</span><span class="cend"></span></span>`;
      }
      const cls = 'blk' + (d.hat ? ' hat' : '') + (d.bool ? ' boolblk' : '') + (d.rep ? ' rep' : '');
      return `<span class="${cls}" ${at} style="--c:${color}">${d.html(...n.a)}${del}</span>`;
    }

    function render() {
      box.innerHTML = `<div class="bld">
        <div class="bld-code">
          <div class="bld-title"><span>🧱 الكود الذي تبنيه</span><button class="btn ghost small" type="button" data-clear="1">🗑 امسح الكل</button></div>
          <div class="script bscript">${listHTML(tree, [])}</div>
          <div class="bld-msg" role="status" hidden></div>
        </div>
        <div class="bld-pal">
          <div class="bld-title"><span>🎒 الكتل المتاحة (اضغط أو اسحب)</span></div>
          <div class="palwrap">${order.map((i) => `<button class="pal" type="button" data-p="${i}">${blockHTML(palette[i])}</button>`).join('')}</div>
        </div>
      </div>`;
      wire();
    }

    /* ---- العمليات ---- */
    function insert(c, i, p) {
      const spec = palette[p];
      const hat = isHat(spec[0]);
      const list = listAt(c);
      if (hat && !(c.length === 0 && i === 0)) { flash('كتلة البداية (الأصفر) تكون في أول الكود فقط'); return false; }
      if (hat && list[0] && isHat(list[0].k)) { flash('عندك كتلة بداية بالفعل. احذفها لو أردت تغييرها'); return false; }
      if (!hat && c.length === 0 && i === 0 && list[0] && isHat(list[0].k)) { flash('لا نضع كتلة فوق كتلة البداية'); return false; }
      list.splice(i, 0, fromSpec(spec));
      active = DEFS[spec[0]].c ? { c: [...c, i], i: 0 } : { c, i: i + 1 };
      emit(); render();
      return true;
    }
    function remove(c, i) {
      listAt(c).splice(i, 1);
      active = { c: [], i: tree.length };
      emit(); render();
    }

    /* ---- الربط بالأحداث ---- */
    function wire() {
      box.querySelectorAll('.slot').forEach((s) => s.onclick = () => { active = { c: parsePath(s.dataset.c), i: +s.dataset.i }; render(); });
      box.querySelectorAll('.bdel').forEach((b) => b.onclick = (e) => { e.stopPropagation(); remove(parsePath(b.dataset.c), +b.dataset.i); });
      box.querySelector('[data-clear]').onclick = () => { tree = []; active = { c: [], i: 0 }; emit(); render(); };
      box.querySelectorAll('.pal').forEach((b) => {
        const p = +b.dataset.p;
        b.onclick = () => { if (suppressClick) return; insert(active.c, active.i, p); };
        b.addEventListener('pointerdown', (e) => startDrag(e, b, p));
      });
    }

    /* موضع الإفلات: خانة، أو كتلة (نضيف بعدها)، أو منطقة الكود (عند المكان المحدد) */
    function targetAt(x, y) {
      const el = document.elementFromPoint(x, y);
      if (!el || !box.contains(el)) return null;
      const slot = el.closest('.slot');
      if (slot) return { c: parsePath(slot.dataset.c), i: +slot.dataset.i, el: slot };
      const node = el.closest('[data-nc]');
      if (node) return { c: parsePath(node.dataset.nc), i: +node.dataset.ni + 1, el: node };
      const area = el.closest('.bscript');
      if (area) return { c: active.c, i: active.i, el: area };
      return null;
    }
    function startDrag(e, btn, p) {
      if (e.button > 0) return;
      const sx = e.clientX, sy = e.clientY;
      let ghost = null, moved = false;
      const clearOver = () => box.querySelectorAll('.over').forEach((x) => x.classList.remove('over'));
      const move = (ev) => {
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
        if (!moved) {
          moved = true;
          ghost = btn.cloneNode(true);
          ghost.className = 'ghost-blk';
          ghost.style.maxWidth = Math.min(btn.offsetWidth, 320) + 'px';
          document.body.appendChild(ghost);
          document.body.classList.add('dragging');
        }
        ghost.style.left = ev.clientX + 'px';
        ghost.style.top = ev.clientY + 'px';
        clearOver();
        const t = targetAt(ev.clientX, ev.clientY);
        if (t) t.el.classList.add('over');
      };
      const end = (ev) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', end);
        window.removeEventListener('pointercancel', end);
        if (!moved) return;
        const t = targetAt(ev.clientX, ev.clientY);
        ghost.remove();
        document.body.classList.remove('dragging');
        clearOver();
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 0);
        if (t) insert(t.c, t.i, p); else flash('أفلت الكتلة داخل منطقة الكود');
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', end);
      window.addEventListener('pointercancel', end);
    }

    render();
    return {
      get: () => tree.map(toSpec),
      reset(initial) { tree = (initial || []).map(fromSpec); active = { c: [], i: tree.length }; emit(); render(); }
    };
  }

  window.SB.builder = { create, matches, diagnose, scriptHTML, esc };
})();
