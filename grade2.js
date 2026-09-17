// 二年级配置：100以内笔算 · 口诀 · 长度 · 万以内数
const GRADE = {
  n: 2,
  title: "二年级",
  subtitle: "二年级 · 笔算进退位 → 乘法口诀 → 除法 → 万以内数",
  storeKey: "mathAdv2",
  questCount: 10,
  tasks: [
    "笔算小火车玩5局，列竖式说清进位/退位。",
    "背2句口诀并各编1道乘法1道除法。",
    "混合运算玩5局，说出先算什么。",
    "拿尺子量3样东西，读出几厘米。",
    "去长度小工匠玩5局，记住1米=100厘米。",
    "来一次闯关10题，看看能得几星。",
    "数一数家里有几个直角。",
    "和家长玩报数：5个5个数到100。"
  ],
  roadmap: [
    "第1-4周：100以内笔算加减，统一长度单位",
    "第5-8周：表内乘法口诀，角和观察物体",
    "第9-12周：表内除法，混合运算，万以内数"
  ],
  modules: [
    {
      id: "bishu", tab: "🚂 笔算小火车", title: "🚂 笔算小火车：100以内加减",
      type: "options", retry: "列竖式：个位对个位，再算一遍 🧮",
      levels: [{ v: "easy", label: "不进位" }, { v: "hard", label: "进位退位" }],
      gen(level, last) {
        let a, b, op;
        if (level === "hard") {
          if (Math.random() < 0.5) { a = H.ri(15, 89); b = H.ri(15, 89); if ((a % 10) + (b % 10) < 10) b += 10 - ((a % 10) + (b % 10)) + H.ri(0, 3); if (a + b > 100) { a = H.ri(25, 60); b = H.ri(25, 60); } op = "+"; }
          else { a = H.ri(30, 99); b = H.ri(15, 89); if (b >= a) [a, b] = [b + 10, a]; if ((a % 10) >= (b % 10)) a -= ((a % 10) - (b % 10)) + H.ri(1, 3); op = "-"; }
        } else {
          a = H.ri(11, 89); b = H.ri(11, 29); op = Math.random() < 0.5 ? "+" : "-";
          if (op === "+" && (a % 10) + (b % 10) >= 10) b = (b % 10 < 3) ? b : b - (b % 10);
          if (op === "-" && (b > a || (a % 10) < (b % 10))) [a, b] = [Math.max(a, b) + 10, Math.min(a, b)];
        }
        const ans = op === "+" ? a + b : a - b;
        const q = `${a} ${op} ${b} = ?`;
        if (q === last || ans < 0 || ans > 100) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - 12), ans + 12) };
      }
    },
    {
      id: "chengfa", tab: "✖️ 口诀王", title: "✖️ 乘法口诀王",
      type: "options", retry: "背一背口诀再来 🔔",
      levels: [{ v: "ji", label: "口诀求积" }, { v: "shang", label: "口诀求商" }],
      gen(level, last) {
        const a = H.ri(2, 9), b = H.ri(2, 9);
        let q, ans, lo, hi;
        if (level === "shang") { q = `${a * b} ÷ ${a} = ?`; ans = b; lo = 1; hi = 9; }
        else { q = `${a} × ${b} = ?`; ans = a * b; lo = Math.max(1, ans - 12); hi = ans + 12; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], lo, hi) };
      }
    },
    {
      id: "hunhe", tab: "🔀 混合运算", title: "🔀 混合运算：先算什么？",
      type: "options", retry: "想想运算顺序：先乘除后加减，有括号先算括号",
      hint: "先乘除后加减，有括号先算括号",
      gen(level, last) {
        const k = H.r(4);
        let q, ans;
        if (k === 0) { const a = H.ri(2, 9), b = H.ri(2, 9), c = H.ri(2, 20); q = `${a} × ${b} + ${c} = ?`; ans = a * b + c; }
        else if (k === 1) { const a = H.ri(2, 9), b = H.ri(2, 9), c = H.ri(10, 60); q = `${c} - ${a} × ${b} = ?`; ans = c - a * b; }
        else if (k === 2) { const a = H.ri(2, 9), b = H.ri(1, 9), c = H.ri(2, 20); q = `${a * b} ÷ ${a} + ${c} = ?`; ans = b + c; }
        else { const a = H.ri(2, 9), b = H.ri(2, 9), c = H.ri(1, 9); q = `${c} × (${a} + ${b}) = ?`; ans = c * (a + b); }
        if (q === last || ans < 0) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - 10), ans + 10) };
      }
    },
    {
      id: "changdu", tab: "📏 长度工匠", title: "📏 长度小工匠：米和厘米",
      type: "options", retry: "记住：1米 = 100厘米 📏", hint: "1米 = 100厘米",
      gen(level, last) {
        const k = H.r(4);
        let q, ans;
        if (k === 0) { const m = H.ri(1, 9); q = `${m}米 = ? 厘米`; ans = m * 100; return { q, a: ans + "厘米", opts: H.salt([ans], ans - 30, ans + 30).map((v) => v + "厘米") }; }
        if (k === 1) { const m = H.ri(1, 5), c = H.ri(1, 90); q = `${m}米${c}厘米 = ? 厘米`; ans = m * 100 + c; return { q, a: ans + "厘米", opts: H.salt([ans], ans - 20, ans + 20).map((v) => v + "厘米") }; }
        if (k === 2) { const c = H.ri(120, 190); q = `${c}厘米 ? 1米60厘米`; ans = c > 160 ? "＞" : c < 160 ? "＜" : "="; return { q, a: ans, opts: ["＞", "＜", "="] }; }
        const items = [["教室门高约", "2米", ["2米", "20米", "2厘米"]], ["铅笔长约", "15厘米", ["15厘米", "15米", "1厘米"]], ["课桌高约", "70厘米", ["70厘米", "7米", "7厘米"]]];
        const it = H.pick(items);
        q = `${it[0]} ?`; ans = it[1];
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(it[2]) };
      }
    },
    {
      id: "tuxing", tab: "📐 图形侦探", title: "📐 图形小侦探：角和对称",
      type: "options", retry: "画一画、折一折再看 🔍",
      gen(level, last) {
        const k = H.r(5);
        let d, q, a, opts;
        if (k === 0) { d = "▱"; q = "这个图形叫什么？"; a = "平行四边形"; opts = ["平行四边形", "长方形", "三角形", "梯形"]; }
        else if (k === 1) { d = "📐"; q = "三角尺上有几个直角？"; a = 1; opts = [1, 2, 3, 0]; }
        else if (k === 2) { d = "🟧"; q = "正方形有几条对称轴？"; a = 4; opts = [4, 2, 1, 3]; }
        else if (k === 3) { d = "⭕"; q = "圆形有几条对称轴？"; a = "无数条"; opts = ["无数条", "2条", "4条", "1条"]; }
        else { d = "🔺"; q = "三角形有几个角？"; a = 3; opts = [3, 2, 4, 6]; }
        if (q === last) return this.gen(level, last);
        return { display: d, q, a, opts: H.shuf(opts) };
      }
    },
    {
      id: "wan", tab: "🔢 万以内数", title: "🔢 万以内数：读写比算",
      type: "options", retry: "数位对齐，从高位想起 🔢",
      levels: [{ v: "read", label: "读写组成" }, { v: "calc", label: "整百整千算" }],
      gen(level, last) {
        let q, ans;
        if (level === "calc") {
          if (Math.random() < 0.5) { const a = 100 * H.ri(1, 9), b = 100 * H.ri(1, 9); q = `${a} + ${b} = ?`; ans = a + b; }
          else { const a = 100 * H.ri(3, 15), b = 100 * H.ri(1, 9); if (b >= a) return this.gen(level, last); q = `${a} - ${b} = ?`; ans = a - b; }
          return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - 400), ans + 400) };
        }
        const k = H.r(3);
        const cn = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        if (k === 0) { // 写作
          const th = H.ri(1, 9), hu = H.r(10), te = H.r(10), on = H.r(10);
          const v = th * 1000 + hu * 100 + te * 10 + on;
          q = `${cn[th]}千${hu === 0 ? "零" : cn[hu] + "百"}${te === 0 ? (on === 0 ? "" : "零") : cn[te] + "十"}${on === 0 ? "" : cn[on]} 写作 ?`;
          ans = v;
        } else if (k === 1) {
          const th = H.ri(1, 9), te = H.ri(1, 9);
          q = `${th}个千和${te}个十组成的数是 ?`; ans = th * 1000 + te * 10;
        } else {
          const a = H.ri(1000, 9999); let b = H.ri(1000, 9999);
          if (a === b) b = (b + 1111) % 9000 + 1000;
          q = `${a} ? ${b}`; ans = a > b ? "＞" : "＜";
          return { q, a: ans, opts: ["＞", "＜", "="] };
        }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(0, ans - 500), ans + 500) };
      }
    }
  ],
  makers: [
    () => { const a = H.ri(2, 9), b = H.ri(2, 9); return { q: `${a} × ${b} = ?`, a: a * b, opts: H.salt([a * b], 1, 81) }; },
    () => { const a = H.ri(2, 9), b = H.ri(2, 9); return { q: `${a * b} ÷ ${a} = ?`, a: b, opts: H.salt([b], 1, 9) }; },
    () => { const a = H.ri(20, 80), b = H.ri(11, 49); return { q: `${a} + ${b} = ?`, a: a + b, opts: H.salt([a + b], a + b - 12, a + b + 12) }; },
    () => { const m = H.ri(1, 9); return { q: `${m}米 = ? 厘米`, a: m * 100 + "厘米", opts: H.salt([m * 100], m * 100 - 30, m * 100 + 30).map((v) => v + "厘米") }; },
    () => { const a = H.ri(2, 9), b = H.ri(2, 9), c = H.ri(2, 15); return { q: `${a} × ${b} + ${c} = ?`, a: a * b + c, opts: H.salt([a * b + c], a * b + c - 10, a * b + c + 10) }; },
    () => { const a = 100 * H.ri(1, 9), b = 100 * H.ri(1, 9); return { q: `${a} + ${b} = ?`, a: a + b, opts: H.salt([a + b], a + b - 400, a + b + 400) }; }
  ]
};
