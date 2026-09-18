// 四年级配置：大数 · 笔算乘除 · 运算定律 · 角 · 小数 · 平均数
const GRADE = {
  n: 4,
  title: "四年级",
  subtitle: "四年级 · 大数的认识 → 笔算乘除 → 运算定律 → 小数 → 平均数",
  storeKey: "mathAdv4",
  questCount: 10,
  tasks: [
    "大数读写玩5局，大声读出每个零的位置。",
    "笔算乘除玩5局，说出试商过程。",
    "运算定律玩5局，指出用了哪条定律。",
    "用量角器画一个60°和一个120°的角。",
    "小数乐园玩5局，0.5和0.05比出大小。",
    "来一次闯关10题，看看能得几星。",
    "算一算全家人的平均年龄。",
    "找一找生活中的平行四边形和梯形。"
  ],
  roadmap: [
    "第1-4周：亿以内数的读写改写，大数比较",
    "第5-8周：三位数乘两位数，除数是两位数除法，角的度量",
    "第9-12周：运算定律简便计算，三角形，小数，平均数"
  ],
  modules: [
    {
      id: "dashu", tab: "🔢 大数认识", title: "🔢 大数的认识：读写改写",
      type: "options", retry: "分级读：4位一级，万级读完加个万字",
      hint: "4位一级；整万整亿末尾的0不读，中间连续0只读一个",
      gen(level, last) {
        const k = H.r(4);
        let q, ans;
        if (k === 0) { // 写作
          const w = H.ri(10, 99), g = H.ri(100, 999);
          q = `${w}万${g} 写作 ?`; ans = w * 10000 + g;
        } else if (k === 1) { // 位值
          const v = H.ri(2, 9) * 100000 + H.ri(1000, 9999);
          q = `${v} 中，十万位上的数字表示 ?`; ans = Math.floor(v / 100000) * 100000;
        } else if (k === 2) { // 改写
          const v = H.ri(25, 880) * 10000;
          q = `${v} = ? 万`; ans = v / 10000;
        } else { // 近似
          const v = H.ri(15000, 94000);
          q = `${v} ≈ ? 万（四舍五入）`; ans = Math.round(v / 10000);
        }
        if (q === last) return this.gen(level, last);
        const unit = q.includes("? 万") ? "万" : "";
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(0, ans + (H.ri(0, 6) - 3) * (ans > 1000 ? 1000 : 1)));
        return { q, a: ans + unit, opts: H.shuf([...set]).map((v) => v + unit) };
      }
    },
    {
      id: "chengchu", tab: "✖️ 笔算乘除", title: "✖️ 笔算：三位数乘除",
      type: "options", retry: "乘法：先分后合；除法：试商调商，别忘余数",
      levels: [{ v: "cheng", label: "三位数×两位" }, { v: "chu", label: "除数是两位" }],
      gen(level, last) {
        let q, ans;
        if (level === "chu") {
          const d = H.pick([12, 14, 15, 21, 23, 32, 41, 42]);
          const s = H.ri(3, 22), r = H.r(Math.min(8, d));
          q = `${d * s + r} ÷ ${d} = ?`; ans = s;
          if (q === last) return this.gen(level, last);
          return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 4), ans + 4) };
        }
        const a = H.ri(102, 486), b = H.ri(12, 48);
        q = `${a} × ${b} = ?`; ans = a * b;
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], ans - 600, ans + 600) };
      }
    },
    {
      id: "dinglv", tab: "⚖️ 运算定律", title: "⚖️ 运算定律：巧算达人",
      type: "options", retry: "交换律换位置，结合律加括号，分配律分开乘",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { q = "25 × 17 × 4 = 17 × (25 × 4)，用了 ?"; ans = "交换律和结合律"; opts = ["交换律和结合律", "只用交换律", "只用结合律", "分配律"]; }
        else if (k === 1) { q = "99 × 36 + 36 = ? × 36"; ans = 100; opts = [100, 99, 36, 98]; }
        else if (k === 2) { const t = H.pick([125, 25]); const x = t === 125 ? 8 : 4; const y = H.ri(3, 9); q = `${t} × ${x} × ${y} = ?`; ans = t * x * y; opts = H.salt([ans], ans - 200, ans + 200); }
        else { const a = H.ri(11, 29); q = `${a} × 101 = ${a} × 100 + ${a} × ?`; ans = 1; opts = [1, 100, 101, 10]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "jiao4", tab: "📐 角与三角形", title: "📐 角的度量与三角形",
      type: "options", retry: "直角90°，平角180°，周角360°；三角形内角和180°",
      hint: "直角90° · 平角180° · 周角360° · 三角形内角和180°",
      gen(level, last) {
        const k = H.r(5);
        let q, ans;
        if (k === 0) { q = "3时整，时针分针夹角是 ?°"; ans = 90; }
        else if (k === 1) { q = "6时整，时针分针夹角是 ?°"; ans = 180; }
        else if (k === 2) { const a = H.pick([40, 50, 60, 70]), b = H.pick([50, 60, 70, 80]); if (a + b >= 170) return this.gen(level, last); q = `三角形两个角是${a}°和${b}°，第三个角 ?°`; ans = 180 - a - b; }
        else if (k === 3) { const t = H.pick([40, 50, 60, 100]); q = `等腰三角形顶角${t}°，底角 ?°`; ans = (180 - t) / 2; }
        else { q = "等边三角形每个角是 ?°"; ans = 60; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(5, ans + (H.ri(0, 6) - 3) * 10));
        return { q, a: ans + "°", opts: H.shuf([...set]).map((v) => v + "°") };
      }
    },
    {
      id: "xiaoshu", tab: "💧 小数乐园", title: "💧 小数的认识与加减",
      type: "options", retry: "小数比大小先比整数部分；加减要小数点对齐",
      levels: [{ v: "know", label: "认识比大小" }, { v: "calc", label: "小数加减" }],
      gen(level, last) {
        if (level === "calc") {
          const a = H.ri(1, 90) / 10, b = H.ri(1, 90) / 10;
          let q, ans;
          if (Math.random() < 0.5) { q = `${a} + ${b} = ?`; ans = Math.round((a + b) * 10) / 10; }
          else { const x = Math.max(a, b), y = Math.min(a, b); q = `${x} - ${y} = ?`; ans = Math.round((x - y) * 10) / 10; }
          if (q === last) return this.gen(level, last);
          const t = Math.round(ans * 10);
          return { q, a: ans, opts: H.salt([t], t - 12, t + 12).map((v) => Math.round(v) / 10) };
        }
        const k = H.r(3);
        let q, ans, opts;
        if (k === 0) { const a = [0.5, 0.05, 0.3, 0.7][H.r(4)]; const b = a === 0.5 ? 0.05 : 0.5; q = `${a} ? ${b}`; ans = a > b ? "＞" : "＜"; opts = ["＞", "＜", "="]; }
        else if (k === 1) { const n = H.ri(3, 48); q = `0.${n < 10 ? "0" + n : n} 由 ? 个0.01组成`; ans = n; opts = H.salt([n], Math.max(1, n - 8), n + 8); }
        else { const v = H.pick([["0.6", "3/5"], ["0.25", "1/4"], ["0.5", "1/2"]]); q = `${v[0]} = ?`; ans = v[1]; opts = [v[1], "1/3", "2/5", "3/4"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "pingjun", tab: "📊 平均数", title: "📊 平均数：移多补少",
      type: "options", retry: "平均数 = 总数 ÷ 份数",
      hint: "平均数 = 总数 ÷ 份数",
      gen(level, last) {
        const n = H.ri(3, 4);
        const avg = H.ri(8, 30);
        const arr = Array.from({ length: n }, () => avg + H.ri(0, 6) - 3);
        const sum = arr.reduce((s, v) => s + v, 0);
        const real = sum / n;
        if (!Number.isInteger(real)) return this.gen(level, last);
        const q = `${arr.join("、")}，平均数是 ?`;
        if (q === last) return this.gen(level, last);
        return { q, a: real, opts: H.salt([real], Math.max(1, real - 5), real + 5) };
      }
    },
    {
      id: "dinglvlian", tab: "🔗 定律连线", title: "🔗 定律连线：算式找方法",
      type: "match", retry: "交换律换位置，结合律加括号，分配律分开乘",
      gen() {
        const pool = [
          ["25×17×4=17×(25×4)", "交换律和结合律"],
          ["99×36+36=100×36", "分配律·凑整"],
          ["125×8×7", "先算125×8=1000"],
          ["36×101", "36×100+36"],
          ["a+b=b+a", "加法交换律"]
        ];
        return { q: "左边点算式，右边点它用的方法", pairs: H.shuf(pool).slice(0, 4) };
      }
    },
    {
      id: "paixu4", tab: "🔢 小数排队", title: "🔢 小数排排队",
      type: "order", retry: "先比整数部分，再一位一位往下比",
      gen() {
        const pool = [0.5, 0.05, 0.3, 1.2, 2.05, 0.9];
        const picks = H.shuf(pool).slice(0, 4);
        const dir = Math.random() < 0.5 ? "asc" : "desc";
        return { q: dir === "asc" ? "从小到大依次点 👆" : "从大到小依次点 👆", cards: picks.map((v) => ({ t: String(v), v })), dir };
      }
    }
  ],
  makers: [
    () => { const a = H.ri(102, 486), b = H.ri(12, 48); return { q: `${a} × ${b} = ?`, a: a * b, opts: H.salt([a * b], a * b - 600, a * b + 600) }; },
    () => { const v = H.ri(25, 880); return { q: `${v * 10000} = ? 万`, a: v + "万", opts: H.salt([v], v - 8, v + 8).map((x) => x + "万") }; },
    () => { const a = H.ri(1, 90) / 10, b = H.ri(1, 90) / 10; const s = Math.round((a + b) * 10) / 10; const t = Math.round(s * 10); return { q: `${a} + ${b} = ?`, a: s, opts: H.salt([t], t - 12, t + 12).map((v) => v / 10) }; },
    () => { const a = H.pick([40, 50, 60, 70]), b = H.pick([50, 60, 70, 80]); if (a + b >= 170) return { q: "等边三角形每个角 ?°", a: "60°", opts: ["60°", "90°", "45°", "180°"] }; return { q: `三角形${a}°和${b}°，第三个 ?°`, a: (180 - a - b) + "°", opts: H.salt([180 - a - b], 10, 120).map((v) => v + "°") }; },
    () => { const t = H.pick([125, 25]); const x = t === 125 ? 8 : 4; const y = H.ri(3, 9); return { q: `${t} × ${x} × ${y} = ?`, a: t * x * y, opts: H.salt([t * x * y], t * x * y - 200, t * x * y + 200) }; },
    () => { const avg = H.ri(10, 25); const arr = [avg - 2, avg + 1, avg + 1]; return { q: `${arr.join("、")}平均 ?`, a: avg, opts: H.salt([avg], avg - 5, avg + 5) }; }
  ],
  formulas: [
    { title: "🔢 大数", items: [
      { name: "数级", expr: "每4位为一级：个级、万级、亿级" },
      { name: "改写成万", expr: "去掉末尾4个0，加一个万字" }
    ] },
    { title: "⚖️ 运算定律", items: [
      { name: "加法交换律", expr: "a+b=b+a" },
      { name: "加法结合律", expr: "(a+b)+c=a+(b+c)" },
      { name: "乘法交换律", expr: "a×b=b×a" },
      { name: "乘法结合律", expr: "(a×b)×c=a×(b×c)" },
      { name: "乘法分配律", expr: "(a+b)×c=a×c+b×c" }
    ] },
    { title: "📐 角", items: [
      { name: "三种角", expr: "1直角＝90°，1平角＝180°，1周角＝360°" },
      { name: "换算", expr: "1平角＝2个直角，1周角＝2个平角" }
    ] },
    { title: "🔺 三角形", items: [
      { name: "内角和", expr: "三角形内角和＝180°" }
    ] },
    { title: "💧 小数与平均数", items: [
      { name: "小数加减", expr: "小数点对齐再算" },
      { name: "平均数", expr: "平均数＝总数÷份数" }
    ] }
  ]
};
