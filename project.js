/* ============================================================
   مشروع التخرج: لعبة Star Catcher
   ------------------------------------------------------------
   كل خطوة: هدف، مهام ينفذها الطالب في برنامج Scratch الحقيقي،
   الكتل المطلوبة، وتمرين اختياري لترتيب الكتل داخل الصفحة.

   practice.initial  كود موجود مسبقاً في التمرين
   practice.palette  الكتل المتاحة (وفيها كتل مشتتة)
   practice.solution الحل الصحيح
   ============================================================ */

const RND = { r: 'pick random -200 to 200' };           // كتلة داخل خانة
const LIVES_LT = { t: 'lives < 1', cat: 'operators' };
const Y_LT = { t: 'y position < -170', cat: 'operators' };

const STAR_CATCH = ['if', 'touching Player?', [['changevar', 'score', 1], ['sound', 'Pop'], ['goto', RND, 170]]];
const STAR_MISS = ['if', Y_LT, [['changevar', 'lives', -1], ['goto', RND, 170]]];
const STAR_OVER = ['if', LIVES_LT, [['say', 'Game Over!', 2], ['stopall']]];

const STAR_BASE = [['flag'], ['setvar', 'score', 0], ['setvar', 'lives', 3], ['goto', RND, 170]];
const PLAYER_SCRIPT = [
  ['flag'], ['goto', 0, -130],
  ['forever', [
    ['if', 'key left arrow pressed?', [['changex', -10]]],
    ['if', 'key right arrow pressed?', [['changex', 10]]]
  ]]
];
const star = (inner) => [...STAR_BASE, ['forever', inner]];

window.PROJECT = {
  title: 'مشروع التخرج: Star Catcher',
  game: 'Star Catcher',
  editorUrl: 'https://scratch.mit.edu/projects/editor/',
  intro: `ستصنع الآن لعبة كاملة بنفسك في برنامج ${E('Scratch')} الحقيقي: قطة تتحرك يميناً ويساراً لتصطاد النجوم التي تسقط من السماء. كل نجمة تعطيك نقطة، وإذا فاتتك نجمة تخسر قلباً، وعندما تنتهي القلوب تنتهي اللعبة!`,

  steps: [
    {
      id: 'setup',
      emoji: '🎨',
      title: 'جهّز المشروع',
      visual: 'proj-setup',
      goal: `سنفتح مشروعاً جديداً ونجهّز الشخصيات والخلفية.`,
      tasks: [
        `افتح ${E('Scratch')} من الزر بالأعلى، ثم اختر ${E('File')} ثم ${E('New')}.`,
        `من زر ${E('Choose a Backdrop')} اختر خلفية تعجبك (مثلاً ${E('Stars')} أو ${E('Blue Sky')}).`,
        `اضغط على الـ ${E('Cat')} وغيّر اسمها في خانة ${E('Sprite')} إلى <b>${E('Player')}</b>.`,
        `من زر ${E('Choose a Sprite')} أضف ${E('Star')} (ابحث عن ${E('Star')}) وسمّها <b>${E('Star')}</b>.`,
        `اختر الـ ${E('Star')} واجعل حجمها أصغر: في خانة ${E('Size')} اكتب <b>50</b>.`
      ],
      blocks: [['setsize', 50]],
      tip: `يمكنك أيضاً استخدام كتلة ${E('set size to 50 %')} لكن خانة ${E('Size')} أسهل هنا.`
    },
    {
      id: 'vars',
      emoji: '🧮',
      title: 'اصنع المتغيرات',
      visual: 'proj-vars',
      goal: `اللعبة تحتاج أن تتذكر نقاط اللاعب وعدد قلوبه، لذلك نصنع متغيرين.`,
      tasks: [
        `اذهب إلى قسم ${E('Variables')} (البرتقالي) واضغط ${E('Make a Variable')}.`,
        `اكتب الاسم <b>${E('score')}</b> واختر ${E('For all sprites')} ثم ${E('OK')}.`,
        `كرر نفس الخطوات لمتغير اسمه <b>${E('lives')}</b>.`,
        `تأكد أن المربعين بجانب المتغيرين مفعّلان ليظهرا على المسرح.`
      ],
      blocks: [['setvar', 'score', 0], ['changevar', 'score', 1]],
      tip: `اكتب الأسماء بالإنجليزية وبحروف صغيرة بالضبط حتى تتطابق مع الكود.`
    },
    {
      id: 'player',
      emoji: '🐱',
      title: 'حرّك اللاعب',
      visual: 'proj-player',
      goal: `اللاعب ${E('Player')} يبدأ في أسفل المسرح، ويتحرك يميناً ويساراً بالأسهم.`,
      tasks: [
        `اختر الـ ${E('Player')} ثم افتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} ثم ${E('go to x: 0 y: -130')}.`,
        `ضع ${E('forever')}، وبداخلها كتلتا ${E('if')}.`,
        `الأولى: ${E('if <key left arrow pressed?>')} ثم ${E('change x by -10')}. والثانية للسهم الأيمن مع ${E('change x by 10')}.`,
        `اضغط على ${E('Green Flag')} وجرّب الأسهم.`
      ],
      blocks: [
        ['flag'], ['goto', 0, -130], ['forever', []],
        ['if', 'key left arrow pressed?', []], ['changex', -10]
      ],
      practice: {
        palette: [
          ['flag'], ['goto', 0, -130], ['goto', 0, 0], ['forever', []], ['repeat', 10, []],
          ['if', 'key left arrow pressed?', []], ['if', 'key right arrow pressed?', []],
          ['changex', -10], ['changex', 10], ['changey', -10], ['wait', 1]
        ],
        solution: PLAYER_SCRIPT,
        hint: 'بعد وضع الـ forever، اضغط على الخانة بداخلها ثم أضف كتلتي الـ if.'
      },
      tip: `لو تحرك اللاعب عكس الاتجاه، راجع إشارة الرقم: ${E('-10')} لليسار و${E('10')} لليمين.`
    },
    {
      id: 'fall',
      emoji: '⭐',
      title: 'اجعل النجمة تسقط',
      visual: 'proj-star',
      goal: `النجمة تبدأ من مكان عشوائي في أعلى المسرح ثم تسقط للأسفل.`,
      tasks: [
        `اختر الـ ${E('Star')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} ثم ${E('set [score] to 0')} ثم ${E('set [lives] to 3')}.`,
        `من قسم ${E('Motion')} خذ ${E('go to x: y:')}، واجعل ${E('x')} كتلة ${E('pick random -200 to 200')} من قسم ${E('Operators')}، و${E('y')} تساوي <b>170</b>.`,
        `ضع ${E('forever')} وبداخلها ${E('change y by -5')} لتسقط النجمة.`,
        `اضغط ${E('Green Flag')} وشاهد النجمة تسقط!`
      ],
      blocks: [
        ['setvar', 'score', 0], ['setvar', 'lives', 3], ['goto', RND, 170], ['forever', []], ['changey', -5]
      ],
      practice: {
        palette: [
          ['flag'], ['setvar', 'score', 0], ['setvar', 'lives', 3], ['goto', RND, 170], ['goto', 0, 0],
          ['forever', []], ['changey', -5], ['changey', 5], ['changevar', 'score', 1], ['hide']
        ],
        solution: star([['changey', -5]]),
        hint: 'الترتيب: flag ثم set score ثم set lives ثم go to ثم forever.'
      },
      tip: `الرقم 170 قريب من أعلى المسرح، لأن المسرح يمتد من -180 إلى 180 رأسياً.`
    },
    {
      id: 'catch',
      emoji: '🎯',
      title: 'اصطد النجمة',
      visual: 'coins',
      goal: `عندما تلمس النجمةُ اللاعبَ تزيد النقاط ويُسمع صوت، وتعود النجمة للأعلى في مكان جديد.`,
      tasks: [
        `داخل الـ ${E('forever')} وبعد ${E('change y by -5')} ضع ${E('if <touching Player?> then')}.`,
        `بداخل الـ ${E('if')} ضع ${E('change [score] by 1')}.`,
        `ثم ${E('start sound [Pop]')} (ابحث عن الصوت في تبويب ${E('Sounds')} إن لزم).`,
        `ثم ${E('go to x: (pick random -200 to 200) y: 170')} لتعود النجمة للأعلى.`,
        `جرّب اللعبة: هل تزيد النقاط عند الاصطياد؟`
      ],
      blocks: [['if', 'touching Player?', []], ['changevar', 'score', 1], ['sound', 'Pop'], ['goto', RND, 170]],
      practice: {
        initial: star([['changey', -5]]),
        palette: [
          ['if', 'touching Player?', []], ['if', 'touching Enemy?', []], ['changevar', 'score', 1], ['changevar', 'score', -1],
          ['sound', 'Pop'], ['goto', RND, 170], ['hide'], ['stopall']
        ],
        solution: star([['changey', -5], STAR_CATCH]),
        hint: 'اضغط على الخانة التي تحت change y by -5 داخل forever ثم أضف الـ if.'
      },
      tip: `لو لم تزد النقاط، تأكد أن اسم الكائن في ${E('touching')} هو ${E('Player')} بالضبط.`
    },
    {
      id: 'miss',
      emoji: '💔',
      title: 'النجمة الضائعة',
      visual: 'proj-star',
      goal: `إذا وصلت النجمة لأسفل المسرح قبل أن تصطادها، تخسر قلباً وتعود النجمة للأعلى.`,
      tasks: [
        `بعد الـ ${E('if touching')} ضع كتلة ${E('if <> then')} جديدة.`,
        `الشرط: من ${E('Operators')} خذ ${E('( ) < ( )')} واكتب فيها ${E('(y position) < -170')}. (كتلة ${E('y position')} من قسم ${E('Motion')}).`,
        `بداخلها ${E('change [lives] by -1')} ثم ${E('go to x: (pick random -200 to 200) y: 170')}.`,
        `جرّب ألا تصطاد نجمة وانظر هل ينقص متغير ${E('lives')}.`
      ],
      blocks: [['if', Y_LT, []], ['changevar', 'lives', -1], ['goto', RND, 170]],
      practice: {
        initial: star([['changey', -5], STAR_CATCH]),
        palette: [
          ['if', Y_LT, []], ['if', { t: 'y position > 170', cat: 'operators' }, []],
          ['changevar', 'lives', -1], ['changevar', 'lives', 1], ['changevar', 'score', -1], ['goto', RND, 170], ['stopall']
        ],
        solution: star([['changey', -5], STAR_CATCH, STAR_MISS]),
        hint: 'ضع الـ if الجديد بعد الـ if الأول (وليس بداخله).'
      },
      tip: `-170 هي ارتفاع قريب من أسفل المسرح حيث يجب أن تضيع النجمة.`
    },
    {
      id: 'over',
      emoji: '🏁',
      title: 'نهاية اللعبة',
      visual: 'gameover',
      goal: `عندما تنتهي القلوب، يظهر Game Over وتتوقف اللعبة.`,
      tasks: [
        `بعد الـ ${E('if')} الثاني ضع ${E('if <> then')} جديدة.`,
        `الشرط: ${E('(lives) < 1')} (استخدم كتلة ${E('lives')} من قسم ${E('Variables')}).`,
        `بداخلها ${E('say [Game Over!] for 2 seconds')} ثم ${E('stop [all]')}.`,
        `العب حتى تضيع 3 نجوم وتأكد أن الرسالة تظهر وتتوقف اللعبة.`
      ],
      blocks: [['if', LIVES_LT, []], ['say', 'Game Over!', 2], ['stopall']],
      practice: {
        initial: star([['changey', -5], STAR_CATCH, STAR_MISS]),
        palette: [
          ['if', LIVES_LT, []], ['if', { t: 'lives > 3', cat: 'operators' }, []],
          ['say', 'Game Over!', 2], ['stopall'], ['hide'], ['wait', 1]
        ],
        solution: star([['changey', -5], STAR_CATCH, STAR_MISS, STAR_OVER]),
        hint: 'ضع say أولاً ثم stop all (لو وضعت stop all أولاً لن تظهر الرسالة).'
      },
      tip: `${E('stop [all]')} تُنهي كل شيء، لذلك نضعها في آخر الكود بعد رسالة النهاية.`
    },
    {
      id: 'polish',
      emoji: '✨',
      title: 'الاختبار والحفظ',
      visual: 'proj-final',
      goal: `لعبتك جاهزة! لنختبرها جيداً ونحفظها.`,
      tasks: [
        `اضغط ${E('Green Flag')} وتأكد: اللاعب يتحرك يميناً ويساراً بالأسهم.`,
        `النجمة تسقط من مكان مختلف كل مرة.`,
        `النقاط تزيد عند الاصطياد، والقلوب تنقص عند الضياع.`,
        `عند انتهاء القلوب تظهر الرسالة وتتوقف اللعبة.`,
        `احفظ مشروعك: ${E('File')} ثم ${E('Save to your computer')}، واكتب اسماً مثل <b>${E('Star Catcher')}</b>.`
      ],
      blocks: [],
      bonus: [
        `أضف موسيقى: ${E('when green flag clicked')} ثم ${E('forever')} ثم ${E('play sound [ ] until done')}.`,
        `أضف عدواً جديداً (قنبلة 💣) يسقط مثل النجمة، وإذا لمسها اللاعب تنتهي اللعبة.`,
        `اجعل النجمة تسقط أسرع كلما زادت النقاط.`,
        `غيّر شكل اللاعب باستخدام ${E('next costume')} أثناء الحركة.`
      ],
      tip: `نصيحة: كل لعبة تبدأ بفكرة بسيطة ثم نضيف عليها خطوة خطوة، تماماً كما فعلت الآن.`
    }
  ],

  /* الكود النهائي الذي يظهر في الشهادة */
  finalScripts: [
    { sprite: 'Player', script: PLAYER_SCRIPT },
    { sprite: 'Star', script: star([['changey', -5], STAR_CATCH, STAR_MISS, STAR_OVER]) }
  ]
};
