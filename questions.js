/* ============================================================
   امتحان سكراتش: صناعة الألعاب
   ------------------------------------------------------------
   لتعديل الامتحان غيّر هذا الملف فقط.

   questions قائمة الأسئلة (درجة الامتحان = 100، وتتوزع على عدد الأسئلة)
   مفيش وقت محدد للامتحان: الطفل ياخد وقته براحته.

   أنواع الأسئلة:
   mcq   اختيار من متعدد     { options:[نص | O('🎬','نص') | {script:[...]}], answer: رقم الإجابة الصحيحة }
   tf    صح أو غلط           { answer: true | false }
   order رتّب الكتل          { items:[كتلة,...] }   (الترتيب المكتوب هو الترتيب الصحيح)
   match وصّل                { pairs:[[يمين, شمال],...] }   كل طرف: كتلة أو نص
   pick  اضغط على الكتلة الغلط { script:[...], answer: رقم الكتلة, solution:'...' }
   build ركّب الكود بنفسك    { palette:[كتل متاحة + كتل مشتتة], solution:[كود نهائي], alts:[حلول تانية مقبولة] }

   حقول إضافية:
   hint: 'نص'        تلميح بيظهر لما الطفل يضغط على زرار «عايز تلميح؟» (يتكتب بالعامية المصرية وبدون ما يدّي الإجابة جاهزة)
   visual: 'اسم'     رسم توضيحي (الأسماء في visuals.js)
   script / scripts  عرض كود سكراتش مع السؤال
   sim: true         زرار «شغّل الكود» بيحرّك القطة على مسرح صغير
   simStart: {x,y}   مكان بداية القطة على المسرح
   explain           شرح الإجابة (بيظهر في المراجعة)

   أسماء الكتل والواجهة بتتكتب بالإنجليزي زي ما هي في سكراتش.
   جوه أي نص عربي استخدم E('...') علشان تكتب كلمة إنجليزي بشكل سليم.

   شكل الكتلة:  ['move', 10]   ['turn','r',15]   ['say','Hello!',2]
   كتل C:       ['repeat', 4, [ ...كتل جوّاها... ]]
   ============================================================ */

const E = (t) => `<span class="en" dir="ltr">${String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
/* اختيار نصي مع أيقونة */
const O = (icon, text) => ({ i: icon, t: text });
/* كل ترتيبات مجموعة كتل (لقبول أكتر من حل صح) */
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));

const COIN_INNER = [['changevar', 'score', 1], ['sound', 'Pop'], ['gotorandom']];
const coinSolution = (inner) => [['flag'], ['setvar', 'score', 0], ['forever', [['if', 'touching Player?', inner]]]];

window.EXAM = {
  title: 'امتحان سكراتش: صناعة الألعاب',
  questions: [
    /* ---------- 1) واجهة البرنامج ---------- */
    {
      type: 'mcq',
      q: 'إيه اسم المكان اللي الشخصيات بتتحرك فيه واللعبة بتظهر عليه؟',
      hint: 'ده الشاشة اللي اللاعب بيشوفها وهو بيلعب. بص على المربع اللي عليه علامة ❓ في الرسمة.',
      visual: 'ui-stage',
      options: [O('🎬', E('Stage')), O('🧰', E('Blocks palette')), O('🔊', E('Sound library')), O('👕', E('Costumes list'))],
      answer: 0,
      explain: `الـ ${E('Stage')} هو الشاشة اللي اللاعب بيشوفها، وعليها بتتحرك الـ ${E('Sprites')} وبتظهر الـ ${E('Backdrop')}.`
    },
    {
      type: 'mcq',
      q: `فين بنسحب الـ ${E('Blocks')} ونركّبها فوق بعض علشان نكتب كود اللعبة؟`,
      hint: 'الكتل مش بتتركّب على الشاشة. دوّر على المساحة الفاضية اللي في النص، اللي بنبني فيها الكود.',
      visual: 'ui-code',
      options: [
        O('🧱', `في الـ ${E('Code area')} جوه تبويب ${E('Code')}`),
        O('🎬', `على الـ ${E('Stage')}`),
        O('🔊', `في تبويب ${E('Sounds')}`),
        O('⏹', `في زرار ${E('Stop')} الأحمر`)
      ],
      answer: 0,
      explain: `بنسحب الـ ${E('Blocks')} من الـ ${E('Blocks palette')} وبنركّبها في الـ ${E('Code area')}.`
    },
    {
      type: 'match',
      q: 'وصّل كل تبويب بوظيفته:',
      hint: `${E('Costumes')} معناها «ملابس» يعني الشكل. و${E('Sounds')} معناها «أصوات».`,
      visual: 'ui-tabs',
      pairs: [
        [E('Code'), '🧱 بنركّب الكتل علشان نبرمج اللعبة'],
        [E('Costumes'), '👕 بنرسم أو بنغيّر شكل الكائن'],
        [E('Sounds'), '🔊 بنضيف أو بنسجّل المؤثرات الصوتية']
      ],
      explain: `تبويب ${E('Code')} للبرمجة، و${E('Costumes')} لأشكال الكائن، و${E('Sounds')} للمؤثرات والموسيقى.`
    },
    {
      type: 'mcq',
      q: 'عايزين نضيف شخصية عدو جديدة في اللعبة. نعمل إيه؟',
      hint: 'الزرار ده شكله ➕ بنفسجي، وبنلاقيه تحت قايمة الكائنات.',
      visual: 'ui-sprites',
      options: [
        O('➕', `نضغط على زرار ${E('Choose a Sprite')} تحت قايمة الكائنات`),
        O('🏁', `نضغط على ${E('Green Flag')}`),
        O('✏️', 'نغيّر اسم المشروع'),
        O('⏹', `نضغط على زرار ${E('Stop')}`)
      ],
      answer: 0,
      explain: `زرار ${E('Choose a Sprite')} بيفتح مكتبة الكائنات، فنختار منها العدو أو نرسم ${E('Sprite')} جديد.`
    },
    {
      type: 'tf',
      q: `كل ${E('Sprite')} في سكراتش ليه كود خاص بيه، يعني ممكن كود ${E('Cat')} يبقى مختلف عن كود ${E('Ball')}.`,
      hint: 'بص على الرسمة: القطة ليها كود والكورة ليها كود تاني. لو كل الكائنات ليها نفس الكود، القطة والكورة كانوا هيعملوا نفس الحاجة!',
      visual: 'own-code',
      answer: true,
      explain: `كل ${E('Sprite')} ليه ${E('Code')} و${E('Costumes')} و${E('Sounds')} خاصين بيه، علشان كده بنختار الـ ${E('Sprite')} الأول وبعدين نبرمجه.`
    },

    /* ---------- 2) الأحداث Events ---------- */
    {
      type: 'mcq',
      q: 'عايزين اللاعب يتحرك لما نضغط على السهم اليمين. بأنهي كتلة نبدأ الكود؟',
      hint: `دوّر على الكتلة اللي مكتوب فيها ${E('key pressed')}، يعني «لما مفتاح يتضغط».`,
      visual: 'arrow-keys',
      options: [
        { script: [['key', 'right arrow']] },
        { script: [['flag']] },
        { script: [['clicked']] },
        { script: [['receive', 'message1']] }
      ],
      answer: 0,
      explain: `كتلة ${E('when [key] key pressed')} من قسم ${E('Events')} بتبدأ الكود لما نضغط على المفتاح اللي إحنا نختاره.`
    },
    {
      type: 'mcq',
      q: `حطّينا زرار ${E('Start')} على المسرح. بأنهي كتلة نبدأ كود الزرار علشان يشتغل لما اللاعب يدوس عليه؟`,
      hint: `اللاعب هيدوس بالماوس على الزرار نفسه. دوّر على كتلة فيها ${E('clicked')} و${E('this sprite')}.`,
      visual: 'start-btn',
      options: [
        { script: [['clicked']] },
        { script: [['key', 'space']] },
        { script: [['flag']] },
        { script: [['receive', 'message1']] }
      ],
      answer: 0,
      explain: `${E('when this sprite clicked')} بتبدأ الكود لما اللاعب يدوس على الـ ${E('Sprite')} نفسه، زي الأزرار.`
    },
    {
      type: 'build',
      q: 'المطلوب: ركّب كود يخلّي اللاعب يقفز لما نضغط مفتاح المسافة: يطلع لفوق، وبعدين يستنى شوية، وبعدين ينزل مكانه.',
      hint: `الطلوع لفوق يعني ${E('change y')} برقم موجب، والنزول يعني رقم سالب. وكتلة البداية (الصفرا) دايماً بتتحط الأولى. مش لازم تستخدم كل الكتل، فيه كتل زيادة.`,
      visual: 'jump',
      palette: [
        ['key', 'space'], ['key', 'up arrow'], ['changey', 50], ['changey', -50],
        ['changex', 50], ['wait', 0.3], ['say', 'Hello!', 2], ['move', 50]
      ],
      solution: [['key', 'space'], ['changey', 50], ['wait', 0.3], ['changey', -50]],
      explain: `بنبدأ بـ ${E('when space key pressed')}، وبعدين ${E('change y by 50')} علشان يطلع، وبعدين ${E('wait')}، وبعدين ${E('change y by -50')} علشان ينزل.`
    },

    /* ---------- 3) الحركة Motion ---------- */
    {
      type: 'mcq',
      q: 'أنهي كتلة بتنقل الكائن علطول لمكان معين على المسرح؟',
      hint: `دوّر على الكتلة اللي فيها ${E('x')} و${E('y')}، لأنهم هما اللي بيحددوا المكان.`,
      visual: 'goto',
      options: [
        { script: [['goto', 0, 0]] },
        { script: [['move', 10]] },
        { script: [['turn', 'r', 15]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `${E('go to x: y:')} بتنقل الكائن علطول للمكان اللي إحنا بنحدده.`
    },
    {
      type: 'mcq',
      q: `شغّل الكود وشوف. كتلة ${E('change x by')} حرّكت القطة في أنهي اتجاه؟`,
      hint: 'اضغط على «▶ شغّل الكود» وراقب القطة كويس. راحت ناحية السقف ولا ناحية الجنب؟',
      script: [['flag'], ['repeat', 3, [['changex', 30]]]],
      sim: true,
      simStart: { x: -150, y: 0 },
      options: [
        O('↔️', 'أفقي: يمين أو شمال'),
        O('↕️', 'لفوق أو لتحت'),
        O('⭕', 'في دايرة'),
        O('🚫', 'ماتحركتش')
      ],
      answer: 0,
      explain: `${E('x')} بتتحكم في الحركة يمين وشمال، و${E('y')} بتتحكم في الحركة لفوق ولتحت. ${E('change x by')} مفيدة جداً لتحريك اللاعب بالأسهم.`
    },
    {
      type: 'mcq',
      q: `إيه اللي بتعمله كتلة ${E('if on edge, bounce')} في الكود ده؟`,
      hint: `${E('bounce')} معناها «يرتد»، زي الكورة لما تخبط في الحيطة. و${E('edge')} معناها «حافة».`,
      visual: 'bounce',
      script: [['flag'], ['forever', [['move', 10], ['bounce']]]],
      options: [
        O('↩️', 'بتخلّي الكائن يرتد لما يوصل لحافة المسرح'),
        O('🗑', 'بتمسح الكائن من اللعبة'),
        O('⏹', 'بتوقّف اللعبة كلها'),
        O('🖼', 'بتغيّر خلفية المسرح')
      ],
      answer: 0,
      explain: `الكتلة دي بتمنع الـ ${E('Sprite')} إنه يخرج برّه الـ ${E('Stage')}، فبيرتد ويكمّل حركته. بنستخدمها كتير في ألعاب الكورة.`
    },

    /* ---------- 4) المظهر والصوت Looks & Sound ---------- */
    {
      type: 'mcq',
      q: 'عايزين الشخصية تبان كإنها بتمشي أو بتجري. أنهي كتلة نكررها علشان نغيّر شكل الشخصية؟',
      hint: `الشخصية بتبان بتمشي لما شكلها بيتغيّر بسرعة. دوّر على الكتلة اللي فيها كلمة ${E('costume')}.`,
      visual: 'costumes',
      options: [
        { script: [['costume']] },
        { script: [['say', 'Hello!', 2]] },
        { script: [['sound', 'Meow']] },
        { script: [['goto', 0, 0]] }
      ],
      answer: 0,
      explain: `${E('next costume')} بتغيّر شكل الـ ${E('Sprite')}، ولما بتتكرر بسرعة الحركة بتبان حقيقية.`
    },
    {
      type: 'match',
      q: 'وصّل كل كتلة بوظيفتها:',
      hint: `اقرا الكلمات الإنجليزي اللي في الكتل: ${E('hide')} يعني «اخفي»، و${E('show')} يعني «اظهر»، و${E('backdrop')} يعني «خلفية»، و${E('sound')} يعني «صوت».`,
      pairs: [
        [['hide'], '👻 بتخبّي الكائن من على المسرح'],
        [['show'], '👀 بتظهّر الكائن على المسرح'],
        [['backdrop', 'backdrop2'], '🖼 بتغيّر خلفية المسرح'],
        [['sound', 'Meow'], '🔊 بتشغّل صوت']
      ],
      explain: `بنستخدم ${E('hide')} علشان نخبّي العملة بعد ما نجمعها، و${E('show')} علشان نرجّعها، و${E('switch backdrop to')} علشان ننتقل بين المراحل.`
    },
    {
      type: 'build',
      q: `المطلوب: كائن ${E('Coin')} يختفي ويطلع صوت لما اللاعب ${E('Player')} يلمسه، والفحص ده بيحصل طول اللعبة. ركّب كود الـ ${E('Coin')}.`,
      hint: `ابدأ بـ ${E('Green Flag')}، وبعدها ${E('forever')} علشان الفحص يفضل شغال. جوّاها حط ${E('if touching Player?')}، وجوّا الـ ${E('if')} حط الصوت و${E('hide')}.`,
      visual: 'sound-hide',
      palette: [
        ['flag'], ['forever', []], ['repeat', 10, []], ['if', 'touching Player?', []], ['if', 'touching Enemy?', []],
        ['sound', 'Pop'], ['hide'], ['show'], ['stopall'], ['wait', 1]
      ],
      solution: [['flag'], ['forever', [['if', 'touching Player?', [['sound', 'Pop'], ['hide']]]]]],
      alts: [[['flag'], ['forever', [['if', 'touching Player?', [['hide'], ['sound', 'Pop']]]]]]],
      explain: `${E('forever')} بتفحص طول اللعبة، و${E('if touching Player? then')} بتنفّذ اللي جواها وقت اللمس: ${E('start sound')} و${E('hide')}.`
    },

    /* ---------- 5) التحكم والاستشعار Control & Sensing ---------- */
    {
      type: 'build',
      q: 'المطلوب: حرّك اللاعب لليمين باستمرار طول اللعبة، بس لما يكون مفتاح السهم اليمين مضغوط.',
      hint: `محتاجين ${E('forever')} علشان الفحص يفضل شغال، وجواها ${E('if')} بتشوف هل السهم اليمين مضغوط، وجوّا الـ ${E('if')} حط ${E('change x by')} برقم موجب.`,
      visual: 'arrow-keys',
      palette: [
        ['flag'], ['key', 'right arrow'], ['forever', []], ['repeat', 10, []],
        ['if', 'key right arrow pressed?', []], ['if', 'key left arrow pressed?', []],
        ['changex', 10], ['changex', -10], ['changey', 10], ['wait', 1]
      ],
      solution: [['flag'], ['forever', [['if', 'key right arrow pressed?', [['changex', 10]]]]]],
      explain: `${E('forever')} بتفحص باستمرار، و${E('if <key right arrow pressed?> then')} بتتأكد من المفتاح، وجواها ${E('change x by 10')} علشان اللاعب يتحرك يمين.`
    },
    {
      type: 'pick',
      q: `اللعبة بتقف علطول بعد الضغط على ${E('Green Flag')}! اضغط على الكتلة اللي عاملة المشكلة.`,
      hint: `دوّر على كتلة اسمها ${E('stop')}. إنت مش عايز اللعبة تقف قبل ما تبدأ!`,
      visual: 'frozen',
      script: [
        ['flag'],
        ['setvar', 'score', 0],
        ['stopall'],
        ['forever', [['move', 10], ['bounce']]]
      ],
      answer: 2,
      solution: `كتلة ${E('stop [all]')}، لأنها بتوقّف كل الأكواد قبل ما الحركة تبدأ.`,
      explain: `كتلة ${E('stop [all]')} بتوقّف المشروع كله فوراً، فبنحطها بس لما اللعبة تخلص.`
    },
    {
      type: 'mcq',
      q: `عايزين كتلة ${E('touching [ ]?')} علشان نعرف لو العدو ضرب اللاعب. هنلاقيها في أنهي قسم (لونه أزرق فاتح)؟`,
      hint: `القسم ده بيخلّي الكائن «يحس» باللي حواليه: لمس، مفاتيح، ماوس. وكلمته بالإنجليزي معناها «استشعار».`,
      visual: 'ui-palette',
      options: [O('👀', E('Sensing')), O('🏃', E('Motion')), O('🔊', E('Sound')), O('➕', E('Operators'))],
      answer: 0,
      explain: `قسم ${E('Sensing')} فيه الكتل اللي بتفحص اللمس والمفاتيح والماوس.`
    },
    {
      type: 'mcq',
      q: 'عايزين اللاعب يخسر بس لما يلمس العدو. أنهي كتلة نحطها علشان نكتب الشرط ده؟',
      hint: `كلمة «لو» بالإنجليزي هي ${E('if')}. دوّر على الكتلة اللي فيها ${E('if')} وفيها مكان للشرط.`,
      visual: 'touch',
      options: [
        { script: [['if', 'touching Enemy?', []]] },
        { script: [['repeat', 10, []]] },
        { script: [['forever', []]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `كتلة ${E('if <> then')} بتنفّذ اللي جواها بس لما الشرط يتحقق، زي: ${E('if touching Enemy?')}.`
    },
    {
      type: 'order',
      q: `رتّب الكتل: لما نستقبل رسالة ${E('game over')} اللاعب يقول ${E('You lose!')}، وبعدين ${E('hide')}، وبعدين ${E('stop all')}.`,
      hint: `الكتلة الصفرا اللي بتبدأ الكود هي الأولى، وكتلة ${E('stop all')} هي الأخيرة لأنها بتوقّف كل حاجة.`,
      visual: 'gameover',
      items: [
        ['receive', 'game over'],
        ['say', 'You lose!', 2],
        ['hide'],
        ['stopall']
      ],
      explain: 'بنبدأ بكتلة الاستقبال، وبعدين نقول الرسالة، وبعدين نخفّي اللاعب، وفي الآخر نوقّف كل حاجة.'
    },

    /* ---------- 6) المتغيرات والرسائل والاستنساخ ---------- */
    {
      type: 'build',
      q: `المطلوب: لعبة جمع النجوم. لما نضغط ${E('Green Flag')} النقط تبدأ من صفر، وطول اللعبة: لو اللاعب ${E('Player')} لمس النجمة دي، النقط تزيد 1، ويطلع صوت، والنجمة تروح مكان عشوائي.`,
      hint: `الأول ${E('flag')} وبعدها ${E('set score to 0')} (مرة واحدة بس!). وبعدين ${E('forever')} وجواها ${E('if touching Player?')}. وجوّا الـ ${E('if')} حط 3 كتل: زوّد النقط، الصوت، والمكان العشوائي.`,
      visual: 'coins',
      palette: [
        ['flag'], ['setvar', 'score', 0], ['changevar', 'score', 1], ['changevar', 'score', -1], ['forever', []],
        ['if', 'touching Player?', []], ['sound', 'Pop'], ['gotorandom'], ['hide'], ['stopall'], ['wait', 1]
      ],
      solution: coinSolution(COIN_INNER),
      alts: perms(COIN_INNER).map(coinSolution).slice(1),
      explain: `${E('set [score] to 0')} مرة واحدة في الأول، وبعدين ${E('forever')} و${E('if touching Player?')}، وجواها ${E('change [score] by 1')} و${E('start sound')} و${E('go to [random position]')}.`
    },
    {
      type: 'mcq',
      q: `في أول اللعبة عايزين اللاعب يبدأ بصفر نقط. أنهي كتلة نحطها تحت ${E('when green flag clicked')}؟`,
      hint: `عايزين نخلّي العدّاد «يساوي» صفر، مش نزوّد عليه. دوّر على كتلة فيها كلمة ${E('set')}.`,
      visual: 'score0',
      options: [
        { script: [['setvar', 'score', 0]] },
        { script: [['changevar', 'score', 1]] },
        { script: [['hide']] },
        { script: [['stopall']] }
      ],
      answer: 0,
      explain: `${E('set [score] to 0')} بترجّع العدّاد لصفر في أول كل لعبة جديدة.`
    },
    {
      type: 'mcq',
      q: 'عايزين العملة تظهر في مكان مختلف على المسرح كل مرة. أنهي كتلة نستخدم؟',
      hint: `كلمة ${E('random')} معناها «عشوائي»، يعني مكان محدش يعرفه قبل ما يحصل.`,
      visual: 'random',
      options: [
        { script: [['gotorandom']] },
        { script: [['goto', 0, 0]] },
        { script: [['move', 10]] },
        { script: [['turn', 'r', 15]] }
      ],
      answer: 0,
      explain: `${E('go to [random position]')} بتنقل الكائن لمكان اللاعب مايعرفوش قبل كده، فاللعبة بتبقى أحلى.`
    },
    {
      type: 'mcq',
      q: 'عايزين اللاعب يقول لباقي الكائنات إن اللعبة خلصت. أنهي كتلة نستخدم؟',
      hint: `${E('broadcast')} معناها «يذيع». فيه كتلة بتبعت الرسالة وكتلة تانية بتستقبلها، وإحنا عايزين اللي بتبعت.`,
      visual: 'broadcast',
      options: [
        { script: [['broadcast', 'game over']] },
        { script: [['receive', 'game over']] },
        { script: [['say', 'Game over', 2]] },
        { script: [['wait', 1]] }
      ],
      answer: 0,
      explain: `${E('broadcast')} بتبعت رسالة لكل الكائنات، وكل كائن بيستخدم ${E('when I receive')} علشان يعرف يعمل إيه لما الرسالة توصله.`
    },
    {
      type: 'match',
      q: `وصّل كل كتلة من قسم ${E('Sensing')} بوظيفتها:`,
      hint: `${E('touching')} معناها «بيلمس»، و${E('timer')} معناها «مؤقّت» يعني الوقت، و${E('mouse')} يعني الماوس.`,
      pairs: [
        [['touching', 'Enemy'], '💥 بتشوف هل الكائن لمس كائن تاني'],
        [['keypressed', 'up arrow'], '⌨️ بتشوف هل المفتاح مضغوط دلوقتي'],
        [['timer'], '⏱ بتدّينا الوقت من أول ما اللعبة بدأت'],
        [['mousex'], '🖱 بتدّينا مكان الماوس يمين وشمال']
      ],
      explain: `كتل ${E('Sensing')} بتجمع معلومات عن اللعبة: اللمس، المفاتيح، الوقت، ومكان الماوس.`
    },
    {
      type: 'mcq',
      q: 'عايزين يظهر في اللعبة أعداء كتير من نفس الكائن، بدل ما نرسم عدو جديد كل مرة. أنهي كتلة تساعدنا؟',
      hint: `${E('clone')} معناها «نسخة». إحنا عايزين نعمل نسخ من نفس الكائن.`,
      visual: 'clones',
      options: [
        { script: [['clone']] },
        { script: [['hide']] },
        { script: [['show']] },
        { script: [['backdrop', 'backdrop2']] }
      ],
      answer: 0,
      explain: `${E('create clone of [myself]')} بتعمل نسخ (استنساخ) من الـ ${E('Sprite')}، فبنحصل على أعداء كتير بكود واحد.`
    }
  ]
};
