// 初二配置：全等 · 幂与乘法公式 · 分式 · 二次根式 · 勾股 · 四边形 · 一次函数
const GRADE = {
  n: 8,
  title: "初二",
  subtitle: "初二 · 全等三角形 → 整式乘除 → 分式 → 勾股定理 → 一次函数",
  storeKey: "mathAdv8",
  questCount: 10,
  tasks: [
    "全等判定玩6局，每个判定说出一组对应条件。",
    "幂运算玩6局，底数不变指数相加减。",
    "分式玩5局，分母为零永远不行。",
    "勾股玩6局，3-4-5、5-12-13背熟。",
    "一次函数玩6局，k定方向b定截距。",
    "来一次闯关10题，看看能得几星。",
    "找生活中的轴对称图形，画出对称轴。",
    "用平均数/中位数评价一次小测成绩。"
  ],
  roadmap: [
    "第1-4周：三角形与全等，轴对称，整式乘除",
    "第5-8周：因式分解，分式，二次根式",
    "第9-12周：勾股定理，四边形，一次函数，数据分析"
  ],
  modules: [
    {
      id: "quandeng", tab: "🔺 全等三角形", title: "🔺 全等：判定与性质",
      type: "options", retry: "SSS三边，SAS两边夹角，ASA两角夹边，AAS两角一对边，直角三角形还有HL",
      hint: "SSS · SAS · ASA · AAS · HL（直角三角形）",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { const s = H.ri(4, 12); q = `△ABC ≌ △DEF，AB = ${s}，则 DE = ?`; ans = s; opts = H.salt([s], 1, 16); }
        else if (k === 1) { const a = H.pick([40, 50, 60, 70]); q = `△ABC ≌ △DEF，∠A = ${a}°，则∠D = ?°`; ans = a + "°"; opts = H.salt([a], 20, 110).map((v) => v + "°"); }
        else if (k === 2) { q = "两边和它们的夹角分别相等，用哪种判定？"; ans = "SAS"; opts = ["SAS", "SSS", "ASA", "AAS"]; }
        else if (k === 3) { q = "AB = DE，BC = EF，AC = DF，用哪种判定？"; ans = "SSS"; opts = ["SSS", "SAS", "ASA", "HL"]; }
        else { q = "直角三角形中，斜边和一条直角边对应相等，用哪种判定？"; ans = "HL"; opts = ["HL", "SAS", "AAS", "SSS"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "micheng", tab: "✖️ 幂与乘法", title: "✖️ 幂运算与乘法公式",
      type: "options", retry: "同底相乘指数加，相除指数减，乘方指数乘；(a+b)(a-b)=a²-b²",
      levels: [{ v: "mi", label: "幂运算" }, { v: "gongshi", label: "乘法公式" }, { v: "fenjie", label: "因式分解" }],
      gen(level, last) {
        let q, ans, opts;
        if (level === "gongshi") {
          const k = H.r(3);
          if (k === 0) { const a = H.ri(2, 9); q = `(x + ${a})(x - ${a}) = ?`; ans = `x² - ${a * a}`; opts = [`x² - ${a * a}`, `x² + ${a * a}`, `x² - ${2 * a}x + ${a * a}`, `x² + ${2 * a}x - ${a * a}`]; }
          else if (k === 1) { const a = H.ri(2, 9); q = `(x + ${a})² = ?`; ans = `x² + ${2 * a}x + ${a * a}`; opts = [`x² + ${2 * a}x + ${a * a}`, `x² + ${a * a}`, `x² - ${2 * a}x + ${a * a}`, `x² + ${2 * a}x - ${a * a}`]; }
          else { const a = H.ri(2, 5); q = `(2x - ${a})(2x + ${a}) = ?`; ans = `4x² - ${a * a}`; opts = [`4x² - ${a * a}`, `4x² + ${a * a}`, `2x² - ${a * a}`, `4x² - ${2 * a}x + ${a * a}`]; }
        } else if (level === "fenjie") {
          const k = H.r(3);
          if (k === 0) { const a = H.ri(2, 9); q = `x² - ${a * a} = ?`; ans = `(x + ${a})(x - ${a})`; opts = [`(x + ${a})(x - ${a})`, `(x + ${a})²`, `(x - ${a})²`, `(x + ${a * a})(x - 1)`]; }
          else if (k === 1) { const a = H.ri(2, 6); q = `x² + ${2 * a}x + ${a * a} = ?`; ans = `(x + ${a})²`; opts = [`(x + ${a})²`, `(x - ${a})²`, `(x + ${a})(x - ${a})`, `(x + ${2 * a})²`]; }
          else { const a = H.ri(2, 6); q = `${a * 2}x² - ${a * 4}x 的公因式是 ?`; ans = `${a * 2}x`; opts = [`${a * 2}x`, `${a}x`, "x²", `${a * 4}`]; }
        } else {
          const k = H.r(3);
          if (k === 0) { const m = H.ri(2, 5), n = H.ri(2, 5); q = `a^${m} · a^${n} = ?`; ans = `a^${m + n}`; const set = new Set([ans, `a^${m * n}`, `${m + n}a`, `a^${Math.abs(m - n)}`, `a^${m + n + 1}`]); opts = [ans, ...H.shuf([...set].filter((v) => v !== ans))].slice(0, 4); }
          else if (k === 1) { q = "2⁵ = ?"; ans = 32; opts = [32, 10, 25, 64]; }
          else { const m = H.ri(2, 4), n = H.ri(1, 3); q = `(a^${m})^${n} = ?`; ans = `a^${m * n}`; const set = new Set([ans, `a^${m + n}`, `${m * n}a`, `a^${m}`, `a^${m * n + 1}`, `a^${m + n + 1}`, `${m * n + 1}a`]); opts = [ans, ...H.shuf([...set].filter((v) => v !== ans))].slice(0, 4); }
        }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "fenshi", tab: "➗ 分式", title: "➗ 分式：条件与化简",
      type: "options", retry: "分母不能为零；分式值为0要求分子为0且分母不为0",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { const a = H.ri(2, 9); q = `1/(x - ${a}) 有意义，x ≠ ?`; ans = a; opts = H.salt([a], 0, 12); }
        else if (k === 1) { const a = H.ri(1, 8); q = `(x - ${a})/(x + 2) 的值为0，x = ?`; ans = a; opts = H.salt([a], -4, 12); }
        else if (k === 2) { const m = H.pick([[6, 9, "2x/3"], [4, 10, "2/5"], [8, 12, "2/3"]]); q = `${m[0]}x²/${m[1]}x 约分后是 ?`; ans = m[2]; opts = H.shuf([m[2], `${m[0]}/${m[1]}`, "x", `${m[2]}x`]); }
        else { const a = H.ri(1, 5); q = `1/a + ${a}/a = ?`; ans = `${a + 1}/a`; opts = H.shuf([`${a + 1}/a`, `${a}/a`, `1/${a}`, `${a + 1}`]); }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "erciji", tab: "🌱 二次根式", title: "🌱 二次根式：化简与运算",
      type: "options", retry: "被开方数拆成平方数×剩余；合并看被开方数；根号下必须≥0",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { const p = H.pick([[12, "2√3"], [50, "5√2"], [27, "3√3"], [18, "3√2"], [20, "2√5"]]); q = `√${p[0]} = ?`; ans = p[1]; opts = H.shuf([p[1], `√${p[0]}`, `${p[0]}√1`, p[1].replace("√", "") + "√4"]); }
        else if (k === 1) { const a = H.ri(2, 6), b = H.ri(1, 5); q = `${a}√3 + ${b}√3 = ?`; ans = `${a + b}√3`; const set = new Set([ans, `${a * b}√3`, `${a + b}√6`, `${a + b + 3}`, `${a + b + 1}√3`]); opts = [ans, ...H.shuf([...set].filter((v) => v !== ans))].slice(0, 4); }
        else if (k === 2) { q = "√2 × √6 = ?"; ans = "2√3"; opts = H.shuf(["2√3", "√12", "√8", "12"]); }
        else { const a = H.ri(1, 9); q = `√(x - ${a}) 有意义，x 的范围是 ?`; ans = `x≥${a}`; opts = H.shuf([`x≥${a}`, `x＞${a}`, `x≤${a}`, `x≠${a}`]); }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "gougu", tab: "📐 勾股定理", title: "📐 勾股定理：a² + b² = c²",
      type: "pad", padMax: 30, retry: "分清直角边和斜边：斜边最长，是c",
      hint: "3-4-5 · 6-8-10 · 5-12-13 · 8-15-17",
      gen() {
        const ts = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];
        const t = H.pick(ts);
        if (Math.random() < 0.6) return { q: `直角三角形两直角边 ${t[0]} 和 ${t[1]}，斜边 = ?`, a: t[2] };
        return { q: `直角三角形斜边 ${t[2]}，一直角边 ${t[0]}，另一直角边 = ?`, a: t[1] };
      }
    },
    {
      id: "sibian", tab: "⬛ 四边形", title: "⬛ 平行四边形与特殊四边形",
      type: "options", retry: "平行四边形：对边平行相等，对角相等，对角线平分；矩形对角线相等，菱形对角线垂直",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { const n = H.pick([5, 6, 8]); q = `${n}边形的内角和是 ?°`; ans = (n - 2) * 180; opts = H.salt([ans], ans - 360, ans + 360); return { q, a: ans + "°", opts: opts.map((v) => v + "°") }; }
        else if (k === 1) { q = "平行四边形的对角线 ?"; ans = "互相平分"; opts = ["互相平分", "互相垂直", "相等", "互相垂直且相等"]; }
        else if (k === 2) { q = "一组对边平行且相等的四边形是 ?"; ans = "平行四边形"; opts = ["平行四边形", "梯形", "菱形", "矩形"]; }
        else if (k === 3) { q = "对角线互相垂直的平行四边形是 ?"; ans = "菱形"; opts = ["菱形", "矩形", "正方形", "梯形"]; }
        else { q = "对角线相等且互相平分的四边形是 ?"; ans = "矩形"; opts = ["矩形", "菱形", "平行四边形", "梯形"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "yicihan", tab: "📈 一次函数", title: "📈 一次函数：k与b",
      type: "options", retry: "k＞0上升，k＜0下降；b是与y轴交点的纵坐标；b=0时过原点",
      hint: "k 定方向（增减），b 定截距",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { q = "y = 2x - 3 经过哪几个象限？"; ans = "一、三、四"; opts = ["一、三、四", "一、二、三", "二、三、四", "一、二、四"]; }
        else if (k === 1) { const b = H.ri(1, 6); q = `y = -x + ${b} 与y轴交于 ?`; ans = `(0，${b})`; opts = [`(0，${b})`, `(${b}，0)`, `(0，-${b})`, "原点"]; }
        else if (k === 2) { const m = H.ri(2, 5), b = H.ri(1, 6); q = `y = ${m}x + 1，x = 2 时 y = ?`; ans = m * 2 + 1; opts = H.salt([m * 2 + 1], 1, 20); }
        else if (k === 3) { q = "y = -2x + 5，y 随 x 增大而 ?"; ans = "减小"; opts = ["减小", "增大", "不变", "先增后减"]; }
        else { const m = H.ri(2, 9); q = `正比例函数 y = ${m}x 的图象经过 ?`; ans = "原点"; opts = ["原点", "(0，1)", "(1，0)", "不经过原点"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "shuju", tab: "📊 数据分析", title: "📊 平均数/中位数/众数",
      type: "options", retry: "平均数求和除以个数；中位数先排序取中间；众数是出现最多的；方差越小越稳定",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { const arr = [H.ri(70, 90), H.ri(70, 90), H.ri(70, 90)]; const s = arr.reduce((a, b) => a + b, 0); if (s % 3 !== 0) return this.gen(level, last); q = `${arr.join("、")} 的平均数是 ?`; ans = s / 3; opts = H.salt([ans], ans - 8, ans + 8); }
        else if (k === 1) { const arr = H.shuf([61, 72, 83, 94, 55]).slice(0, 5).sort((a, b) => a - b); q = `${H.shuf(arr).join("、")} 的中位数是 ?`; ans = arr[2]; opts = H.salt([ans], ans - 10, ans + 10); }
        else if (k === 2) { const m = H.pick([7, 8, 9]); const arr = H.shuf([m, m, m, m + 2, m - 1]); q = `${arr.join("、")} 的众数是 ?`; ans = m; opts = H.salt([m], m - 3, m + 3); }
        else { q = "两组成绩平均数相同，甲组方差小，说明 ?"; ans = "甲组成绩更稳定"; opts = ["甲组成绩更稳定", "乙组成绩更稳定", "两组一样", "无法判断"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    }
  ],
  makers: [
    () => { const m = H.ri(2, 5), n = H.ri(2, 5); const ans = `a^${m + n}`; const set = new Set([ans, `a^${m * n}`, `a^${Math.abs(m - n)}`, `${m + n}a`, `a^${m + n + 1}`]); return { q: `a^${m} · a^${n} = ?`, a: ans, opts: [ans, ...H.shuf([...set].filter((v) => v !== ans))].slice(0, 4) }; },
    () => { const a = H.ri(2, 9); return { q: `(x + ${a})(x - ${a}) = ?`, a: `x² - ${a * a}`, opts: [`x² - ${a * a}`, `x² + ${a * a}`, `x² - ${2 * a}x + ${a * a}`, `x² + ${2 * a}x - ${a * a}`] }; },
    () => { const t = H.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return { q: `直角边${t[0]}、${t[1]}，斜边 ?`, a: t[2], opts: H.salt([t[2]], 3, 18) }; },
    () => { const m = H.ri(2, 5); return { q: `y = ${m}x + 1，x=2 时 y=?`, a: m * 2 + 1, opts: H.salt([m * 2 + 1], 1, 20) }; },
    () => { const p = H.pick([[12, "2√3"], [50, "5√2"], [27, "3√3"]]); return { q: `√${p[0]} = ?`, a: p[1], opts: [p[1], `√${p[0]}`, p[1].replace("√", "") + "√1", "√" + (p[0] + 1)] }; },
    () => { const s = H.ri(4, 12); return { q: `△ABC≌△DEF，AB=${s}，DE=?`, a: s, opts: H.salt([s], 1, 16) }; }
  ]
};
