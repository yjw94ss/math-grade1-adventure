// 初三配置：一元二次方程 · 二次函数 · 圆 · 反比例 · 相似 · 锐角三角 · 概率
const GRADE = {
  n: 9,
  title: "初三",
  subtitle: "初三 · 一元二次方程 → 二次函数 → 圆 → 相似 → 三角函数 → 概率",
  storeKey: "mathAdv9",
  questCount: 10,
  tasks: [
    "一元二次方程玩6局，因式分解法优先。",
    "二次函数玩6局，顶点式一眼看出顶点。",
    "圆玩6局，见弦想垂径，见切线连半径。",
    "相似玩5局，面积比是相似比的平方。",
    "特殊角三角函数值默写一遍：30°、45°、60°。",
    "来一次闯关10题，看看能得几星。",
    "用影子测一测楼高（相似应用）。",
    "掷骰子30次，统计偶数频率接近1/2吗。"
  ],
  roadmap: [
    "第1-4周：一元二次方程解法，判别式，韦达定理",
    "第5-8周：二次函数图象性质，圆的性质与计算",
    "第9-12周：反比例函数，相似，锐角三角函数，概率，总复习"
  ],
  modules: [
    {
      id: "efang", tab: "🧮 一元二次方程", title: "🧮 一元二次方程",
      type: "options", retry: "先看能不能因式分解；判别式Δ=b²-4ac定根的个数；韦达：和=-b/a，积=c/a",
      levels: [{ v: "jie", label: "解方程" }, { v: "pan", label: "判别式与韦达" }],
      gen(level, last) {
        if (level === "pan") {
          const k = H.r(3);
          let q, ans, opts;
          if (k === 0) { q = "x² + 2x + 5 = 0 的根的情况是 ?"; ans = "没有实数根"; opts = ["没有实数根", "两个相等实数根", "两个不等实数根", "有一个实数根"]; }
          else if (k === 1) { q = "x² - 6x + 9 = 0 的根的情况是 ?"; ans = "两个相等的实数根"; opts = ["两个相等的实数根", "没有实数根", "两个不等的实数根", "无法判断"]; }
          else { q = "x² - 5x + 6 = 0 两根之和是 ?"; ans = 5; opts = H.salt([5], 0, 12); }
          if (q === last) return this.gen(level, last);
          return { q, a: ans, opts: H.shuf(opts) };
        }
        const eqs = [
          ["x² - 5x + 6 = 0", "2或3", ["2或3", "1或6", "-2或-3", "2或-3"]],
          ["x² = 9", "3或-3", ["3或-3", "9或-9", "3", "9"]],
          ["x(x - 4) = 0", "0或4", ["0或4", "0或-4", "4", "1或4"]],
          ["(x - 1)² = 4", "3或-1", ["3或-1", "3或1", "-3或1", "2或-2"]],
          ["x² - 7x + 12 = 0", "3或4", ["3或4", "2或6", "-3或-4", "3或-4"]]
        ];
        const e = H.pick(eqs);
        if (e[0] === last) return this.gen(level, last);
        return { q: `${e[0]} 的解是 ?`, a: e[1], opts: H.shuf(e[2]) };
      }
    },
    {
      id: "ehan", tab: "📈 二次函数", title: "📈 二次函数：顶点与图象",
      type: "options", retry: "y=a(x-h)²+k：顶点(h,k)，对称轴x=h；a＞0开口向上有最小值",
      hint: "顶点式 y = a(x-h)² + k：顶点(h，k)，对称轴 x = h",
      gen(level, last) {
        const k = H.r(6);
        let q, ans, opts;
        if (k === 0) { q = "y = 2(x - 1)² + 3 的顶点是 ?"; ans = "(1，3)"; opts = ["(1，3)", "(-1，3)", "(1，-3)", "(-1，-3)"]; }
        else if (k === 1) { q = "y = -3x² + 2 的开口方向是 ?"; ans = "向下"; opts = ["向下", "向上", "向左", "向右"]; }
        else if (k === 2) { q = "y = (x + 2)² - 1 的对称轴是 ?"; ans = "x = -2"; opts = ["x = -2", "x = 2", "x = -1", "y = -2"]; }
        else if (k === 3) { q = "y = x² - 4x + 3 的最小值是 ?"; ans = -1; opts = H.salt([-1], -8, 6); }
        else if (k === 4) { q = "y = x² 向左平移2个单位，再向上平移1个单位，是 ?"; ans = "y = (x + 2)² + 1"; opts = ["y = (x + 2)² + 1", "y = (x - 2)² + 1", "y = (x + 2)² - 1", "y = x² + 2x + 1"]; }
        else { q = "y = x² - 4 与x轴交点的横坐标是 ?"; ans = "2和-2"; opts = ["2和-2", "2", "4和-4", "0和4"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "yuan9", tab: "⭕ 圆", title: "⭕ 圆：垂径切线与弧长",
      type: "options", retry: "见弦作弦心距（垂径定理）；见切线连圆心与切点；圆周角是同弧圆心角的一半",
      gen(level, last) {
        const k = H.r(5);
        let q, ans, opts;
        if (k === 0) { q = "半径5，弦心距3，则这条弦长是 ?"; ans = 8; opts = H.salt([8], 2, 14); }
        else if (k === 1) { const a = H.pick([60, 80, 100]); q = `同弧所对圆心角${a}°，圆周角是 ?°`; ans = a / 2; opts = H.salt([a / 2], 10, 90).map((v) => v + "°"); ans = ans + "°"; }
        else if (k === 2) { q = "圆的切线与过切点的半径 ?"; ans = "垂直"; opts = ["垂直", "平行", "相交但不垂直", "重合"]; }
        else if (k === 3) { q = "90°的圆心角，半径2，弧长是 ?（π保留）"; ans = "π"; opts = ["π", "2π", "π/2", "4π"]; }
        else { q = "90°的扇形，半径2，面积是 ?（π保留）"; ans = "π"; opts = ["π", "2π", "π/2", "4π"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "fanbili", tab: "〰️ 反比例函数", title: "〰️ 反比例函数 y = k/x",
      type: "options", retry: "k＞0在一三象限，k＜0在二四象限；|k|是图上一点与坐标轴围成矩形的面积",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { q = "y = -3/x 的图象在哪两个象限？"; ans = "二、四"; opts = ["二、四", "一、三", "一、二", "三、四"]; }
        else if (k === 1) { q = "y = 5/x（x＞0），y 随 x 增大而 ?"; ans = "减小"; opts = ["减小", "增大", "不变", "先增后减"]; }
        else if (k === 2) { q = "反比例图象上一点与坐标轴围成的矩形面积是6，且k＜0，则 k = ?"; ans = -6; opts = H.salt([-6], -12, 6); }
        else { const a = H.ri(2, 5), b = H.ri(2, 5); q = `反比例函数过点(${a}，${b})，则 k = ?`; ans = a * b; opts = H.salt([a * b], 2, 40); }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "xiangsi", tab: "🔍 相似", title: "🔍 相似：比与应用",
      type: "options", retry: "相似比=对应边之比；面积比=相似比的平方；两角分别相等则相似",
      hint: "面积比 = 相似比的平方",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { const a = H.ri(2, 4), b = a + H.ri(1, 2); q = `相似比 ${a}:${b}，面积比是 ?`; ans = `${a * a}:${b * b}`; opts = [`${a * a}:${b * b}`, `${a}:${b}`, `${2 * a}:${2 * b}`, `${a * a * a}:${b * b * b}`]; }
        else if (k === 1) { const ab = H.pick([4, 6, 8]), k2 = H.pick([1.5, 2, 2.5]); const de = ab * k2, bc = H.pick([5, 10]); const ef = bc * k2; q = `△ABC ∽ △DEF，AB=${ab}，DE=${de}，BC=${bc}，则 EF = ?`; ans = ef; const t = Math.round(ef * 10); opts = H.salt([t], t - 20, t + 20).map((v) => v / 10); }
        else if (k === 2) { q = "两角分别相等的两个三角形 ?"; ans = "相似"; opts = ["相似", "全等", "不相似", "无法判断"]; }
        else { const h = H.pick([1.5, 1.6, 1.8]); q = `竹竿${h}米影长1米，大楼影长20米，大楼高 ? 米`; ans = Math.round(h * 20 * 10) / 10; const t = Math.round(ans * 10); opts = H.salt([t], t - 40, t + 40).map((v) => v / 10); }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "sanjiao", tab: "📐 锐角三角函数", title: "📐 锐角三角函数",
      type: "options", retry: "sin30°=1/2，cos60°=1/2，tan45°=1，sin60°=√3/2；∠A+∠B=90°时sinA=cosB",
      hint: "sin30°=1/2 · tan45°=1 · sin60°=√3/2",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { const t = H.pick([["sin30°", "1/2"], ["cos60°", "1/2"], ["tan45°", "1"], ["sin60°", "√3/2"], ["cos30°", "√3/2"]]); q = `${t[0]} = ?`; ans = t[1]; const all = [...new Set(["1/2", "√3/2", "1", "√2/2", t[1]])]; opts = [ans, ...H.shuf(all.filter((v) => v !== ans))].slice(0, 4); }
        else if (k === 1) { q = "Rt△ABC，∠C=90°，AB=10，BC=6，则 sinA = ?"; ans = "3/5"; opts = ["3/5", "4/5", "3/4", "5/3"]; }
        else if (k === 2) { q = "∠A + ∠B = 90°，sinA = 3/5，则 cosB = ?"; ans = "3/5"; opts = ["3/5", "4/5", "5/3", "5/4"]; }
        else { const t = H.pick([["tan", 45, "1"], ["sin", 30, "1/2"]]); q = `${t[0]}${t[1]}° = ?`; ans = t[2]; const all = [...new Set(["1/2", "1", "√3/2", "0", t[2]])]; opts = [ans, ...H.shuf(all.filter((v) => v !== ans))].slice(0, 4); }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "gailv", tab: "🎲 概率", title: "🎲 概率：古典概型",
      type: "options", retry: "概率=目标情况数÷所有等可能情况数；两步事件画树状图或列表",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) { q = "掷一枚骰子，掷出偶数的概率是 ?"; ans = "1/2"; opts = ["1/2", "1/3", "1/6", "2/3"]; }
        else if (k === 1) { const r = H.ri(2, 4), w = H.ri(1, 3); q = `袋中${r}红${w}白（相同），摸到红球的概率是 ?`; ans = `${r}/${r + w}`; const all = [...new Set([ans, `${w}/${r + w}`, `1/${r + w}`, "1/2", `${r + 1}/${r + w + 1}`])]; opts = [ans, ...H.shuf(all.filter((v) => v !== ans))].slice(0, 4); }
        else if (k === 2) { q = "连掷两枚硬币，都是正面的概率是 ?"; ans = "1/4"; opts = ["1/4", "1/2", "1/3", "3/4"]; }
        else { q = "一副牌抽一张，是红桃的概率是 ?"; ans = "1/4"; opts = ["1/4", "1/2", "1/13", "1/52"]; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "hanlian", tab: "🔗 函数连线", title: "🔗 函数连线：解析式找性质",
      type: "match", retry: "顶点式一眼看顶点，a的符号定开口",
      gen() {
        const pool = [["y=2(x-1)²+3", "顶点(1，3)"], ["y=-3x²+2", "开口向下"], ["y=(x+2)²-1", "对称轴x=-2"], ["sin30°", "1/2"], ["x²-5x+6=0", "解2或3"], ["y=5/x(x＞0)", "y随x增大而减小"]];
        return { q: "左边点题目，右边点它的性质", pairs: H.shuf(pool).slice(0, 5) };
      }
    },
    {
      id: "panduan", tab: "✅ 判断小法官", title: "✅ 判断小法官：对还是错？",
      type: "options", retry: "说错的要能举出反例 ⚖️",
      gen(level, last) {
        const t = H.pick([
          ["x²=9的解是x=3", "✗ 错误"],
          ["相似比2:3，则面积比4:9", "✓ 正确"],
          ["同弧所对的圆周角是圆心角的一半", "✓ 正确"],
          ["tan45°=1", "✓ 正确"],
          ["-5＞-2", "✗ 错误"],
          ["掷骰子掷出6的概率是1/2", "✗ 错误"]
        ]);
        if (t[0] === last) return this.gen(level, last);
        return { q: t[0], a: t[1], opts: H.shuf(["✓ 正确", "✗ 错误"]) };
      }
    },
    {
      id: "zkzhenti", tab: "📜 中考真题", title: "📜 中考真题精选：做原题",
      type: "bank",
      bank: [
        { q: "下列事件是不可能事件的是？", a: "袋中只有红绿球却摸出黄球", opts: ["掷骰子掷出6点", "袋中只有红绿球却摸出黄球", "路口遇到绿灯", "水加热到100℃沸腾"], src: "2024年武汉三月调考模拟题·选择题", tip: "黄球根本不在袋子里，概率为0，所以是不可能事件" },
        { q: "(-3x³y)³ 的计算结果是？", a: "-27x⁹y³", opts: ["9x⁶y³", "-9x⁶y³", "-27x⁹y³", "27x⁹y³"], src: "2024年武汉三月调考模拟题·选择题", tip: "系数(-3)³=-27，字母指数相乘：x⁹y³，符号别丢" },
        { q: "11个杯口朝上的杯子，每次必须翻转3个，至少几次能全部朝下？", a: "5", opts: ["3", "4", "5", "6"], src: "2024年武汉三月调考模拟题·选择题", tip: "每个杯子要翻奇数次，3n≥11且3n为奇数，最小n=5（9个翻1次＋2个翻3次）" },
        { q: "若(a-3)x²-3x-4=0是关于x的一元二次方程，则a的取值范围是？", a: "a≠3", opts: ["a≠3", "a＞3", "a＜3", "a=3"], src: "2023年北京大兴初三期末·填空题", tip: "二次项系数不能为0，即a-3≠0" },
        { q: "x²-3x+m=0有一个根为1，则m=？", a: "2", opts: ["1", "2", "3", "0"], src: "2023年北京大兴初三期末·填空题", tip: "把x=1代入：1-3+m=0，得m=2" },
        { q: "点(2,y₁),(4,y₂)在抛物线y=2(x-3)²-4上，y₁与y₂的关系？", a: "y₁=y₂", opts: ["y₁＞y₂", "y₁＜y₂", "y₁=y₂", "无法判断"], src: "2023年北京大兴初三期末·填空题", tip: "两点到对称轴x=3的距离都是1，函数值相等（都是-2），别被开口方向骗了" },
        { q: "计算：(-1)⁻¹+|-3|-2cos30°-(π-6.8)⁰ = ?", a: "1-√3", opts: ["1-√3", "1+√3", "3-√3", "-1-√3"], src: "2024年长沙中考数学·第17题", tip: "-1+3-2×(√3/2)-1=1-√3。cos30°=√3/2，非零数的0次方都是1" },
        { q: "吉祥物6月销量1200件，8月1452件，设月平均增长率为x，可列方程？", a: "1200(1+x)²=1452", opts: ["1200(1+x)²=1452", "1200(1+x)=1452", "1452(1+x)²=1200", "1200+2x=1452"], src: "2024年长沙中考数学·应用题", tip: "平均增长率：基数×(1+x)ⁿ，6月到8月共2个月，所以平方" }
      ]
    }
  ],
  makers: [
    () => ({ q: "x² - 5x + 6 = 0 的解 ?", a: "2或3", opts: ["2或3", "1或6", "-2或-3", "2或-3"] }),
    () => ({ q: "y = 2(x-1)²+3 的顶点 ?", a: "(1，3)", opts: ["(1，3)", "(-1，3)", "(1，-3)", "(-1，-3)"] }),
    () => ({ q: "半径5弦心距3，弦长 ?", a: 8, opts: H.salt([8], 2, 14) }),
    () => { const a = H.ri(2, 5), b = H.ri(2, 5); return { q: `反比例过(${a}，${b})，k=?`, a: a * b, opts: H.salt([a * b], 2, 40) }; },
    () => ({ q: "sin30° = ?", a: "1/2", opts: ["1/2", "√3/2", "1", "√2/2"] }),
    () => ({ q: "掷骰子出偶数概率 ?", a: "1/2", opts: ["1/2", "1/3", "1/6", "2/3"] }),
    () => { const t = H.pick([["相似比2:3面积比4:9", "✓ 正确"], ["-5＞-2", "✗ 错误"], ["tan45°=1", "✓ 正确"], ["x²=9的解只有x=3", "✗ 错误"]]); return { q: t[0], a: t[1], opts: ["✓ 正确", "✗ 错误"] }; }
  ],
  formulas: [
    { title: "🧮 一元二次方程", items: [
      { name: "一般形式", expr: "ax²＋bx＋c＝0（a≠0）" },
      { name: "求根公式", html: "x＝<span class=\"frac\"><span>-b±√<span class=\"rad\">(b²-4ac)</span></span><span>2a</span></span>", note: "a≠0，Δ≥0时可用" },
      { name: "判别式", expr: "Δ＝b²-4ac：＞0两不等实根，＝0两相等，＜0无实根" },
      { name: "韦达定理", expr: "x₁＋x₂＝-b/a，x₁x₂＝c/a" }
    ] },
    { title: "📈 二次函数", items: [
      { name: "顶点式", expr: "y＝a(x-h)²＋k：顶点(h,k)，对称轴x＝h" },
      { name: "开口", expr: "a＞0开口向上有最小值，a＜0开口向下有最大值" },
      { name: "平移", expr: "左加右减，上加下减" }
    ] },
    { title: "⭕ 圆", items: [
      { name: "垂径定理", expr: "垂直于弦的直径平分弦" },
      { name: "圆周角", expr: "同弧圆周角＝圆心角的一半" },
      { name: "切线", expr: "切线垂直于过切点的半径" },
      { name: "弧长", html: "l＝<span class=\"frac\"><span>nπr</span><span>180</span></span>", note: "n是圆心角度数" },
      { name: "扇形面积", html: "S＝<span class=\"frac\"><span>nπr²</span><span>360</span></span>" }
    ] },
    { title: "〰️ 反比例函数", items: [
      { name: "一般形式", html: "y＝<span class=\"frac\"><span>k</span><span>x</span></span>", note: "k≠0" },
      { name: "图象", expr: "k＞0在一三象限，k＜0在二四象限" },
      { name: "|k|意义", expr: "|k|＝图上一点与坐标轴围成矩形的面积" }
    ] },
    { title: "🔍 相似与三角", items: [
      { name: "面积比", expr: "面积比＝相似比²" },
      { name: "正弦", html: "sinA＝<span class=\"frac\"><span>对边</span><span>斜边</span></span>" },
      { name: "余弦", html: "cosA＝<span class=\"frac\"><span>邻边</span><span>斜边</span></span>" },
      { name: "正切", html: "tanA＝<span class=\"frac\"><span>对边</span><span>邻边</span></span>" },
      { name: "特殊值", expr: "sin30°＝1/2，tan45°＝1，sin60°＝√3/2" }
    ] },
    { title: "🎲 概率", items: [
      { name: "古典概型", expr: "概率＝目标情况数÷所有等可能情况数" }
    ] }
  ]
};
