// 六年级配置：分数乘除 · 比与比例 · 百分数 · 圆 · 圆柱圆锥 · 负数
const GRADE = {
  n: 6,
  title: "六年级",
  subtitle: "六年级 · 分数乘除 → 比与比例 → 百分数 → 圆 → 圆柱圆锥",
  storeKey: "mathAdv6",
  questCount: 10,
  tasks: [
    "分数乘除玩5局，说出先约分再计算。",
    "比与比例玩5局，把比例尺的意义讲出来。",
    "百分数玩5局，算一次打折后的价格。",
    "画一个半径3厘米的圆，算它的周长和面积。",
    "圆柱圆锥玩5局，记住等底等高差3倍。",
    "来一次闯关10题，看看能得几星。",
    "看懂家里电费单、水费单上的数字和百分号。",
    "记录一周气温，标出零上零下。"
  ],
  roadmap: [
    "第1-4周：分数乘除法，倒数，位置与方向",
    "第5-8周：比和比例，百分数，扇形统计图",
    "第9-12周：圆的周长面积，圆柱圆锥，负数，总复习"
  ],
  modules: [
    {
      id: "fenshu6", tab: "🍰 分数乘除", title: "🍰 分数乘法和除法",
      type: "options", retry: "乘法：分子乘分子，分母乘分母，能约先约；除法：除以一个数=乘它的倒数",
      levels: [{ v: "cheng", label: "分数乘法" }, { v: "chu", label: "分数除法" }],
      gen(level, last) {
        const mults = [["3/4", 8, 6], ["2/5", 15, 6], ["5/6", 12, 10], ["7/10", 5, "7/2"], ["4/9", 27, 12]];
        const divs = [["5/6", 5, "1/6"], ["7/9", "7/18", 2], ["3/4", "3/8", 2], ["8/15", "4/5", "2/3"], ["1/2", "1/3", "3/2"]];
        const c = H.pick(level === "chu" ? divs : mults);
        const q = level === "chu" ? `${c[0]} ÷ ${c[1]} = ?` : `${c[0]} × ${c[1]} = ?`;
        if (q === last) return this.gen(level, last);
        const ans = c[2];
        const pool = typeof ans === "number"
          ? H.salt([ans], Math.max(1, ans - 4), ans + 4)
          : H.shuf([String(ans), "1/2", "2/3", "3/4", "1/3", "5/6"].filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4);
        if (!pool.map(String).includes(String(ans))) pool[0] = ans;
        return { q, a: ans, opts: pool };
      }
    },
    {
      id: "bi", tab: "⚖️ 比与比例", title: "⚖️ 比、比例和比例尺",
      type: "options", retry: "比的前项后项同时乘除相同的数，比值不变；比例尺=图上÷实际",
      hint: "比例尺 = 图上距离 ÷ 实际距离",
      gen(level, last) {
        const k = H.r(4);
        let q, ans;
        if (k === 0) { const p = H.pick([[12, 18, "2:3"], [10, 25, "2:5"], [21, 28, "3:4"], [16, 24, "2:3"]]); q = `${p[0]}:${p[1]} 化简后是 ?`; ans = p[2]; return { q, a: ans, opts: H.shuf([p[2], "1:2", "3:5", "4:5"]) }; }
        if (k === 1) { const a = H.ri(2, 5), b = a + H.ri(1, 3), m = H.ri(2, 4); q = `${a}:${b} = ${a * m}:?`; ans = b * m; }
        else if (k === 2) { const x = H.ri(4, 20), a = H.ri(2, 6), b = H.ri(2, 6); q = `解比例 x:${a * 2} = ${x}:${a}，x = ?`; ans = x * 2; void b; }
        else { const cm = H.ri(2, 9); q = `比例尺1:100000，图上${cm}厘米，实际 ? 千米`; ans = cm; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 8), ans + 8) };
      }
    },
    {
      id: "baifenshu", tab: "💯 百分数", title: "💯 百分数：折扣与百分率",
      type: "options", retry: "百分号去掉小数点右移两位；打几折就是按原价的百分之几十卖",
      hint: "几折 = 十分之几 = 百分之几十",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, unit;
        if (k === 0) { const v = H.pick([0.35, 0.7, 0.08, 1.2, 0.25]); q = `${v} = ?%`; ans = Math.round(v * 100); unit = "%"; }
        else if (k === 1) { const p = H.pick([["3/4", 75], ["2/5", 40], ["1/8", 12.5], ["7/10", 70]]); q = `${p[0]} = ?%`; ans = p[1]; unit = "%"; }
        else if (k === 2) { const t = H.pick([50, 40, 200, 80]), p = H.pick([10, 20, 25, 50]); q = `${t}人中有${(t * p) / 100}人优秀，优秀率 ?%`; ans = p; unit = "%"; }
        else if (k === 3) { const d = H.pick([8, 7, 9, 5]); q = `打${["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"][d]}折是 ?%`; ans = d * 10; unit = "%"; }
        else { const o = H.pick([100, 200, 50, 120]), d = H.pick([8, 7, 9]); q = `原价${o}元打${d}折，现价 ? 元`; ans = (o * d) / 10; unit = "元"; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(0.5, ans + (H.ri(0, 6) - 3) * (ans > 50 ? 5 : 2)));
        return { q, a: ans + unit, opts: H.shuf([...set]).map((v) => v + unit) };
      }
    },
    {
      id: "yuan", tab: "⭕ 圆", title: "⭕ 圆的周长和面积（π取3.14）",
      type: "options", retry: "周长=2πr=πd；面积=πr²，r²是r×r不是r×2",
      hint: "C = 2πr = πd · S = πr²（π取3.14）",
      gen(level, last) {
        const r = H.pick([1, 2, 3, 5, 10]);
        let q, ans;
        if (Math.random() < 0.5) { q = `半径${r}厘米的圆，周长 ? 厘米`; ans = Math.round(2 * 3.14 * r * 100) / 100; }
        else { q = `半径${r}厘米的圆，面积 ? 平方厘米`; ans = Math.round(3.14 * r * r * 100) / 100; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        const step = ans > 50 ? 6.28 : 3.14;
        let g = 0;
        while (set.size < 4 && g++ < 40) set.add(Math.round((ans + (H.ri(0, 6) - 3) * step) * 100) / 100);
        set.delete(0); set.delete(-3.14); set.delete(-6.28);
        while (set.size < 4) set.add(Math.round((ans + (set.size + 2) * 3.14) * 100) / 100);
        return { q, a: ans, opts: H.shuf([...set]).slice(0, 4) };
      }
    },
    {
      id: "yuanzhu", tab: "🛢️ 圆柱圆锥", title: "🛢️ 圆柱和圆锥的体积",
      type: "options", retry: "圆柱=底面积×高；等底等高时圆锥是圆柱的三分之一",
      hint: "V圆柱 = Sh · V圆锥 = Sh÷3（等底等高差3倍）",
      gen(level, last) {
        const k = H.r(3);
        let q, ans;
        if (k === 0) { const r = H.pick([1, 2, 3]), h = H.pick([2, 4, 5]); q = `底面半径${r}、高${h}的圆柱，体积 ?（π取3.14）`; ans = Math.round(3.14 * r * r * h * 100) / 100; }
        else if (k === 1) { const v = H.pick([12, 24, 36, 48]); q = `等底等高的圆柱体积是${v}，圆锥体积是 ?`; ans = v / 3; }
        else { const v = H.pick([6, 9, 12, 15]); q = `圆锥体积是${v}，等底等高的圆柱体积是 ?`; ans = v * 3; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        let g = 0;
        while (set.size < 4 && g++ < 40) set.add(Math.round((ans + (H.ri(0, 6) - 3) * (ans > 40 ? 6.28 : 3)) * 100) / 100);
        while (set.size < 4) set.add(ans + set.size * 3 + 1);
        return { q, a: ans, opts: H.shuf([...set]).slice(0, 4) };
      }
    },
    {
      id: "fushu", tab: "🌡️ 负数", title: "🌡️ 负数的认识",
      type: "options", retry: "0既不是正数也不是负数；负数越接近0越大",
      hint: "0既不是正数也不是负数 · 负号后面的数越大，这个负数越小",
      gen(level, last) {
        const k = H.r(3);
        let q, ans, opts;
        if (k === 0) { const t = H.ri(2, 15); q = `零下${t}℃记作 ?`; ans = `-${t}℃`; opts = [`-${t}℃`, `+${t}℃`, `${t}℃`, `0℃`]; }
        else if (k === 1) { const a = H.ri(2, 9), b = a + H.ri(1, 5); q = `-${b} ? -${a}`; ans = "＜"; opts = ["＞", "＜", "="]; }
        else { const t = H.ri(1, 8); q = `-${t} ℃ 与 0℃ 相比，?`; ans = `-${t}℃更低`; opts = [`-${t}℃更低`, `0℃更低`, "一样高", "无法比较"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "baifenlian", tab: "🔗 分百连线", title: "🔗 分数百分数连线",
      type: "match", retry: "分母是100的分数就是百分之几",
      gen() {
        const pool = [["3/4", "75%"], ["1/2", "50%"], ["1/4", "25%"], ["4/5", "80%"], ["1/5", "20%"], ["7/10", "70%"], ["1/8", "12.5%"]];
        return { q: "左边点分数，右边点和它相等的百分数", pairs: H.shuf(pool).slice(0, 5) };
      }
    },
    {
      id: "paixu6", tab: "🔢 数轴排队", title: "🔢 数轴排排队（含负数）",
      type: "order", retry: "数轴上越往右越大；负数离0越远越小",
      hint: "数轴越往右越大 · 负号后面越大，这个数越小",
      gen() {
        const set = new Set();
        while (set.size < 4) set.add(H.pick([-5, -2.5, -0.5, 0, 2.5, 4, -3, 1.5]));
        const dir = Math.random() < 0.5 ? "asc" : "desc";
        return { q: dir === "asc" ? "从小到大依次点 👆" : "从大到小依次点 👆", cards: [...set].map((v) => ({ t: String(v), v })), dir };
      }
    },
    {
      id: "xsczhenti", tab: "📜 小升初真题", title: "📜 小升初真题精选",
      type: "bank",
      bank: [
        { q: "[240-(0.125×76+12.5%×24)×8]÷14 = ?", a: "10", opts: ["10", "12", "14", "100"], src: "2009年小升初数学卷·填空（北京小升初网刊载）", tip: "12.5%=0.125，先提公因数：0.125×(76+24)=12.5，再算240-100=140" },
        { q: "一个数除以9余8，除以6余5，加1能被5整除，最小的这个数是？", a: "89", opts: ["89", "90", "179", "44"], src: "2009年小升初数学卷·填空", tip: "余数都比除数小1，加1后是9、6、5的公倍数，最小90，所以这个数是89" },
        { q: "印一本书页码共用975个数码，这本书有几页？", a: "361", opts: ["361", "325", "400", "975"], src: "2009年小升初数学卷·填空", tip: "1-9页用9个，10-99页用180个，还剩786个÷3=262页，从100页起共262页" },
        { q: "妈妈比小明大26岁，去年妈妈年龄是小明的3倍，小明今年几岁？", a: "14", opts: ["14", "13", "12", "15"], src: "2009年小升初数学卷·应用题", tip: "年龄差26不变，去年小明26÷(3-1)=13岁，今年14岁" },
        { q: "甲14元/千克4千克，乙10元3千克，丙8元5千克混合，买2千克混合糖要几元？", a: "21", opts: ["21", "20", "22", "10.5"], src: "2009年小升初数学卷·应用题", tip: "平均价(56+30+40)÷12=10.5元，2千克就是21元" },
        { q: "甲10小时、乙12小时、丙15小时独做完工，三人合作6小时完成，甲中途撤出，甲做了几小时？", a: "1小时", opts: ["1小时", "2小时", "3小时", "6小时"], src: "2009年小升初数学卷·应用题", tip: "乙丙6小时做6/12+6/15=0.9，剩下0.1是甲做的，甲效率1/10，所以1小时" }
      ]
    }
  ],
  makers: [
    () => ({ q: "3/4 × 8 = ?", a: 6, opts: H.salt([6], 2, 12) }),
    () => { const a = H.ri(2, 5), b = a + H.ri(1, 3), m = H.ri(2, 4); return { q: `${a}:${b} = ${a * m}:?`, a: b * m, opts: H.salt([b * m], 2, 30) }; },
    () => { const o = H.pick([100, 200, 50]); const d = H.pick([8, 7, 9]); return { q: `${o}元打${d}折 ? 元`, a: (o * d) / 10 + "元", opts: H.salt([(o * d) / 10], 10, 200).map((v) => v + "元") }; },
    () => {
      const r = H.pick([2, 3, 5]);
      const ans = Math.round(3.14 * r * r * 100) / 100;
      const set = new Set([ans]);
      [3.14, -3.14, 6.28, -6.28, 9.42, 12.56].forEach((d) => set.add(Math.round((ans + d) * 100) / 100));
      set.delete(0);
      let g = 0;
      while (set.size < 4 && g++ < 20) set.add(Math.round((ans + 20 + g * 3.14) * 100) / 100);
      return { q: `半径${r}的圆面积 ?`, a: ans, opts: [...set].slice(0, 4) };
    },
    () => { const v = H.pick([12, 24, 36]); return { q: `等底等高圆柱${v}，圆锥 ?`, a: v / 3, opts: H.salt([v / 3], 2, 20) }; },
    () => { const a = H.ri(2, 9), b = a + H.ri(1, 5); return { q: `-${b} ? -${a}`, a: "＜", opts: ["＞", "＜", "="] }; }
  ],
  formulas: [
    { title: "🍰 分数乘除", items: [
      { name: "分数乘法", expr: "分子乘分子，分母乘分母，能约先约" },
      { name: "分数除法", expr: "除以一个数＝乘它的倒数" }
    ] },
    { title: "⚖️ 比与比例", items: [
      { name: "比值", expr: "比值＝前项÷后项" },
      { name: "比的基本性质", expr: "前项后项同时乘除相同的数（0除外），比值不变" },
      { name: "比例", expr: "内项积＝外项积" },
      { name: "比例尺", expr: "比例尺＝图上距离÷实际距离" }
    ] },
    { title: "💯 百分数", items: [
      { name: "折扣", expr: "几折＝百分之几十，如八折＝80%" },
      { name: "百分率", expr: "百分率＝部分÷总数×100%" }
    ] },
    { title: "⭕ 圆", items: [
      { name: "周长", expr: "C＝2πr＝πd", note: "π取3.14" },
      { name: "面积", expr: "S＝πr²", note: "r²是r×r，不是r×2" }
    ] },
    { title: "🛢️ 圆柱圆锥", items: [
      { name: "圆柱体积", expr: "V＝底面积×高" },
      { name: "圆锥体积", expr: "V＝底面积×高÷3", note: "等底等高时，圆锥是圆柱的三分之一" }
    ] },
    { title: "🌡️ 负数", items: [
      { name: "0", expr: "0既不是正数也不是负数" },
      { name: "比大小", expr: "数轴越往右越大；负号后面越大，这个数越小" }
    ] }
  ]
};
