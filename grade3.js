// 三年级配置：万以内加减 · 时分秒 · 周长 · 分数初步 · 倍
const GRADE = {
  n: 3,
  title: "三年级",
  subtitle: "三年级 · 万以内笔算 → 时分秒 → 周长 → 分数初步 → 倍",
  storeKey: "mathAdv3",
  questCount: 10,
  tasks: [
    "万以内笔算玩5局，列竖式并验算1道。",
    "时分秒玩5局，记住1时=60分、1分=60秒。",
    "算一算数学书封面的周长大约是多少。",
    "分数乐园玩5局，把比较方法讲出来。",
    "倍的认识玩5局，画图表示倍数关系。",
    "来一次闯关10题，看看能得几星。",
    "记录自己从家到学校用了多长时间。",
    "称一称书包大约多重，是几千克。"
  ],
  roadmap: [
    "第1-4周：万以内加减笔算，时分秒，测量",
    "第5-8周：长方形正方形周长，多位数乘一位数",
    "第9-12周：分数初步认识，倍的认识，集合"
  ],
  modules: [
    {
      id: "wanyi", tab: "🧮 万以内笔算", title: "🧮 万以内加减笔算",
      type: "options", retry: "数位对齐，满十进一，不够减向前借 🧮",
      gen(level, last) {
        let a, b, op;
        if (Math.random() < 0.5) { a = H.ri(245, 899); b = H.ri(135, 799); op = "+"; }
        else { a = H.ri(400, 999); b = H.ri(135, 799); if (b >= a) [a, b] = [b + 100, a]; op = "-"; }
        const ans = op === "+" ? a + b : a - b;
        const q = `${a} ${op} ${b} = ?`;
        if (q === last || ans < 0) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - 150), ans + 150) };
      }
    },
    {
      id: "shijian", tab: "⏰ 时间管家", title: "⏰ 时间小管家：时分秒",
      type: "options", retry: "记住：1时=60分，1分=60秒 ⏰", hint: "1时 = 60分，1分 = 60秒",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, unit;
        if (k === 0) { const h = H.ri(1, 5); q = `${h}时 = ? 分`; ans = h * 60; unit = "分"; }
        else if (k === 1) { const m = H.ri(1, 9); q = `${m}分 = ? 秒`; ans = m * 60; unit = "秒"; }
        else if (k === 2) { const h = H.ri(1, 3), m = H.ri(5, 50); q = `${h}时${m}分 = ? 分`; ans = h * 60 + m; unit = "分"; }
        else {
          const s = H.ri(7, 10) * 60 + H.ri(0, 40);
          const dur = H.ri(15, 50);
          const f = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
          q = `${f(s)}出发，${f(s + dur)}到达，经过 ? 分钟`; ans = dur; unit = "分钟";
        }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(1, ans + H.ri(0, 20) - 10));
        return { q, a: ans + unit, opts: H.shuf([...set]).map((v) => v + unit) };
      }
    },
    {
      id: "celiang", tab: "📐 测量换算", title: "📐 测量小达人：长度和质量",
      type: "options", retry: "1千米=1000米，1吨=1000千克，1分米=10厘米",
      hint: "1千米=1000米 · 1吨=1000千克 · 1分米=10厘米",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, unit;
        if (k === 0) { const v = H.ri(1, 9); q = `${v}分米 = ? 厘米`; ans = v * 10; unit = "厘米"; }
        else if (k === 1) { const v = H.ri(1, 9); q = `${v}千米 = ? 米`; ans = v * 1000; unit = "米"; }
        else if (k === 2) { const v = H.ri(1, 9); q = `${v}吨 = ? 千克`; ans = v * 1000; unit = "千克"; }
        else if (k === 3) { const v = H.ri(2, 9); q = `${v}000克 = ? 千克`; ans = v; unit = "千克"; }
        else { const v = H.ri(1, 9), g = H.ri(100, 900); q = `${v}吨${g}千克 = ? 千克`; ans = v * 1000 + g; unit = "千克"; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(1, ans + (H.ri(0, 6) - 3) * (ans > 500 ? 100 : 2)));
        return { q, a: ans + unit, opts: H.shuf([...set]).map((v) => v + unit) };
      }
    },
    {
      id: "zhouchang", tab: "🏗️ 周长建筑师", title: "🏗️ 周长小建筑师",
      type: "pad", padMax: 80, retry: "周长 = 所有边加起来，长方形=(长+宽)×2",
      hint: "长方形周长 = (长+宽)×2，正方形 = 边长×4",
      levels: [{ v: "rect", label: "长方形" }, { v: "sq", label: "正方形" }],
      gen(level) {
        if (level === "sq") { const s = H.ri(3, 15); return { q: `边长${s}厘米的正方形，周长 ? 厘米`, a: s * 4 }; }
        const a = H.ri(3, 15), b = H.ri(2, 12);
        return { q: `长${a}厘米、宽${b}厘米的长方形，周长 ? 厘米`, a: (a + b) * 2 };
      }
    },
    {
      id: "cheng3", tab: "✖️ 口算乘法", title: "✖️ 多位数乘一位数",
      type: "options", retry: "先不看0算，再添上0：12×4想成10×4+2×4",
      gen(level, last) {
        const k = H.r(3);
        let q, ans;
        if (k === 0) { const a = H.ri(11, 49); q = `${a} × 4 = ?`; ans = a * 4; }
        else if (k === 1) { const a = H.ri(10, 90); const b = [2, 3, 5][H.r(3)]; q = `${a * 10} × ${b} = ?`; ans = a * 10 * b; }
        else { const a = H.ri(102, 309); q = `${a} × 3 = ?`; ans = a * 3; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - Math.ceil(ans * 0.2) - 5), ans + Math.ceil(ans * 0.2) + 5) };
      }
    },
    {
      id: "fenshu", tab: "🍰 分数乐园", title: "🍰 分数初步：认读比算",
      type: "options", retry: "平均分！分子小不一定小，分母大每份反而小",
      hint: "一定要平均分；同分母比分子，同分子比分母",
      levels: [{ v: "know", label: "认识比较" }, { v: "calc", label: "简单加减" }],
      gen(level, last) {
        if (level === "calc") {
          const d = H.pick([5, 6, 7, 8, 9]);
          const a = H.ri(1, d - 2), b = H.ri(1, d - a - 1) || 1;
          let q, ans;
          if (Math.random() < 0.5) { q = `${a}/${d} + ${b}/${d} = ?`; ans = `${a + b}/${d}`; }
          else { const x = a + b; q = `${x}/${d} - ${a}/${d} = ?`; ans = `${b}/${d}`; }
          const set = new Set([ans]);
          while (set.size < 4) set.add(`${H.ri(1, d - 1)}/${d}`);
          if (q === last) return this.gen(level, last);
          return { q, a: ans, opts: H.shuf([...set]) };
        }
        const k = H.r(3);
        let q, ans, opts;
        if (k === 0) {
          const d = H.pick([2, 3, 4, 5, 6, 8]);
          q = `把1个西瓜平均分成${d}份，每份是它的 ?`; ans = `1/${d}`;
          opts = [`1/${d}`, `1/${d + 1}`, `${d}/1`, `1/1`];
        } else if (k === 1) {
          const d = H.pick([5, 6, 7, 8, 9]);
          const a = H.ri(1, d - 2); let b = H.ri(1, d - 2);
          if (a === b) b = (b + 2) % (d - 1) + 1;
          q = `${a}/${d} ? ${b}/${d}`; ans = a > b ? "＞" : "＜"; opts = ["＞", "＜", "="];
        } else {
          const n = H.ri(2, 5);
          const d1 = n + 1, d2 = n + 3;
          q = `1/${d1} ? 1/${d2}`; ans = "＞"; opts = ["＞", "＜", "="];
        }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "bei", tab: "🐘 倍的认识", title: "🐘 倍的认识：画图想倍数",
      type: "options", retry: "求倍用除法：大数 ÷ 小数；求几倍数用乘法",
      gen(level, last) {
        const k = H.r(3);
        let q, ans;
        if (k === 0) { const s = H.ri(2, 9), m = H.ri(2, 5); q = `${s * m}是${s}的几倍？`; ans = m; }
        else if (k === 1) { const s = H.ri(2, 9), m = H.ri(2, 5); q = `${s}的${m}倍是 ?`; ans = s * m; }
        else { const r = H.ri(2, 8), m = H.ri(2, 4); q = `红花${r}朵，黄花是红花的${m}倍，黄花 ? 朵`; ans = r * m; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 8), ans + 8) };
      }
    },
    {
      id: "danweilian", tab: "🔗 单位连线", title: "🔗 单位连线：两边相等",
      type: "match", retry: "进率记牢：时分秒60，长度质量1000（米和厘米是100）",
      gen() {
        const pool = [["2时", "120分"], ["3分", "180秒"], ["1千米", "1000米"], ["2吨", "2000千克"], ["5分米", "50厘米"], ["4厘米", "40毫米"], ["1时30分", "90分"]];
        return { q: "左边点一个，右边点和它相等的", pairs: H.shuf(pool).slice(0, 5) };
      }
    },
    {
      id: "paixu3", tab: "🔢 三位数排队", title: "🔢 三位数排排队",
      type: "order", retry: "先比百位，百位相同再比十位",
      gen() {
        const set = new Set();
        while (set.size < 4) set.add(H.ri(100, 999));
        const dir = Math.random() < 0.5 ? "asc" : "desc";
        return { q: dir === "asc" ? "从小到大依次点 👆" : "从大到小依次点 👆", cards: [...set].map((v) => ({ t: String(v), v })), dir };
      }
    }
  ],
  makers: [
    () => { const a = H.ri(245, 899), b = H.ri(135, 799); return { q: `${a} + ${b} = ?`, a: a + b, opts: H.salt([a + b], a + b - 150, a + b + 150) }; },
    () => { const m = H.ri(1, 5); return { q: `${m}时 = ? 分`, a: m * 60 + "分", opts: H.salt([m * 60], m * 60 - 20, m * 60 + 20).map((v) => v + "分") }; },
    () => { const a = H.ri(11, 49); return { q: `${a} × 4 = ?`, a: a * 4, opts: H.salt([a * 4], a * 4 - 20, a * 4 + 20) }; },
    () => { const d = H.pick([5, 6, 7, 8]); const a = H.ri(1, d - 2); let b = H.ri(1, d - 2); if (a === b) b = b % (d - 1) + 1; return { q: `${a}/${d} ? ${b}/${d}`, a: a > b ? "＞" : "＜", opts: ["＞", "＜", "="] }; },
    () => { const s = H.ri(3, 12); return { q: `边长${s}的正方形周长 ?`, a: s * 4, opts: H.salt([s * 4], s * 4 - 8, s * 4 + 8) }; },
    () => { const s = H.ri(2, 9), m = H.ri(2, 5); return { q: `${s * m}是${s}的几倍？`, a: m, opts: H.salt([m], 1, 12) }; }
  ],
  formulas: [
    { title: "⏰ 时间", items: [
      { name: "时分秒", expr: "1时＝60分，1分＝60秒" }
    ] },
    { title: "📐 长度与质量", items: [
      { name: "长度", expr: "1米＝10分米＝100厘米＝1000毫米" },
      { name: "千米", expr: "1千米＝1000米" },
      { name: "质量", expr: "1吨＝1000千克，1千克＝1000克" }
    ] },
    { title: "🏗️ 周长", items: [
      { name: "长方形", expr: "周长＝(长＋宽)×2" },
      { name: "正方形", expr: "周长＝边长×4" }
    ] },
    { title: "🍰 分数", items: [
      { name: "同分母加减", expr: "分母不变，分子相加减" },
      { name: "比较", expr: "分母相同比分子；分子相同，分母小的反而大", note: "一定要先平均分" }
    ] },
    { title: "🐘 倍", items: [
      { name: "求倍数", expr: "求一个数是另一个数的几倍，用除法" },
      { name: "求几倍数", expr: "求一个数的几倍是多少，用乘法" }
    ] }
  ]
};
