/* ============================================================
   امتحان سكراتش: صناعة الألعاب
   ------------------------------------------------------------
   لتعديل الامتحان غيّر هذا الملف فقط.

   minutes   مدة الامتحان بالدقائق
   questions قائمة الأسئلة (درجة الامتحان = 100، وتتوزع على عدد الأسئلة)

   أنواع الأسئلة:
   mcq   اختيار من متعدد     { options:[نص | O('🎬','نص') | {script:[...]}], answer: رقم الإجابة الصحيحة }
   tf    صح أو خطأ           { answer: true | false }
   order رتّب الكتل          { items:[كتلة,...] }   (الترتيب المكتوب هو الترتيب الصحيح)
   match صِل                 { pairs:[[يمين, يسار],...] }   كل طرف: كتلة أو نص
   pick  اضغط على الكتلة الخاطئة { script:[...], answer: رقم الكتلة, solution:'...' }
   build ركّب الكود بنفسك    { palette:[كتل متاحة + كتل مشتتة], solution:[كود نهائي], alts:[حلول أخرى مقبولة] }

   حقول إضافية (اختيارية):
   visual: 'اسم'     رسم توضيحي (الأسماء في visuals.js)
   script / scripts  عرض كود سكراتش مع السؤال
   sim: true         زر «شغّل الكود» يحرّك القطة على مسرح صغير
   simStart: {x,y}   مكان بداية القطة على المسرح
   explain           شرح الإجابة (يظهر في المراجعة)

   أسماء الكتل والواجهة تُكتب بالإنجليزي كما في سكراتش.
   داخل أي نص عربي استخدم E('...') لكتابة كلمة إنجليزية بشكل سليم.

   شكل الكتلة:  ['move', 10]   ['turn','r',15]   ['say','Hello!',2]
   كتل C:       ['repeat', 4, [ ...كتل بالداخل... ]]
   ============================================================ */

const E = (t) => `<span class="en" dir="ltr">${String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
/* اختيار نصي مع أيقونة */
const O = (icon, text) => ({ i: icon, t: text });
/* كل ترتيبات مجموعة كتل (لقبول أكثر من حل صحيح) */
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));

const COIN_INNER = [['changevar', 'score', 1], ['sound', 'Pop'], ['gotorandom']];
const coinSolution = (inner) => [['flag'], ['setvar', 'score', 0], ['forever', [['if', 'touching Player?', inner]]]];

window.EXAM = {
  title: 'امتحان سكراتش: صناعة الألعاب',
  minutes: 30,
  questions: [
    /* ---------- 1) واجهة البرنامج ---------- */
    {
      type: 'mcq',
      q: 'المكان الذي تتحرك فيه الشخصيات وتظهر عليه لعبتنا اسمه:',
      visual: 'ui-stage',
      options: [O('🎬', E('Stage')), O('🧰', E('Blocks palette')), O('🔊', E('Sound library')), O('👕', E('Costumes list'))],
      answer: 0,
      explain: `الـ ${E('Stage')} هو الشاشة التي يراها اللاعب، وفيها تتحرك الـ ${E('Sprites')} وتظهر الـ ${E('Backdrop')}.`
    },
    {
      type: 'mcq',
      q: `أين نسحب الـ ${E('Blocks')} ونركّبها فوق بعضها لنبني كود اللعبة؟`,
      visual: 'ui-code',
      options: [
        O('🧱', `في الـ ${E('Code area')} داخل تبويب ${E('Code')}`),
        O('🎬', `على الـ ${E('Stage')}`),
        O('🔊', `في تبويب ${E('Sounds')}`),
        O('⏹', `في زر ${E('Stop')} الأحمر`)
      ],
      answer: 0,
      explain: `نسحب الـ ${E('Blocks')} من الـ ${E('Blocks palette')} إلى الـ ${E('Code area')} ونركّبها هناك.`
    },
    {
      type: 'match',
      q: 'صِل كل تبويب بوظيفته:',
      visual: 'ui-tabs',
      pairs: [
        [E('Code'), '🧱 نركّب الكتل لنبرمج اللعبة'],
        [E('Costumes'), '👕 نرسم أو نغيّر شكل الكائن'],
        [E('Sounds'), '🔊 نضيف أو نسجّل المؤثرات الصوتية']
      ],
      explain: `تبويب ${E('Code')} للبرمجة، و${E('Costumes')} لأشكال الكائن، و${E('Sounds')} للمؤثرات والموسيقى.`
    },
    {
      type: 'mcq',
      q: 'نريد إضافة شخصية عدو جديدة للعبتنا. ماذا نفعل؟',
      visual: 'ui-sprites',
      options: [
        O('➕', `نضغط على زر ${E('Choose a Sprite')} أسفل قائمة الكائنات`),
        O('🏁', `نضغط على ${E('Green Flag')}`),
        O('✏️', 'نغيّر اسم المشروع'),
        O('⏹', `نضغط على زر ${E('Stop')}`)
      ],
      answer: 0,
      explain: `زر ${E('Choose a Sprite')} يفتح مكتبة الكائنات، فنختار منها العدو أو نرسم ${E('Sprite')} جديداً.`
    },
    {
      type: 'tf',
      q: `لكل ${E('Sprite')} في سكراتش أكواده الخاصة به، فيمكن أن يكون كود ${E('Cat')} مختلفاً عن كود ${E('Ball')}.`,
      visual: 'own-code',
      answer: true,
      explain: `كل ${E('Sprite')} له ${E('Code')} و${E('Costumes')} و${E('Sounds')} خاصة به، ولهذا نختار الـ ${E('Sprite')} أولاً ثم نبرمجه.`
    },

    /* ---------- 2) الأحداث Events ---------- */
    {
      type: 'mcq',
      q: 'نريد أن يتحرك اللاعب عندما نضغط على السهم الأيمن. بأي كتلة نبدأ الكود؟',
      visual: 'arrow-keys',
      options: [
        { script: [['key', 'right arrow']] },
        { script: [['flag']] },
        { script: [['clicked']] },
        { script: [['receive', 'message1']] }
      ],
      answer: 0,
      explain: `كتلة ${E('when [key] key pressed')} من قسم ${E('Events')} تبدأ الكود عند ضغط المفتاح الذي نختاره.`
    },
    {
      type: 'mcq',
      q: `وضعنا زر ${E('Start')} على المسرح. بأي كتلة نبدأ كود الزر ليعمل عندما ينقر عليه اللاعب؟`,
      visual: 'start-btn',
      options: [
        { script: [['clicked']] },
        { script: [['key', 'space']] },
        { script: [['flag']] },
        { script: [['receive', 'message1']] }
      ],
      answer: 0,
      explain: `${E('when this sprite clicked')} تبدأ الكود عندما ينقر اللاعب على الـ ${E('Sprite')} نفسه، مثل الأزرار.`
    },
    {
      type: 'build',
      q: 'المهمة: ركّب كوداً يجعل اللاعب يقفز عند الضغط على مفتاح المسافة: يرتفع لأعلى، ثم ينتظر لحظة، ثم ينزل لمكانه.',
      visual: 'jump',
      palette: [
        ['key', 'space'], ['key', 'up arrow'], ['changey', 50], ['changey', -50],
        ['changex', 50], ['wait', 0.3], ['say', 'Hello!', 2], ['move', 50]
      ],
      solution: [['key', 'space'], ['changey', 50], ['wait', 0.3], ['changey', -50]],
      explain: `نبدأ بـ ${E('when space key pressed')}، ثم ${E('change y by 50')} للصعود، ثم ${E('wait')}، ثم ${E('change y by -50')} للنزول.`
    },

    /* ---------- 3) الحركة Motion ---------- */
    {
      type: 'mcq',
      q: 'أي كتلة تنقل الكائن فوراً إلى مكان محدد على المسرح؟',
      visual: 'goto',
      options: [
        { script: [['goto', 0, 0]] },
        { script: [['move', 10]] },
        { script: [['turn', 'r', 15]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `${E('go to x: y:')} تنقل الكائن مباشرة إلى المكان الذي نحدده.`
    },
    {
      type: 'mcq',
      q: `شغّل الكود وشاهد. كتلة ${E('change x by')} حرّكت القطة في أي اتجاه؟`,
      script: [['flag'], ['repeat', 3, [['changex', 30]]]],
      sim: true,
      simStart: { x: -150, y: 0 },
      options: [
        O('↔️', 'أفقياً: يميناً أو يساراً'),
        O('↕️', 'لأعلى أو لأسفل'),
        O('⭕', 'في دائرة'),
        O('🚫', 'لم تتحرك')
      ],
      answer: 0,
      explain: `${E('x')} تتحكم في الحركة يميناً ويساراً، و${E('y')} تتحكم في الحركة لأعلى ولأسفل. ${E('change x by')} مفيدة جداً لتحريك اللاعب بالأسهم.`
    },
    {
      type: 'mcq',
      q: `ماذا تفعل كتلة ${E('if on edge, bounce')} في هذا الكود؟`,
      visual: 'bounce',
      script: [['flag'], ['forever', [['move', 10], ['bounce']]]],
      options: [
        O('↩️', 'تجعل الكائن يرتد عندما يصل إلى حافة المسرح'),
        O('🗑', 'تحذف الكائن من اللعبة'),
        O('⏹', 'توقف اللعبة كلها'),
        O('🖼', 'تغيّر خلفية المسرح')
      ],
      answer: 0,
      explain: `هذه الكتلة تمنع الـ ${E('Sprite')} من الخروج من الـ ${E('Stage')}، فيرتد ويكمل حركته. تُستخدم كثيراً في ألعاب الكرات.`
    },

    /* ---------- 4) المظهر والصوت Looks & Sound ---------- */
    {
      type: 'mcq',
      q: 'نريد أن تبدو الشخصية كأنها تمشي أو تجري. أي كتلة نكررها لنغيّر شكل الشخصية؟',
      visual: 'costumes',
      options: [
        { script: [['costume']] },
        { script: [['say', 'Hello!', 2]] },
        { script: [['sound', 'Meow']] },
        { script: [['goto', 0, 0]] }
      ],
      answer: 0,
      explain: `${E('next costume')} تغيّر شكل الـ ${E('Sprite')}، وعندما تتكرر بسرعة تبدو الحركة حقيقية.`
    },
    {
      type: 'match',
      q: 'صِل كل كتلة بوظيفتها:',
      pairs: [
        [['hide'], '👻 تُخفي الكائن من المسرح'],
        [['show'], '👀 تُظهر الكائن على المسرح'],
        [['backdrop', 'backdrop2'], '🖼 تغيّر خلفية المسرح'],
        [['sound', 'Meow'], '🔊 تشغّل صوتاً']
      ],
      explain: `نستخدم ${E('hide')} لإخفاء العملة بعد جمعها، و${E('show')} لإعادتها، و${E('switch backdrop to')} للانتقال بين المراحل.`
    },
    {
      type: 'build',
      q: `المهمة: كائن ${E('Coin')} يختفي ويُسمع صوت عندما يلمسه اللاعب ${E('Player')}، وهذا يُفحص طوال اللعبة. ركّب كود الـ ${E('Coin')}.`,
      visual: 'sound-hide',
      palette: [
        ['flag'], ['forever', []], ['repeat', 10, []], ['if', 'touching Player?', []], ['if', 'touching Enemy?', []],
        ['sound', 'Pop'], ['hide'], ['show'], ['stopall'], ['wait', 1]
      ],
      solution: [['flag'], ['forever', [['if', 'touching Player?', [['sound', 'Pop'], ['hide']]]]]],
      alts: [[['flag'], ['forever', [['if', 'touching Player?', [['hide'], ['sound', 'Pop']]]]]]],
      explain: `${E('forever')} تفحص طوال اللعبة، و${E('if touching Player? then')} تنفّذ ما بداخلها عند اللمس: ${E('start sound')} و${E('hide')}.`
    },

    /* ---------- 5) التحكم والاستشعار Control & Sensing ---------- */
    {
      type: 'build',
      q: 'المهمة: حرّك اللاعب لليمين باستمرار طوال اللعبة، لكن فقط عندما يكون مفتاح السهم الأيمن مضغوطاً.',
      visual: 'arrow-keys',
      palette: [
        ['flag'], ['key', 'right arrow'], ['forever', []], ['repeat', 10, []],
        ['if', 'key right arrow pressed?', []], ['if', 'key left arrow pressed?', []],
        ['changex', 10], ['changex', -10], ['changey', 10], ['wait', 1]
      ],
      solution: [['flag'], ['forever', [['if', 'key right arrow pressed?', [['changex', 10]]]]]],
      explain: `${E('forever')} تفحص باستمرار، و${E('if <key right arrow pressed?> then')} تتحقق من المفتاح، وبداخلها ${E('change x by 10')} لتحريك اللاعب يميناً.`
    },
    {
      type: 'pick',
      q: `اللعبة تتوقف فوراً بعد الضغط على ${E('Green Flag')}! اضغط على الكتلة المسؤولة عن المشكلة.`,
      visual: 'frozen',
      script: [
        ['flag'],
        ['setvar', 'score', 0],
        ['stopall'],
        ['forever', [['move', 10], ['bounce']]]
      ],
      answer: 2,
      solution: `كتلة ${E('stop [all]')}، لأنها توقف كل الأكواد قبل أن تبدأ الحركة.`,
      explain: `كتلة ${E('stop [all]')} توقف المشروع فوراً، فنضعها فقط عندما تنتهي اللعبة.`
    },
    {
      type: 'mcq',
      q: `نريد كتلة ${E('touching [ ]?')} لنعرف هل ضرب العدو اللاعب. في أي قسم (لونه أزرق فاتح) نجدها؟`,
      visual: 'ui-palette',
      options: [O('👀', E('Sensing')), O('🏃', E('Motion')), O('🔊', E('Sound')), O('➕', E('Operators'))],
      answer: 0,
      explain: `قسم ${E('Sensing')} فيه الكتل التي تفحص اللمس والمفاتيح والفأرة.`
    },
    {
      type: 'mcq',
      q: 'نريد أن يخسر اللاعب فقط عندما يلمس العدو. أي كتلة نضعها لنكتب هذا الشرط؟',
      visual: 'touch',
      options: [
        { script: [['if', 'touching Enemy?', []]] },
        { script: [['repeat', 10, []]] },
        { script: [['forever', []]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `كتلة ${E('if <> then')} تنفّذ ما بداخلها فقط عندما يتحقق الشرط، مثل: ${E('if touching Enemy?')}.`
    },
    {
      type: 'order',
      q: `رتّب الكتل: عند استقبال رسالة ${E('game over')} يقول اللاعب ${E('You lose!')}، ثم ${E('hide')}، ثم ${E('stop all')}.`,
      visual: 'gameover',
      items: [
        ['receive', 'game over'],
        ['say', 'You lose!', 2],
        ['hide'],
        ['stopall']
      ],
      explain: 'نبدأ بكتلة الاستقبال، ثم نقول الرسالة، ثم نخفي اللاعب، وفي الآخر نوقف كل شيء.'
    },

    /* ---------- 6) المتغيرات والرسائل والاستنساخ ---------- */
    {
      type: 'build',
      q: `المهمة: لعبة جمع النجوم. عند ${E('Green Flag')} تبدأ النقاط من الصفر، وطوال اللعبة: إذا لمس اللاعب ${E('Player')} هذه النجمة تزيد النقاط 1، ويُسمع صوت، وتنتقل النجمة لمكان عشوائي.`,
      visual: 'coins',
      palette: [
        ['flag'], ['setvar', 'score', 0], ['changevar', 'score', 1], ['changevar', 'score', -1], ['forever', []],
        ['if', 'touching Player?', []], ['sound', 'Pop'], ['gotorandom'], ['hide'], ['stopall'], ['wait', 1]
      ],
      solution: coinSolution(COIN_INNER),
      alts: perms(COIN_INNER).map(coinSolution).slice(1),
      explain: `${E('set [score] to 0')} مرة واحدة في البداية، ثم ${E('forever')} و${E('if touching Player?')}، وبداخلها ${E('change [score] by 1')} و${E('start sound')} و${E('go to [random position]')}.`
    },
    {
      type: 'mcq',
      q: `في بداية اللعبة نريد أن يبدأ اللاعب بنقاط صفر. أي كتلة نضعها تحت ${E('when green flag clicked')}؟`,
      visual: 'score0',
      options: [
        { script: [['setvar', 'score', 0]] },
        { script: [['changevar', 'score', 1]] },
        { script: [['hide']] },
        { script: [['stopall']] }
      ],
      answer: 0,
      explain: `${E('set [score] to 0')} تعيد العدّاد إلى الصفر في بداية كل لعبة جديدة.`
    },
    {
      type: 'mcq',
      q: 'نريد أن تظهر العملة في مكان مختلف على المسرح في كل مرة. أي كتلة نستخدم؟',
      visual: 'random',
      options: [
        { script: [['gotorandom']] },
        { script: [['goto', 0, 0]] },
        { script: [['move', 10]] },
        { script: [['turn', 'r', 15]] }
      ],
      answer: 0,
      explain: `${E('go to [random position]')} تنقل الكائن إلى مكان لا يعرفه اللاعب مسبقاً، فتصبح اللعبة أكثر تشويقاً.`
    },
    {
      type: 'mcq',
      q: 'نريد أن يُخبر اللاعب باقي الكائنات أن اللعبة انتهت. أي كتلة نستخدم؟',
      visual: 'broadcast',
      options: [
        { script: [['broadcast', 'game over']] },
        { script: [['receive', 'game over']] },
        { script: [['say', 'Game over', 2]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `${E('broadcast')} ترسل رسالة لكل الكائنات، وكل كائن يستخدم ${E('when I receive')} ليعرف ماذا يفعل عندما تصله.`
    },
    {
      type: 'match',
      q: `صِل كل كتلة من قسم ${E('Sensing')} بوظيفتها:`,
      pairs: [
        [['touching', 'Enemy'], '💥 تفحص هل لمس الكائن كائناً آخر'],
        [['keypressed', 'up arrow'], '⌨️ تفحص هل المفتاح مضغوط الآن'],
        [['timer'], '⏱ تعطينا الزمن منذ بدء اللعبة'],
        [['mousex'], '🖱 تعطينا مكان الفأرة يميناً ويساراً']
      ],
      explain: `كتل ${E('Sensing')} تجمع معلومات عن اللعبة: اللمس، المفاتيح، الزمن، ومكان الفأرة.`
    },
    {
      type: 'mcq',
      q: 'نريد أن يظهر في اللعبة عدة أعداء من نفس الكائن بدلاً من رسم عدو جديد كل مرة. أي كتلة تساعدنا؟',
      visual: 'clones',
      options: [
        { script: [['clone']] },
        { script: [['hide']] },
        { script: [['show']] },
        { script: [['backdrop', 'backdrop2']] }
      ],
      answer: 0,
      explain: `${E('create clone of [myself]')} تصنع نسخاً (استنساخاً) من الـ ${E('Sprite')}، فنحصل على أعداء كثيرين بكود واحد.`
    }
  ]
};
