/* ============================================================
   مشروع التخرج: الطفل يختار فكرة لعبة من عدة أفكار ويعملها في Scratch
   ------------------------------------------------------------
   كل فكرة (project): id، اسم اللعبة، أيقونة، مستوى، وصف قصير، مقدمة، خطوات، والكود النهائي.
   كل خطوة: هدف، مهام ينفذها الطالب في برنامج Scratch الحقيقي،
   الكتل المطلوبة، وتمرين اختياري لترتيب الكتل جوه الصفحة.

   لإضافة فكرة جديدة: ضيف عنصر جديد في PROJECTS.projects (وخلّي id كل خطوة مميّز).

   practice.initial  كود موجود من الأول في التمرين
   practice.palette  الكتل المتاحة (وفيها كتل مشتتة)
   practice.solution الحل الصح
   practice.alts     حلول تانية مقبولة (اختياري)
   practice.hint     تلميح بيظهر لو الإجابة غلط
   ============================================================ */

const RND = { r: 'pick random -200 to 200' };           // كتلة جوه خانة
const LIVES_LT = { t: 'lives < 1', cat: 'operators' };
const Y_LT = { t: 'y position < -170', cat: 'operators' };

/* مستويات الصعوبة */
const LEVELS = { 1: '⭐ سهل', 2: '⭐⭐ متوسط' };

/* ============================================================
   الفكرة 1: Click the Monster (سهل)
   ============================================================ */
const MON_MOVE = [['flag'], ['setvar', 'score', 0], ['forever', [['gotorandom'], ['wait', 1]]]];
const MON_MOVE_ALT = [['flag'], ['setvar', 'score', 0], ['forever', [['wait', 1], ['gotorandom']]]];
const MON_CLICK_INNER = [['changevar', 'score', 1], ['sound', 'Pop'], ['gotorandom']];
const monClick = (inner) => [['clicked'], ...inner];
const MON_TIME = [['flag'], ['wait', 30], ['say', 'Time is up!', 2], ['stopall']];

const MONSTER = {
  id: 'monster',
  game: 'Click the Monster',
  emoji: '👻',
  level: 1,
  blurb: 'وحش بيظهر في أماكن مختلفة، ودوس عليه بسرعة قبل ما الوقت يخلص!',
  intro: `لعبة سريعة وممتعة: وحش بيظهر في أماكن مختلفة على المسرح، وإنت لازم تدوس عليه بالماوس بسرعة! كل مرة تدوس عليه بتاخد نقطة، ولما الوقت يخلص اللعبة بتقف.`,

  steps: [
    {
      id: 'mon-setup',
      emoji: '🎨',
      title: 'جهّز المشروع',
      visual: 'proj-setup',
      goal: 'هنجهّز المشروع والشخصية والخلفية.',
      tasks: [
        `افتح ${E('Scratch')} من الزرار اللي فوق، وبعدين ${E('File')} وبعدين ${E('New')}.`,
        `من ${E('Choose a Backdrop')} اختار خلفية تعجبك (مثلاً ${E('Woods')} أو ${E('Blue Sky')}).`,
        `اضغط بيمين الماوس على القطة واختار ${E('delete')} علشان نمسحها.`,
        `من ${E('Choose a Sprite')} اختار شخصية مضحكة (مثلاً ${E('Ghost')} أو ${E('Octopus')}) وسمّيها <b>${E('Monster')}</b>.`,
        `اضبط الحجم: في خانة ${E('Size')} اكتب <b>70</b>.`
      ],
      blocks: [],
      tip: 'ماتقلقش لو شكل الشخصية عندك مختلف عن زمايلك، المهم الكود!'
    },
    {
      id: 'mon-vars',
      emoji: '🧮',
      title: 'اعمل متغيّر النقط',
      visual: 'proj-vars',
      goal: 'محتاجين عدّاد يحسب النقط.',
      tasks: [
        `روح لقسم ${E('Variables')} (البرتقالي) واضغط ${E('Make a Variable')}.`,
        `اكتب الاسم <b>${E('score')}</b> واختار ${E('For all sprites')} وبعدين ${E('OK')}.`,
        `اتأكد إن المربع اللي جنب ${E('score')} متعلّم علشان يظهر على المسرح.`
      ],
      blocks: [['setvar', 'score', 0], ['changevar', 'score', 1]],
      tip: `اكتب الاسم بالإنجليزي وبحروف صغيرة بالظبط علشان يتطابق مع الكود.`
    },
    {
      id: 'mon-move',
      emoji: '👻',
      title: 'الوحش بيتنقّل',
      visual: 'random',
      goal: 'الوحش بيبدأ والنقط صفر، وبعدين بيفضل ينط من مكان لمكان طول اللعبة.',
      tasks: [
        `اختار الـ ${E('Monster')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('set [score] to 0')}.`,
        `حط ${E('forever')}، وجواها ${E('go to [random position]')} وبعدها ${E('wait 1 seconds')}.`,
        `اضغط ${E('Green Flag')} وشوف الوحش وهو بينط!`
      ],
      blocks: [['flag'], ['setvar', 'score', 0], ['forever', []], ['gotorandom'], ['wait', 1]],
      practice: {
        palette: [
          ['flag'], ['setvar', 'score', 0], ['forever', []], ['repeat', 10, []], ['gotorandom'],
          ['goto', 0, 0], ['wait', 1], ['hide'], ['changevar', 'score', 1]
        ],
        solution: MON_MOVE,
        alts: [MON_MOVE_ALT],
        hint: 'الترتيب: flag وبعدها set score وبعدها forever. وجوّا الـ forever حط go to random وبعدها wait.'
      },
      tip: `لو عايز الوحش يتحرك أسرع، قلّل رقم ${E('wait')}. ولو عايزه أبطأ زوّده.`
    },
    {
      id: 'mon-click',
      emoji: '👆',
      title: 'دوس على الوحش',
      visual: 'proj-monster',
      goal: 'لما اللاعب يدوس على الوحش بياخد نقطة ويطلع صوت، والوحش بينط لمكان جديد علطول.',
      tasks: [
        `لسه على الـ ${E('Monster')}، اعمل كود جديد في مكان فاضي (من غير ما تلمس الكود اللي فات).`,
        `ابدأ بـ ${E('when this sprite clicked')} من قسم ${E('Events')}.`,
        `حط تحتها ${E('change [score] by 1')}.`,
        `وبعدها ${E('start sound [Pop]')}، وبعدها ${E('go to [random position]')}.`,
        `اضغط ${E('Green Flag')} وجرّب تدوس على الوحش!`
      ],
      blocks: [['clicked'], ['changevar', 'score', 1], ['sound', 'Pop'], ['gotorandom']],
      practice: {
        palette: [
          ['clicked'], ['flag'], ['changevar', 'score', 1], ['changevar', 'score', -1],
          ['sound', 'Pop'], ['gotorandom'], ['hide'], ['stopall']
        ],
        solution: monClick(MON_CLICK_INNER),
        alts: perms(MON_CLICK_INNER).map(monClick),
        hint: 'ابدأ بـ when this sprite clicked، وتحتها 3 كتل: زوّد النقط، الصوت، والمكان العشوائي.'
      },
      tip: 'ده أول مرة نعمل فيها أكتر من كود على نفس الكائن، وكلهم بيشتغلوا مع بعض في نفس الوقت!'
    },
    {
      id: 'mon-time',
      emoji: '⏰',
      title: 'الوقت بيخلص',
      visual: 'proj-timeup',
      goal: 'اللعبة بتخلص بعد 30 ثانية ويظهر للاعب إن الوقت انتهى.',
      tasks: [
        `اعمل كود جديد تالت على الـ ${E('Monster')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('wait 30 seconds')}.`,
        `بعدها ${E('say [Time is up!] for 2 seconds')} وبعدها ${E('stop [all]')}.`,
        'جرّب اللعبة وشوف إنها بتقف بعد 30 ثانية. (لو مش عايز تستنى، قلّل الرقم مؤقتاً لـ 5.)'
      ],
      blocks: [['flag'], ['wait', 30], ['say', 'Time is up!', 2], ['stopall']],
      practice: {
        palette: [
          ['flag'], ['wait', 30], ['wait', 1], ['say', 'Time is up!', 2], ['stopall'], ['hide'], ['show']
        ],
        solution: MON_TIME,
        hint: 'ابدأ بـ flag وبعدها wait 30، وبعدها say وفي الآخر stop all (لأنها بتوقّف كل حاجة).'
      },
      tip: `ليه ${E('stop all')} في الآخر؟ لأننا لو حطيناها قبل ${E('say')} اللعبة هتقف والرسالة ماتظهرش.`
    },
    {
      id: 'mon-polish',
      emoji: '✨',
      title: 'الاختبار والحفظ',
      visual: 'proj-monster',
      goal: 'لعبتك جاهزة! تعالى نجرّبها ونحفظها.',
      tasks: [
        `اضغط ${E('Green Flag')} وتأكد إن الوحش بينط في أماكن مختلفة.`,
        'دوس عليه وتأكد إن النقط بتزيد ويطلع صوت.',
        'استنى 30 ثانية وتأكد إن الرسالة بتظهر واللعبة بتقف.',
        `احفظ مشروعك: ${E('File')} وبعدين ${E('Save to your computer')}، واكتب اسم زي <b>${E('Click the Monster')}</b>.`
      ],
      blocks: [],
      bonus: [
        `خلّي الوحش يصغر كل ما تدوس عليه بكتلة ${E('change size by -2')} من قسم ${E('Looks')}.`,
        `ضيف وحش تاني بنفس الكود (اضغط بيمين الماوس على الوحش واختار ${E('duplicate')}).`,
        `غيّر شكل الوحش مع كل دوسة بـ ${E('next costume')}.`,
        'خلّي الوحش يتنقل أسرع كل ما النقط تزيد.'
      ],
      tip: 'كل الألعاب الكبيرة بتبدأ من فكرة بسيطة زي دي.'
    }
  ],

  finalScripts: [
    { sprite: 'Monster (1)', script: MON_MOVE },
    { sprite: 'Monster (2)', script: monClick(MON_CLICK_INNER) },
    { sprite: 'Monster (3)', script: MON_TIME }
  ]
};

/* ============================================================
   الفكرة 2: Star Catcher (متوسط)
   ============================================================ */
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

const STAR_CATCHER = {
  id: 'star',
  game: 'Star Catcher',
  emoji: '⭐',
  level: 2,
  blurb: 'القطة بتصطاد النجوم اللي بتقع من السما. نقط وقلوب ونهاية للعبة!',
  intro: `هتعمل دلوقتي لعبة كاملة بنفسك في برنامج ${E('Scratch')} الحقيقي: قطة بتتحرك يمين وشمال علشان تصطاد النجوم اللي بتقع من السما. كل نجمة بتديك نقطة، ولو نجمة فاتتك بتخسر قلب، ولما القلوب تخلص اللعبة بتخلص!`,

  steps: [
    {
      id: 'setup',
      emoji: '🎨',
      title: 'جهّز المشروع',
      visual: 'proj-setup',
      goal: 'هنفتح مشروع جديد ونجهّز الشخصيات والخلفية.',
      tasks: [
        `افتح ${E('Scratch')} من الزرار اللي فوق، وبعدين اختار ${E('File')} وبعدين ${E('New')}.`,
        `من زرار ${E('Choose a Backdrop')} اختار خلفية تعجبك (مثلاً ${E('Stars')} أو ${E('Blue Sky')}).`,
        `اضغط على الـ ${E('Cat')} وغيّر اسمها في خانة ${E('Sprite')} لـ <b>${E('Player')}</b>.`,
        `من زرار ${E('Choose a Sprite')} ضيف ${E('Star')} (دوّر على ${E('Star')}) وسمّيها <b>${E('Star')}</b>.`,
        `اختار الـ ${E('Star')} وصغّر حجمها: في خانة ${E('Size')} اكتب <b>50</b>.`
      ],
      blocks: [['setsize', 50]],
      tip: `ممكن كمان تستخدم كتلة ${E('set size to 50 %')} بس خانة ${E('Size')} أسهل هنا.`
    },
    {
      id: 'vars',
      emoji: '🧮',
      title: 'اعمل المتغيّرات',
      visual: 'proj-vars',
      goal: 'اللعبة محتاجة تفتكر نقط اللاعب وعدد القلوب بتاعته، علشان كده هنعمل متغيّرين.',
      tasks: [
        `روح لقسم ${E('Variables')} (البرتقالي) واضغط ${E('Make a Variable')}.`,
        `اكتب الاسم <b>${E('score')}</b> واختار ${E('For all sprites')} وبعدين ${E('OK')}.`,
        `اعمل نفس الحاجة لمتغيّر اسمه <b>${E('lives')}</b>.`,
        'اتأكد إن المربعين اللي جنب المتغيّرين متعلّم عليهم علشان يظهروا على المسرح.'
      ],
      blocks: [['setvar', 'score', 0], ['changevar', 'score', 1]],
      tip: 'اكتب الأسماء بالإنجليزي وبحروف صغيرة بالظبط علشان تتطابق مع الكود.'
    },
    {
      id: 'player',
      emoji: '🐱',
      title: 'حرّك اللاعب',
      visual: 'proj-player',
      goal: `اللاعب ${E('Player')} بيبدأ تحت في المسرح، وبيتحرك يمين وشمال بالأسهم.`,
      tasks: [
        `اختار الـ ${E('Player')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('go to x: 0 y: -130')}.`,
        `حط ${E('forever')}، وجواها كتلتين ${E('if')}.`,
        `الأولى: ${E('if <key left arrow pressed?>')} وجواها ${E('change x by -10')}. والتانية للسهم اليمين ومعاها ${E('change x by 10')}.`,
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
        alts: [[
          ['flag'], ['goto', 0, -130],
          ['forever', [
            ['if', 'key right arrow pressed?', [['changex', 10]]],
            ['if', 'key left arrow pressed?', [['changex', -10]]]
          ]]
        ]],
        hint: 'بعد ما تحط الـ forever، اضغط على الخانة اللي جواها وبعدين ضيف كتلتين الـ if.'
      },
      tip: `لو اللاعب اتحرك عكس الاتجاه، راجع علامة الرقم: ${E('-10')} للشمال و${E('10')} لليمين.`
    },
    {
      id: 'fall',
      emoji: '⭐',
      title: 'خلّي النجمة تقع',
      visual: 'proj-star',
      goal: 'النجمة بتبدأ من مكان عشوائي فوق في المسرح وبعدين بتقع لتحت.',
      tasks: [
        `اختار الـ ${E('Star')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('set [score] to 0')} وبعدها ${E('set [lives] to 3')}.`,
        `من قسم ${E('Motion')} هات ${E('go to x: y:')}، وخلّي ${E('x')} كتلة ${E('pick random -200 to 200')} من قسم ${E('Operators')}، و${E('y')} تساوي <b>170</b>.`,
        `حط ${E('forever')} وجواها ${E('change y by -5')} علشان النجمة تقع.`,
        `اضغط ${E('Green Flag')} وشوف النجمة وهي بتقع!`
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
        hint: 'الترتيب: flag وبعدها set score وبعدها set lives وبعدها go to وبعدها forever.'
      },
      tip: `الرقم 170 قريب من أعلى المسرح، لأن المسرح بيمتد من -180 (تحت) لحد 180 (فوق).`
    },
    {
      id: 'catch',
      emoji: '🎯',
      title: 'اصطاد النجمة',
      visual: 'coins',
      goal: 'لما النجمة تلمس اللاعب النقط بتزيد ويطلع صوت، والنجمة بترجع فوق في مكان جديد.',
      tasks: [
        `جوّا الـ ${E('forever')} وبعد ${E('change y by -5')} حط ${E('if <touching Player?> then')}.`,
        `جوّا الـ ${E('if')} حط ${E('change [score] by 1')}.`,
        `بعدها ${E('start sound [Pop]')} (دوّر على الصوت في تبويب ${E('Sounds')} لو احتجت).`,
        `بعدها ${E('go to x: (pick random -200 to 200) y: 170')} علشان النجمة ترجع فوق.`,
        'جرّب اللعبة: النقط بتزيد لما تصطاد؟'
      ],
      blocks: [['if', 'touching Player?', []], ['changevar', 'score', 1], ['sound', 'Pop'], ['goto', RND, 170]],
      practice: {
        initial: star([['changey', -5]]),
        palette: [
          ['if', 'touching Player?', []], ['if', 'touching Enemy?', []], ['changevar', 'score', 1], ['changevar', 'score', -1],
          ['sound', 'Pop'], ['goto', RND, 170], ['hide'], ['stopall']
        ],
        solution: star([['changey', -5], STAR_CATCH]),
        hint: 'اضغط على الخانة اللي تحت change y by -5 جوّا forever وبعدين ضيف الـ if.'
      },
      tip: `لو النقط مازادتش، اتأكد إن اسم الكائن في ${E('touching')} هو ${E('Player')} بالظبط.`
    },
    {
      id: 'miss',
      emoji: '💔',
      title: 'النجمة الضايعة',
      visual: 'proj-star',
      goal: 'لو النجمة وصلت لتحت المسرح قبل ما تصطادها، بتخسر قلب والنجمة بترجع فوق.',
      tasks: [
        `بعد الـ ${E('if touching')} حط كتلة ${E('if <> then')} جديدة.`,
        `الشرط: من ${E('Operators')} هات ${E('( ) < ( )')} واكتب فيها ${E('(y position) < -170')}. (كتلة ${E('y position')} من قسم ${E('Motion')}).`,
        `جواها ${E('change [lives] by -1')} وبعدها ${E('go to x: (pick random -200 to 200) y: 170')}.`,
        `جرّب ماتصطادش نجمة وشوف هل متغيّر ${E('lives')} بينقص.`
      ],
      blocks: [['if', Y_LT, []], ['changevar', 'lives', -1], ['goto', RND, 170]],
      practice: {
        initial: star([['changey', -5], STAR_CATCH]),
        palette: [
          ['if', Y_LT, []], ['if', { t: 'y position > 170', cat: 'operators' }, []],
          ['changevar', 'lives', -1], ['changevar', 'lives', 1], ['changevar', 'score', -1], ['goto', RND, 170], ['stopall']
        ],
        solution: star([['changey', -5], STAR_CATCH, STAR_MISS]),
        hint: 'حط الـ if الجديد بعد الـ if الأولى (مش جواها).'
      },
      tip: '-170 ارتفاع قريب من تحت المسرح، وده المكان اللي النجمة بتضيع فيه.'
    },
    {
      id: 'over',
      emoji: '🏁',
      title: 'نهاية اللعبة',
      visual: 'gameover',
      goal: 'لما القلوب تخلص بيظهر Game Over واللعبة بتقف.',
      tasks: [
        `بعد الـ ${E('if')} التانية حط ${E('if <> then')} جديدة.`,
        `الشرط: ${E('(lives) < 1')} (استخدم كتلة ${E('lives')} من قسم ${E('Variables')}).`,
        `جواها ${E('say [Game Over!] for 2 seconds')} وبعدها ${E('stop [all]')}.`,
        'العب لحد ما 3 نجوم يضيعوا وتأكد إن الرسالة بتظهر واللعبة بتقف.'
      ],
      blocks: [['if', LIVES_LT, []], ['say', 'Game Over!', 2], ['stopall']],
      practice: {
        initial: star([['changey', -5], STAR_CATCH, STAR_MISS]),
        palette: [
          ['if', LIVES_LT, []], ['if', { t: 'lives > 3', cat: 'operators' }, []],
          ['say', 'Game Over!', 2], ['stopall'], ['hide'], ['wait', 1]
        ],
        solution: star([['changey', -5], STAR_CATCH, STAR_MISS, STAR_OVER]),
        hint: 'حط say الأول وبعدين stop all (لو حطيت stop all الأول الرسالة مش هتظهر).'
      },
      tip: `${E('stop [all]')} بتنهي كل حاجة، علشان كده بنحطها في آخر الكود بعد رسالة النهاية.`
    },
    {
      id: 'polish',
      emoji: '✨',
      title: 'الاختبار والحفظ',
      visual: 'proj-final',
      goal: 'لعبتك جاهزة! تعالى نجرّبها كويس ونحفظها.',
      tasks: [
        `اضغط ${E('Green Flag')} وتأكد: اللاعب بيتحرك يمين وشمال بالأسهم.`,
        'النجمة بتقع من مكان مختلف كل مرة.',
        'النقط بتزيد لما تصطاد، والقلوب بتنقص لما تضيع.',
        'لما القلوب تخلص الرسالة بتظهر واللعبة بتقف.',
        `احفظ مشروعك: ${E('File')} وبعدين ${E('Save to your computer')}، واكتب اسم زي <b>${E('Star Catcher')}</b>.`
      ],
      blocks: [],
      bonus: [
        `ضيف موسيقى: ${E('when green flag clicked')} وبعدها ${E('forever')} وبعدها ${E('play sound [ ] until done')}.`,
        'ضيف عدو جديد (قنبلة 💣) بتقع زي النجمة، ولو اللاعب لمسها اللعبة بتخلص.',
        'خلّي النجمة تقع أسرع كل ما النقط تزيد.',
        `غيّر شكل اللاعب بـ ${E('next costume')} وهو بيتحرك.`
      ],
      tip: 'نصيحة: أي لعبة بتبدأ بفكرة بسيطة وبعدين بنزوّد عليها خطوة خطوة، زي ما عملت دلوقتي بالظبط.'
    }
  ],

  /* الكود النهائي اللي بيظهر بعد ما تخلّص */
  finalScripts: [
    { sprite: 'Player', script: PLAYER_SCRIPT },
    { sprite: 'Star', script: star([['changey', -5], STAR_CATCH, STAR_MISS, STAR_OVER]) }
  ]
};

/* ============================================================
   الفكرة 3: Maze Escape (متوسط)
   ============================================================ */
const MZ_START = ['goto', -200, -140];
const MZ_KEYS = [
  ['if', 'key up arrow pressed?', [['changey', 10]]],
  ['if', 'key down arrow pressed?', [['changey', -10]]],
  ['if', 'key left arrow pressed?', [['changex', -10]]],
  ['if', 'key right arrow pressed?', [['changex', 10]]]
];
const MZ_WALL = ['if', 'touching Wall?', [MZ_START]];
const MZ_GOAL = ['if', 'touching Goal?', [['say', 'You win!', 2], ['stopall']]];
const mazePlayer = (inner) => [['flag'], MZ_START, ['forever', inner]];

const MAZE = {
  id: 'maze',
  game: 'Maze Escape',
  emoji: '🧩',
  level: 2,
  blurb: 'وصّل اللاعب لحد النجمة في المتاهة من غير ما يلمس الحيطة.',
  intro: `لعبة متاهة: لازم توصّل اللاعب لحد النجمة من غير ما يلمس الحيطة. لو لمس الحيطة بيرجع من الأول، ولما يوصل للنجمة تكسب!`,

  steps: [
    {
      id: 'maze-setup',
      emoji: '🎨',
      title: 'جهّز المتاهة',
      visual: 'proj-maze',
      goal: 'هنجهّز اللاعب والحيطة والهدف.',
      tasks: [
        `افتح ${E('Scratch')} من الزرار اللي فوق، وبعدين ${E('File')} وبعدين ${E('New')}.`,
        `اضغط على الـ ${E('Cat')} وغيّر اسمها لـ <b>${E('Player')}</b>، وخلّي ${E('Size')} يساوي <b>30</b> علشان تعدّي من الممرات الضيقة.`,
        `مرّر الماوس على زرار ${E('Choose a Sprite')} واختار ${E('Paint')} (الفرشاة 🖌). ارسم خطوط سميكة على شكل متاهة بلون واحد بس (مثلاً بني) وسمّي الكائن <b>${E('Wall')}</b>.`,
        `ضيف ${E('Star')} من ${E('Choose a Sprite')} وسمّيها <b>${E('Goal')}</b> وصغّرها (${E('Size')} يساوي 40).`,
        `حط الـ ${E('Player')} في ركن المسرح اللي تحت على الشمال، والـ ${E('Goal')} في الركن اللي فوق على اليمين.`
      ],
      blocks: [],
      tip: 'سيب ممرات أعرض شوية من اللاعب علشان يعدّي بسهولة.'
    },
    {
      id: 'maze-move',
      emoji: '🕹',
      title: 'حرّك اللاعب',
      visual: 'arrow-keys',
      goal: 'اللاعب بيبدأ من ركن المسرح وبيتحرك في 4 اتجاهات بالأسهم.',
      tasks: [
        `اختار الـ ${E('Player')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('go to x: -200 y: -140')}.`,
        `حط ${E('forever')} وجواها 4 كتل ${E('if')}، واحدة لكل سهم.`,
        `السهم اللي فوق: ${E('change y by 10')}. السهم اللي تحت: ${E('change y by -10')}. الشمال: ${E('change x by -10')}. اليمين: ${E('change x by 10')}.`,
        `اضغط ${E('Green Flag')} وجرّب تحرّك اللاعب.`
      ],
      blocks: [
        ['flag'], ['goto', -200, -140], ['forever', []],
        ['if', 'key up arrow pressed?', []], ['changey', 10]
      ],
      practice: {
        palette: [
          ['flag'], ['goto', -200, -140], ['goto', 0, 0], ['forever', []],
          ['if', 'key up arrow pressed?', []], ['if', 'key down arrow pressed?', []],
          ['if', 'key left arrow pressed?', []], ['if', 'key right arrow pressed?', []],
          ['changey', 10], ['changey', -10], ['changex', 10], ['changex', -10]
        ],
        solution: mazePlayer(MZ_KEYS),
        alts: perms(MZ_KEYS).map(mazePlayer),
        hint: 'جوّا الـ forever محتاج 4 كتل if: فوق (change y 10)، تحت (change y -10)، شمال (change x -10)، يمين (change x 10).'
      },
      tip: `لو اللاعب راح عكس الاتجاه، راجع الإشارة: ${E('y')} بالموجب لفوق وبالسالب لتحت، و${E('x')} بالموجب لليمين وبالسالب للشمال.`
    },
    {
      id: 'maze-wall',
      emoji: '🧱',
      title: 'الحيطة',
      visual: 'proj-maze',
      goal: 'لو اللاعب لمس الحيطة بيرجع لأول المتاهة.',
      tasks: [
        `جوّا الـ ${E('forever')} بعد الـ 4 كتل ${E('if')} حط كتلة ${E('if <> then')} جديدة.`,
        `الشرط: ${E('touching [Wall]?')} من قسم ${E('Sensing')}.`,
        `جواها ${E('go to x: -200 y: -140')}.`,
        'جرّب تلمس الحيطة وشوف اللاعب بيرجع للأول.'
      ],
      blocks: [['if', 'touching Wall?', []], ['goto', -200, -140]],
      practice: {
        initial: mazePlayer(MZ_KEYS),
        palette: [
          ['if', 'touching Wall?', []], ['if', 'touching Goal?', []],
          ['goto', -200, -140], ['goto', 0, 0], ['hide'], ['stopall']
        ],
        solution: mazePlayer([...MZ_KEYS, MZ_WALL]),
        alts: perms([...MZ_KEYS, MZ_WALL]).map(mazePlayer),
        hint: 'ضيف if جديدة جوّا الـ forever (مش جوّا واحدة من الـ if اللي فاتت)، وجواها go to بنفس مكان البداية.'
      },
      tip: `لو ماحصلش حاجة لما تلمس الحيطة، اتأكد إن اسم الكائن ${E('Wall')} مكتوب صح بالظبط.`
    },
    {
      id: 'maze-goal',
      emoji: '🏆',
      title: 'الوصول للهدف',
      visual: 'proj-win',
      goal: 'لما اللاعب يوصل للنجمة بيظهر YOU WIN واللعبة بتقف.',
      tasks: [
        `بعد كتلة الـ ${E('if')} بتاعة الحيطة حط ${E('if <> then')} جديدة.`,
        `الشرط: ${E('touching [Goal]?')}.`,
        `جواها ${E('say [You win!] for 2 seconds')} وبعدها ${E('stop [all]')}.`,
        'وصّل اللاعب لحد النجمة وتأكد إن الرسالة بتظهر.'
      ],
      blocks: [['if', 'touching Goal?', []], ['say', 'You win!', 2], ['stopall']],
      practice: {
        initial: mazePlayer([...MZ_KEYS, MZ_WALL]),
        palette: [
          ['if', 'touching Goal?', []], ['if', 'touching Wall?', []],
          ['say', 'You win!', 2], ['stopall'], ['hide'], ['wait', 1]
        ],
        solution: mazePlayer([...MZ_KEYS, MZ_WALL, MZ_GOAL]),
        alts: perms([...MZ_KEYS, MZ_WALL, MZ_GOAL]).map(mazePlayer),
        hint: 'حط say الأول وبعدين stop all، علشان الرسالة تظهر قبل ما اللعبة تقف.'
      },
      tip: `${E('stop [all]')} في الآخر دايماً، لأنها بتوقّف كل حاجة.`
    },
    {
      id: 'maze-polish',
      emoji: '✨',
      title: 'الاختبار والحفظ',
      visual: 'proj-win',
      goal: 'المتاهة جاهزة! تعالى نجرّبها ونحفظها.',
      tasks: [
        `اضغط ${E('Green Flag')} وتأكد إن اللاعب بيتحرك في الـ 4 اتجاهات.`,
        'الحيطة بترجّعك للأول.',
        'النجمة بتكسّبك واللعبة بتقف.',
        `احفظ مشروعك: ${E('File')} وبعدين ${E('Save to your computer')}، واكتب اسم زي <b>${E('Maze Escape')}</b>.`
      ],
      blocks: [],
      bonus: [
        `ضيف صوت لما تلمس الحيطة بـ ${E('start sound [ ]')}.`,
        `ضيف عدو بيتحرك رايح جاي في المتاهة باستخدام ${E('move')} و${E('if on edge, bounce')}.`,
        `ضيف متغيّر ${E('time')} بيحسب خدت كام ثانية علشان توصل.`,
        `اعمل مرحلة تانية بخلفية مختلفة باستخدام ${E('switch backdrop to')}.`
      ],
      tip: 'صمّم متاهة أصعب وخلّي صحابك يجرّبوها!'
    }
  ],

  finalScripts: [
    { sprite: 'Player', script: mazePlayer([...MZ_KEYS, MZ_WALL, MZ_GOAL]) }
  ]
};

/* ============================================================
   الفكرة 4: Run Away (متوسط)
   ============================================================ */
const CH_PLAYER = [['flag'], ['forever', [['gotomouse']]]];
const CH_ENEMY_MOVE = [['towards', 'Player'], ['move', 3]];
const CH_CATCH = ['if', 'touching Player?', [['say', 'Got you!', 2], ['stopall']]];
const chaseEnemy = (inner) => [['flag'], ['goto', 200, 150], ['forever', inner]];
const CH_SCORE = [['flag'], ['setvar', 'score', 0], ['forever', [['wait', 1], ['changevar', 'score', 1]]]];

const CHASE = {
  id: 'chase',
  game: 'Run Away',
  emoji: '🏃',
  level: 2,
  blurb: 'عدو بيجري وراك، وإنت بتهرب منه بالماوس. عيش أطول وقت ممكن!',
  intro: `لعبة هروب: عدو بيجري وراك علطول، وإنت بتحرّك القطة بالماوس علشان تهرب منه. كل ثانية بتفضل فيها عايش بتزوّد نقطة، ولو العدو مسكك اللعبة بتخلص!`,

  steps: [
    {
      id: 'chase-setup',
      emoji: '🎨',
      title: 'جهّز المشروع',
      visual: 'proj-setup',
      goal: 'هنجهّز اللاعب والعدو والنقط.',
      tasks: [
        `افتح ${E('Scratch')} من الزرار اللي فوق، وبعدين ${E('File')} وبعدين ${E('New')}.`,
        `من ${E('Choose a Backdrop')} اختار خلفية تعجبك (مثلاً ${E('Space')} أو ${E('Blue Sky')}).`,
        `اضغط على الـ ${E('Cat')} وغيّر اسمها في خانة ${E('Sprite')} لـ <b>${E('Player')}</b>.`,
        `من ${E('Choose a Sprite')} ضيف شخصية عدو (مثلاً ${E('Ghost')}) وسمّيها <b>${E('Enemy')}</b>.`,
        `من قسم ${E('Variables')} اعمل متغيّر اسمه <b>${E('score')}</b> (${E('For all sprites')}) واتأكد إنه ظاهر على المسرح.`
      ],
      blocks: [['setvar', 'score', 0]],
      tip: 'اكتب الأسماء بالإنجليزي وبحروف مظبوطة علشان تتطابق مع الكود.'
    },
    {
      id: 'chase-follow',
      emoji: '🖱',
      title: 'اللاعب يمشي ورا الماوس',
      visual: 'proj-mouse',
      goal: 'القطة بتمشي ورا الماوس علطول.',
      tasks: [
        `اختار الـ ${E('Player')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')}.`,
        `حط ${E('forever')} وجواها ${E('go to [mouse-pointer]')} من قسم ${E('Motion')}.`,
        `اضغط ${E('Green Flag')} وحرّك الماوس وشوف القطة وهي بتمشي وراه.`
      ],
      blocks: [['flag'], ['forever', []], ['gotomouse']],
      practice: {
        palette: [
          ['flag'], ['forever', []], ['gotomouse'], ['goto', 0, 0], ['gotorandom'], ['repeat', 10, []], ['hide']
        ],
        solution: CH_PLAYER,
        hint: 'حط forever وجواها go to mouse-pointer، علشان القطة تفضل ماشية ورا الماوس.'
      },
      tip: 'خلّي الماوس جوّا المسرح، لأنه لو خرج بره القطة هتقف عند الحافة.'
    },
    {
      id: 'chase-enemy',
      emoji: '👻',
      title: 'العدو بيجري وراك',
      visual: 'proj-chase',
      goal: 'العدو بيبدأ من ركن المسرح، وبيبص ناحية اللاعب وبيجري ناحيته.',
      tasks: [
        `اختار الـ ${E('Enemy')} وافتح تبويب ${E('Code')}.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('go to x: 200 y: 150')}.`,
        `حط ${E('forever')} وجواها ${E('point towards [Player]')} من قسم ${E('Motion')}.`,
        `وبعدها ${E('move 3 steps')}.`,
        'اضغط على العلم الأخضر وشوف العدو وهو بيجري وراك.'
      ],
      blocks: [['flag'], ['goto', 200, 150], ['forever', []], ['towards', 'Player'], ['move', 3]],
      practice: {
        palette: [
          ['flag'], ['goto', 200, 150], ['goto', 0, 0], ['forever', []], ['towards', 'Player'],
          ['move', 3], ['move', -3], ['repeat', 10, []], ['hide']
        ],
        solution: chaseEnemy(CH_ENEMY_MOVE),
        alts: [chaseEnemy([['move', 3], ['towards', 'Player']])],
        hint: 'جوّا الـ forever: point towards Player وبعدها move 3 steps. الرقم الموجب بيقرّب العدو، والسالب بيبعّده.'
      },
      tip: `لو العدو بيتقلب وهو ماشي، اضغط على خانة ${E('Direction')} واختار ${E('left/right')}.`
    },
    {
      id: 'chase-over',
      emoji: '💥',
      title: 'لو العدو مسكك',
      visual: 'gameover',
      goal: 'لو العدو مسك اللاعب بيظهر Got you! واللعبة بتقف.',
      tasks: [
        `لسه على الـ ${E('Enemy')}، بعد كتلة ${E('move')} حط ${E('if <> then')} جوّا الـ ${E('forever')}.`,
        `الشرط: ${E('touching [Player]?')}.`,
        `جواها ${E('say [Got you!] for 2 seconds')} وبعدها ${E('stop [all]')}.`,
        'سيب العدو يمسكك وتأكد إن اللعبة بتقف.'
      ],
      blocks: [['if', 'touching Player?', []], ['say', 'Got you!', 2], ['stopall']],
      practice: {
        initial: chaseEnemy(CH_ENEMY_MOVE),
        palette: [
          ['if', 'touching Player?', []], ['if', 'touching Enemy?', []],
          ['say', 'Got you!', 2], ['stopall'], ['hide'], ['wait', 1]
        ],
        solution: chaseEnemy([...CH_ENEMY_MOVE, CH_CATCH]),
        alts: perms([...CH_ENEMY_MOVE, CH_CATCH]).map(chaseEnemy),
        hint: 'ضيف الـ if جوّا الـ forever بعد move. وجوّا الـ if حط say الأول وبعدين stop all.'
      },
      tip: `لو اللعبة وقفت من أول ثانية، اتأكد إن العدو مش بادئ قريب من اللاعب.`
    },
    {
      id: 'chase-score',
      emoji: '⏱',
      title: 'النقط',
      visual: 'proj-chase',
      goal: 'كل ثانية بتفضل فيها عايش بتاخد نقطة.',
      tasks: [
        `اختار الـ ${E('Player')} وافتح كود جديد.`,
        `ابدأ بـ ${E('when green flag clicked')} وبعدها ${E('set [score] to 0')}.`,
        `حط ${E('forever')} وجواها ${E('wait 1 seconds')} وبعدها ${E('change [score] by 1')}.`,
        'العب وشوف النقط بتزيد لحد ما العدو يمسكك.'
      ],
      blocks: [['flag'], ['setvar', 'score', 0], ['forever', []], ['wait', 1], ['changevar', 'score', 1]],
      practice: {
        palette: [
          ['flag'], ['setvar', 'score', 0], ['forever', []], ['wait', 1],
          ['changevar', 'score', 1], ['changevar', 'score', -1], ['hide']
        ],
        solution: CH_SCORE,
        hint: 'جوّا الـ forever: wait 1 وبعدها change score by 1. من غير wait النقط هتزيد بسرعة جداً!'
      },
      tip: `لو عايز النقط تزيد أبطأ، زوّد الرقم في كتلة ${E('wait')}.`
    },
    {
      id: 'chase-polish',
      emoji: '✨',
      title: 'الاختبار والحفظ',
      visual: 'proj-chase',
      goal: 'لعبتك جاهزة! تعالى نجرّبها ونحفظها.',
      tasks: [
        `اضغط ${E('Green Flag')} وتأكد إن القطة بتمشي ورا الماوس.`,
        'العدو بيجري وراك.',
        'النقط بتزيد كل ثانية، والعدو لما يمسكك اللعبة بتقف.',
        `احفظ مشروعك: ${E('File')} وبعدين ${E('Save to your computer')}، واكتب اسم زي <b>${E('Run Away')}</b>.`
      ],
      blocks: [],
      bonus: [
        `خلّي العدو أسرع: غيّر الرقم 3 في ${E('move')} لـ 4 أو 5.`,
        `ضيف عدو تاني (اضغط بيمين الماوس على العدو واختار ${E('duplicate')} وغيّر مكان البداية).`,
        `ضيف صوت لما العدو يمسك اللاعب بـ ${E('start sound')}.`,
        `سجّل أعلى نقط في متغيّر جديد اسمه ${E('high score')}.`
      ],
      tip: 'جرّب تغيّر الأرقام وشوف إيه اللي بيحصل، كده بتتعلم أسرع!'
    }
  ],

  finalScripts: [
    { sprite: 'Player (1)', script: CH_PLAYER },
    { sprite: 'Player (2)', script: CH_SCORE },
    { sprite: 'Enemy', script: chaseEnemy([...CH_ENEMY_MOVE, CH_CATCH]) }
  ]
};

/* ============================================================
   كل الأفكار (الترتيب من الأسهل للأصعب)
   ============================================================ */
window.PROJECTS = {
  title: 'مشروع التخرج',
  intro: 'اختار فكرة لعبة تعجبك واعملها بنفسك خطوة بخطوة في برنامج Scratch الحقيقي. ممكن تعمل فكرة واحدة أو أكتر!',
  editorUrl: 'https://scratch.mit.edu/projects/editor/',
  levels: LEVELS,
  projects: [MONSTER, STAR_CATCHER, MAZE, CHASE]
};
