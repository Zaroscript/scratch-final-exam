/* ============================================================
   visuals.js: رسومات توضيحية صغيرة تُعرض مع الأسئلة والمشروع
   الاستخدام داخل السؤال:  visual: 'bounce'
   ============================================================ */
(() => {
  'use strict';
  const { CATS, scriptHTML } = window.SB;

  const en = (t) => `<span class="en" dir="ltr">${t}</span>`;
  const fig = (inner, cap, cls = '') =>
    `<figure class="vis ${cls}">${inner}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
  const st = (inner, hud = '', cls = '') =>
    `<div class="vst ${cls}">${inner}${hud ? `<span class="vhud">${hud}</span>` : ''}</div>`;
  /* عنصر على المسرح: (x, y) نسبة مئوية من العرض والارتفاع */
  const it = (e, x, y, o = {}) =>
    `<span class="vi${o.c ? ' ' + o.c : ''}" style="left:${x}%;top:${y}%;font-size:${o.s || 2.2}rem${o.o ? `;opacity:${o.o}` : ''}">${e}</span>`;
  const lab = (t, x, y, c = '') => `<span class="vlab ${c}" style="left:${x}%;top:${y}%">${t}</span>`;
  const key = (t, on) => `<span class="keycap${on ? ' on' : ''}">${t}</span>`;

  /* ---------- شكل مبسّط لواجهة سكراتش مع تمييز منطقة ---------- */
  const editor = (hl, cap) => {
    const h = (k) => (hl === k ? ' hl' : '');
    const q = (k) => (hl === k ? '<i class="q">❓</i>' : '');
    const dots = ['#4C97FF', '#9966FF', '#CF63CF', '#FFBF00', '#FFAB19', '#5CB1D6', '#59C059', '#FF8C1A']
      .map((c) => `<i style="background:${c}"></i>`).join('');
    return fig(`<div class="ed">
      <div class="ed-tabs${h('tabs')}"><b>Code</b><span>Costumes</span><span>Sounds</span>${q('tabs')}</div>
      <div class="ed-pal${h('palette')}">${dots}${q('palette')}</div>
      <div class="ed-code${h('code')}"><span class="ed-hat"></span><span class="ed-blk"></span><span class="ed-blk b2"></span>${q('code')}</div>
      <div class="ed-stage${h('stage')}">${it('🐱', 50, 55, { s: 1.8 })}${q('stage')}</div>
      <div class="ed-sprites${h('sprites')}"><span class="spr-th">🐱</span><span class="spr-add">➕</span>${q('sprites')}</div>
    </div>`, cap, 'ed-fig');
  };

  /* ---------- مجموعة المشاهد ---------- */
  const SCENES = {
    'ui-stage': () => editor('stage', 'الشاشة اللي عليها علامة ❓'),
    'ui-code': () => editor('code', 'المنطقة اللي عليها علامة ❓'),
    'ui-tabs': () => editor('tabs', 'التبويبات فوق في المحرر'),
    'ui-sprites': () => editor('sprites', 'قايمة الـ ' + en('Sprites') + ' تحت المسرح'),
    'ui-palette': () => editor('palette', 'أقسام الكتل الملوّنة على الشمال'),

    'own-code': () => fig(`<div class="duo">
        <div class="duo-c"><div class="duo-sp">🐱</div>${scriptHTML([['flag'], ['move', 10]])}</div>
        <div class="duo-c"><div class="duo-sp">⚽</div>${scriptHTML([['flag'], ['bounce']])}</div>
      </div>`, 'كل كائن ليه كوده الخاص'),

    'arrow-keys': () => fig(`<div class="kv">
        <div class="keys">${key('⬆')}<div>${key('⬅')}${key('⬇')}${key('➡', true)}</div></div>
        ${st(it('🐱', 35, 65) + it('➡️', 62, 65, { s: 1.8 }), '', 'sm')}
      </div>`, 'لما نضغط السهم اليمين اللاعب بيتحرك'),

    'start-btn': () => fig(st(`<span class="vbtn">▶ Start</span>${it('👆', 56, 72, { s: 2.2 })}`, '', 'sm'), 'زرار على المسرح اللاعب بيدوس عليه'),

    jump: () => fig(`<div class="kv">
        <div class="keys">${key('SPACE', true)}</div>
        ${st(it('🐱', 38, 28) + it('🐱', 38, 70, { o: 0.3 }) + it('⬆️', 58, 48, { s: 1.6 }) + it('⬇️', 22, 48, { s: 1.6 }), '', 'sm')}
      </div>`, 'قفزة: يطلع لفوق وبعدين ينزل مكانه'),

    goto: () => fig(st(`<span class="axis ax-x"></span><span class="axis ax-y"></span>${it('🐱', 18, 25)}${it('❓', 50, 50, { s: 2 })}${lab('x', 94, 55)}${lab('y', 52, 6)}${it('➡️', 34, 38, { s: 1.4, o: 0.5 })}`, '', 'sm'), 'القطة عايزة تروح مكان معين'),

    bounce: () => fig(st(`<span class="wall"></span>${it('⚽', 80, 50)}${it('➡️', 62, 50, { s: 1.6 })}${it('↩️', 92, 28, { s: 1.4 })}`, '', 'sm'), 'الكورة وصلت لحافة المسرح'),

    costumes: () => fig(`<div class="cos">
        <div class="cos-i"><span>🚶</span><small>costume1</small></div><span class="cos-a">➜</span>
        <div class="cos-i"><span>🏃</span><small>costume2</small></div>
      </div>`, 'شكلين مختلفين لنفس الشخصية'),

    touch: () => fig(st(`${it('🐱', 40, 60)}${it('👾', 56, 60)}${it('💥', 48, 36, { s: 2 })}`, '', 'sm'), 'اللاعب لمس العدو'),

    gameover: () => fig(st(`${it('💥', 50, 36, { s: 2.4 })}<span class="vbig">GAME OVER</span>`, '', 'sm'), 'اللعبة خلصت'),

    coins: () => fig(st(`${it('⭐', 62, 38)}${it('🐱', 60, 74)}`, `score: 0 ➜ <b>1</b>`, 'sm'), 'اللاعب جمع نجمة فزادت نقطه'),

    score0: () => fig(st(it('🐱', 50, 62), `${'<b>score: 0</b>'}`, 'sm'), 'أول اللعبة: العدّاد بيبدأ من صفر'),

    random: () => fig(st(`${it('⭐', 22, 30, { o: 0.35 })}${it('⭐', 70, 24, { o: 0.35 })}${it('⭐', 40, 72, { o: 0.35 })}${it('❓', 80, 66, { s: 2 })}${it('⭐', 55, 45)}`, '', 'sm'), 'العملة بتظهر في أماكن مختلفة'),

    broadcast: () => fig(st(`${it('📢', 18, 50, { s: 2.2 })}${lab(en('game over'), 36, 24, 'bub')}${it('👾', 74, 28, { s: 1.8 })}${it('🐱', 74, 52, { s: 1.8 })}${it('🪙', 74, 76, { s: 1.8 })}`, '', 'sm'), 'رسالة بتوصل لكل الكائنات'),

    clones: () => fig(`<div class="cos"><div class="cos-i"><span>👾</span><small>1</small></div><span class="cos-a">➜</span><div class="cos-i"><span>👾👾👾👾</span><small>clones</small></div></div>`, 'كائن واحد وكذا نسخة منه'),

    'sound-hide': () => fig(st(`${it('🐱', 40, 66)}${it('🪙', 58, 66, { o: 0.3 })}${it('🔊', 52, 30, { s: 1.8 })}`, '', 'sm'), 'اللاعب لمس العملة: صوت وبعدين بتختفي'),

    frozen: () => fig(st(`${it('🐱', 50, 55)}${it('⛔', 50, 25, { s: 2 })}`, '', 'sm'), 'اللعبة اتجمّدت بعد الضغط على العلم الأخضر'),

    /* ----- مشروع التخرج ----- */
    'proj-setup': () => editor('sprites', 'ضيف الكائنات من هنا'),
    'proj-vars': () => fig(st(it('🐱', 50, 80), `<b>score: 0</b> &nbsp; <b>lives: 3</b>`, 'sm'), 'متغيّرين بيظهروا على المسرح'),
    'proj-player': () => SCENES['arrow-keys'](),
    'proj-star': () => fig(st(`${it('⭐', 30, 14)}${it('⬇️', 30, 32, { s: 1.4, o: 0.6 })}${it('🐱', 50, 82)}`, '', 'sm'), 'النجمة بتقع من فوق'),
    'proj-monster': () => fig(st(`${it('👻', 62, 40, { s: 2.4 })}${it('👆', 68, 62, { s: 1.6 })}${it('✨', 40, 24, { s: 1.4, o: 0.5 })}`, `<b>score: 3</b>`, 'sm'), 'الوحش بيظهر في أماكن مختلفة وإنت بتدوس عليه'),
    'proj-timeup': () => fig(st(`${it('⏰', 50, 34, { s: 2.4 })}<span class="vbig">TIME IS UP!</span>`, `<b>score: 12</b>`, 'sm'), 'الوقت خلص واللعبة وقفت'),
    'proj-maze': () => fig(st(`<span class="vw" style="left:0;top:36%;width:64%;height:6%"></span><span class="vw" style="left:36%;top:66%;width:64%;height:6%"></span>${it('🐱', 12, 84, { s: 1.5 })}${it('⭐', 88, 16, { s: 1.8 })}`, '', 'sm'), 'اللاعب لازم يوصل للنجمة من غير ما يلمس الحيطة'),
    'proj-win': () => fig(st(`${it('🏆', 50, 36, { s: 2.6 })}<span class="vbig" style="color:#17794a">YOU WIN!</span>`, '', 'sm'), 'اللاعب وصل للهدف'),
    'proj-mouse': () => fig(st(`${it('🖱️', 68, 32, { s: 2 })}${it('🐱', 38, 62)}${it('➡️', 53, 48, { s: 1.4, o: 0.6 })}`, '', 'sm'), 'القطة بتمشي ورا الماوس'),
    'proj-chase': () => fig(st(`${it('🐱', 30, 64)}${it('👻', 72, 30, { s: 2.2 })}${it('➡️', 52, 46, { s: 1.4, o: 0.6 })}`, `<b>score: 5</b>`, 'sm'), 'العدو بيجري ورا اللاعب'),
    'proj-final': () => fig(st(`${it('⭐', 24, 18, { s: 1.8 })}${it('⭐', 70, 40, { s: 1.8 })}${it('🐱', 52, 82)}`, `<b>score: 7</b> &nbsp; <b>lives: ❤️❤️</b>`, 'sm'), 'لعبة Star Catcher كاملة')
  };

  window.SB.visual = (k) => (SCENES[k] ? SCENES[k]() : '');
})();
