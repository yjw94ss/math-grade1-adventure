// 初一配置：有理数 · 整式 · 一元一次方程 · 平行线 · 实数 · 坐标系
const GRADE = {
  n: 7,
  title: "初一",
  subtitle: "初一 · 有理数 → 整式 → 一元一次方程 → 平行线 → 实数",
  storeKey: "mathAdv7",
  questCount: 10,
  tasks: [
    "有理数玩8局，乘方符号别搞错。",
    "整式玩5局，合并同类项先找“同类”。",
    "解方程玩5局，移项要变号。",
    "平行线玩5局，指出每道题用的判定还是性质。",
    "实数玩5局，√2约等于1.414背下来。",
    "来一次闯关10题，看看能得几星。",
    "在方格纸上画点(3,-2)，说出它在第几象限。",
    "编一道生活中的一元一次方程考家长。"
  ],
  roadmap: [
    "第1-4周：有理数四则混合，乘方，科学记数法",
    "第5-8周：整式加减，一元一次方程及应用",
    "第9-12周：相交线平行线，实数，平面直角坐标系"
  ],
  modules: [
    {
      id: "youshu", tab: "🔢 有理数", title: "🔢 有理数运算",
      type: "options", retry: "同号相加取同号，异号相减取大号；负负得正；乘方先看指数奇偶",
      levels: [{ v: "calc", label: "四则乘方" }, { v: "know", label: "概念记数" }],
      gen(level, last) {
        if (level === "know") {
          const k = H.r(4);
          let q, ans, opts;
          if (k === 0) { q = "|-5| + |3| = ?"; ans = 8; opts = H.salt([8], 1, 14); }
          else if (k === 1) { q = "-(-3) + (-2) = ?"; ans = 1; opts = H.salt([1], -4, 6); }
          else if (k === 2) { const v = H.pick([12000, 360000, 50800]); const w = v >= 100000 ? `${v / 100000}×10⁵` : `${v / 10000}×10⁴`; q = `${v} 用科学记数法是 ?`; ans = w; opts = H.shuf([w, `${v / 1000}×10³`, `0.${v / 1000000}×10⁶`, `${v}×10⁰`]); }
          else { const a = -H.ri(2, 9), b = -H.ri(1, 8); q = `${a} ? ${b}`; ans = a > b ? "＞" : "＜"; opts = ["＞", "＜", "="]; }
          if (q === last) return this.gen(level, last);
          return { q, a: ans, opts };
        }
        const k = H.r(6);
        let q, ans;
        if (k === 0) { const a = -H.ri(3, 15), b = H.ri(2, 12); q = `(${a}) + ${b} = ?`; ans = a + b; }
        else if (k === 1) { const a = H.ri(3, 12), b = -H.ri(2, 10); q = `${a} - (${b}) = ?`; ans = a - b; }
        else if (k === 2) { const a = -H.ri(2, 9), b = -H.ri(2, 9); q = `(${a}) × (${b}) = ?`; ans = a * b; }
        else if (k === 3) { const b = -H.ri(2, 9), s = H.ri(2, 9); q = `${b * s} ÷ (${b}) = ?`; ans = s; }
        else if (k === 4) { const e = H.pick([2, 3]); q = `(-2)${e === 2 ? "²" : "³"} = ?`; ans = e === 2 ? 4 : -8; }
        else { const a = -H.ri(2, 5); q = `${a} × 2 + 5 = ?`; ans = a * 2 + 5; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], ans - 12, ans + 12) };
      }
    },
    {
      id: "zhengshi", tab: "🧩 整式加减", title: "🧩 整式：合并与去括号",
      type: "options", retry: "先找同类项再合并；括号前是减号，去括号全变号",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { const a = H.ri(2, 6), b = H.ri(1, 5); q = `${a}x + ${b}x - x = ?`; ans = `${a + b - 1}x`; const set = new Set([ans, `${a + b}x`, `${a + b - 1}x²`, `${a * b}x`, `${a + b + 1}x`, `${a * b + 1}x`]); opts = [ans, ...H.shuf([...set].filter((v) => v !== ans))].slice(0, 4); }
        else if (k === 1) { const a = H.ri(2, 5); q = `${a}(3x - 1) = ?`; ans = `${a * 3}x - ${a}`; opts = [`${a * 3}x - ${a}`, `${a * 3}x - 1`, `${a * 3}x² - ${a}`, `${a + 3}x - ${a}`]; }
        else if (k === 2) { q = "5a - 2(a - 3) = ?"; ans = "3a + 6"; opts = ["3a + 6", "3a - 6", "7a - 6", "3a + 3"]; }
        else if (k === 3) { q = "与 -3xy² 是同类项的是 ?"; ans = "5xy²"; opts = ["5xy²", "-3x²y", "3xy", "-3x²y²"]; }
        else { q = "-2x³y 的系数和次数是 ?"; ans = "系数-2，次数4"; opts = ["系数-2，次数4", "系数2，次数4", "系数-2，次数3", "系数-2，次数5"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "fangcheng1", tab: "❓ 一元一次方程", title: "❓ 一元一次方程：移项变号",
      type: "options", retry: "移项要变号；去分母每一项都乘；先检验再作答",
      hint: "移项变号 · 去括号 · 去分母每一项都乘",
      gen(level, last) {
        const k = H.r(5);
        let q, ans;
        if (k === 0) { const x = H.ri(4, 20), b = H.ri(3, 15); q = `x + ${b} = ${x + b}，x = ?`; ans = x; }
        else if (k === 1) { const x = H.ri(3, 15), b = H.ri(2, 6); q = `${b}x - 5 = ${b * x - 5}，x = ?`; ans = x; }
        else if (k === 2) { const x = H.ri(4, 12), a = H.ri(2, 4); q = `${a}(x - 3) = ${a * (x - 3)}，x = ?`; ans = x; }
        else if (k === 3) { const x = H.ri(4, 14); q = `5x = 2x + ${3 * x}，x = ?`; ans = x; }
        else { const x = H.ri(8, 14); q = `爸爸${3 * x + 2}岁，是小明年龄的3倍多2岁，小明 ? 岁`; ans = x; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 6), ans + 6) };
      }
    },
    {
      id: "pingxing", tab: "📏 平行线", title: "📏 相交线与平行线：求角度",
      type: "options", retry: "对顶角相等，邻补角互补；两直线平行，同位角/内错角相等，同旁内角互补",
      gen(level, last) {
        const k = H.r(5);
        let q, ans;
        if (k === 0) { const a = H.pick([35, 50, 65, 80, 110]); q = `∠1 = ${a}°，它的对顶角是 ?°`; ans = a; }
        else if (k === 1) { const a = H.pick([40, 55, 70, 100]); q = `∠1 = ${a}°，它的邻补角是 ?°`; ans = 180 - a; }
        else if (k === 2) { const a = H.pick([45, 60, 75, 105]); q = `a∥b，∠1 = ${a}°（同位角∠2)，∠2 = ?°`; ans = a; }
        else if (k === 3) { const a = H.pick([50, 65, 80, 110]); q = `a∥b，∠1 = ${a}°（同旁内角∠2)，∠2 = ?°`; ans = 180 - a; }
        else { q = "“同位角相等”可以判定 ?"; ans = "两直线平行"; return { q, a: ans, opts: H.shuf(["两直线平行", "对顶角相等", "邻补角互补", "两直线垂直"]) }; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(5, ans + (H.ri(0, 6) - 3) * 10));
        return { q, a: ans + "°", opts: H.shuf([...set]).map((v) => v + "°") };
      }
    },
    {
      id: "shishu", tab: "🌳 实数", title: "🌳 实数：平方根与估算",
      type: "options", retry: "正数有两个平方根，0的平方根是0，负数没有平方根；√2≈1.414",
      hint: "√2 ≈ 1.414 · √3 ≈ 1.732 · π ≈ 3.14",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { const s = H.pick([4, 6, 7, 8, 9, 11]); q = `√${s * s} = ?`; ans = s; opts = H.salt([s], 1, 14); }
        else if (k === 1) { const c = H.pick([2, 3, 4]); q = `³√${c * c * c} = ?`; ans = c; opts = H.salt([c], 1, 8); }
        else if (k === 2) { q = "√2 在哪两个整数之间？"; ans = "1和2"; opts = ["1和2", "2和3", "0和1", "3和4"]; }
        else if (k === 3) { q = "下面哪个数是无理数？"; ans = "π"; opts = H.shuf(["π", "√4", "1/3", "0.101"]); }
        else { q = "√5 ? 2"; ans = "＞"; opts = ["＞", "＜", "="]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "zuobiao", tab: "📍 坐标系", title: "📍 平面直角坐标系",
      type: "options", retry: "第一象限(+,+)，第二(-,+)，第三(-,-)，第四(+,-)；关于x轴对称横不变纵变号",
      gen(level, last) {
        const k = H.r(3);
        let q, ans, opts;
        if (k === 0) {
          const qs = [[3, -2, "四"], [-4, 5, "二"], [-2, -3, "三"], [5, 6, "一"]];
          const p = H.pick(qs);
          q = `点(${p[0]}，${p[1]})在第几象限？`; ans = "第" + p[2] + "象限"; opts = ["第一象限", "第二象限", "第三象限", "第四象限"];
        } else if (k === 1) {
          const a = H.ri(1, 5), b = H.ri(1, 5);
          q = `点(${a}，${b})关于x轴的对称点是 ?`; ans = `(${a}，-${b})`;
          opts = [`(${a}，-${b})`, `(-${a}，${b})`, `(-${a}，-${b})`, `(${b}，${a})`];
        } else { q = "原点的坐标是 ?"; ans = "(0，0)"; opts = ["(0，0)", "(1，1)", "(0，1)", "没有坐标"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "eryuan2", tab: "🧮 二元一次方程组", title: "🧮 二元一次方程组",
      type: "options", retry: "代入消元或加减消元，先消一个元；解完代回去检验",
      gen(level, last) {
        if (Math.random() < 0.6) {
          const x = H.ri(2, 8), y = H.ri(1, 7);
          const s = x + y, d = x - y;
          if (d <= 0) return this.gen(level, last);
          const q = `x + y = ${s}，x - y = ${d}，方程组的解是 ?`;
          if (q === last) return this.gen(level, last);
          return { q, a: `x=${x}，y=${y}`, opts: H.shuf([`x=${x}，y=${y}`, `x=${y}，y=${x}`, `x=${x + 1}，y=${y}`, `x=${x}，y=${y + 1}`]) };
        }
        const p = H.ri(2, 5), n = H.ri(2, 4);
        const q = `笔单价${p}元，本子单价${n}元，买2支笔3个本共 ? 元`;
        const ans = 2 * p + 3 * n;
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], ans - 8, ans + 8) };
      }
    },
    {
      id: "budeng", tab: "⚖️ 不等式", title: "⚖️ 一元一次不等式",
      type: "options", retry: "乘除负数，不等号要变向；正整数解从1开始数",
      hint: "乘除同一个负数，不等号方向改变",
      gen(level, last) {
        const k = H.r(4);
        let q, ans;
        if (k === 0) { const b = H.ri(2, 9); q = `2x ＞ ${2 * b}，解集是 ?`; ans = `x＞${b}`; return { q, a: ans, opts: H.shuf([`x＞${b}`, `x＜${b}`, `x≥${b}`, `x＞${b + 1}`]) }; }
        if (k === 1) { const b = H.ri(2, 9); q = `-3x ＜ ${-3 * b}，解集是 ?`; ans = `x＞${b}`; return { q, a: ans, opts: H.shuf([`x＞${b}`, `x＜${b}`, `x＞${-b}`, `x＜${-b}`]) }; }
        if (k === 2) { const n = H.ri(3, 8); q = `x ＜ ${n} 的正整数解有几个？`; ans = n - 1; return { q, a: ans, opts: H.salt([n - 1], 1, 10) }; }
        q = "a ＞ b，则 -2a ? -2b"; ans = "＜";
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: ["＞", "＜", "="] };
      }
    },
    {
      id: "zhengshilian", tab: "🔗 整式连线", title: "🔗 整式连线：化简找结果",
      type: "match", retry: "合并同类项、去括号，一步一步来",
      gen() {
        const pool = [["3x+5x", "8x"], ["2(3x-1)", "6x-2"], ["5a-2(a-3)", "3a+6"], ["-(-3)", "3"], ["|-5|", "5"], ["x+7=15", "x=8"]];
        return { q: "左边点题目，右边点它的结果", pairs: H.shuf(pool).slice(0, 4) };
      }
    },
    {
      id: "paixu7", tab: "🔢 有理数排队", title: "🔢 有理数排排队",
      type: "order", retry: "正数都比负数大；两个负数比绝对值，绝对值大的反而小",
      gen() {
        const set = new Set();
        while (set.size < 5) set.add(H.ri(-10, 10));
        const dir = Math.random() < 0.5 ? "asc" : "desc";
        return { q: dir === "asc" ? "从小到大依次点 👆" : "从大到小依次点 👆", cards: [...set].map((v) => ({ t: String(v), v })), dir };
      }
    }
  ],
  makers: [
    () => { const a = -H.ri(3, 12), b = H.ri(2, 10); return { q: `(${a}) + ${b} = ?`, a: a + b, opts: H.salt([a + b], a + b - 10, a + b + 10) }; },
    () => ({ q: "3x + 5x - x = ?", a: "7x", opts: ["7x", "8x", "7x²", "9x"] }),
    () => { const x = H.ri(3, 15); return { q: `x + 7 = ${x + 7}，x = ?`, a: x, opts: H.salt([x], 1, 25) }; },
    () => { const a = H.pick([50, 65, 80]); return { q: `a∥b，同位角∠1=${a}°，∠2 ?°`, a: a + "°", opts: H.salt([a], 20, 130).map((v) => v + "°") }; },
    () => { const s = H.pick([6, 7, 8, 11]); return { q: `√${s * s} = ?`, a: s, opts: H.salt([s], 1, 14) }; },
    () => ({ q: "点(3，-2)在第几象限？", a: "第四象限", opts: ["第一象限", "第二象限", "第三象限", "第四象限"] })
  ]
};
