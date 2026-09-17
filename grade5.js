// 五年级配置：小数乘除 · 方程 · 面积 · 因数倍数 · 分数 · 体积
const GRADE = {
  n: 5,
  title: "五年级",
  subtitle: "五年级 · 小数乘除 → 简易方程 → 多边形面积 → 因数倍数 → 分数",
  storeKey: "mathAdv5",
  questCount: 10,
  tasks: [
    "小数乘除玩5局，说出小数点移动规律。",
    "解方程玩5局，把检验过程讲出来。",
    "算一算三角形的面积：量底和高。",
    "因数倍数玩5局，找出50以内所有质数。",
    "分数乐园玩5局，把约分通分讲清楚。",
    "来一次闯关10题，看看能得几星。",
    "用数对说出家里3样东西的位置。",
    "量一个纸箱的长宽高，算它的体积。"
  ],
  roadmap: [
    "第1-4周：小数乘除法，位置（数对）",
    "第5-8周：简易方程，多边形面积",
    "第9-12周：因数倍数质数合数，分数意义性质，长方体体积"
  ],
  modules: [
    {
      id: "xiaoshu5", tab: "💧 小数乘除", title: "💧 小数乘法和除法",
      type: "options", retry: "先按整数算，再数小数位数点小数点；除法先把除数变整数",
      levels: [{ v: "cheng", label: "小数乘法" }, { v: "chu", label: "小数除法" }],
      gen(level, last) {
        let q, ans;
        if (level === "chu") {
          const cases = [[7.2, 0.9, 8], [3.6, 4, 0.9], [5.4, 0.6, 9], [2.4, 0.8, 3], [4.5, 5, 0.9], [12.5, 5, 2.5]];
          const c = H.pick(cases);
          q = `${c[0]} ÷ ${c[1]} = ?`; ans = c[2];
        } else {
          const cases = [[2.5, 4, 10], [0.25, 8, 2], [1.5, 6, 9], [3.2, 3, 9.6], [0.4, 7, 2.8], [1.2, 5, 6]];
          const c = H.pick(cases);
          q = `${c[0]} × ${c[1]} = ?`; ans = c[2];
        }
        if (q === last) return this.gen(level, last);
        const t = Math.round(ans * 10);
        return { q, a: ans, opts: H.salt([t], Math.max(1, t - 20), t + 20).map((v) => v / 10) };
      }
    },
    {
      id: "fangcheng", tab: "❓ 解方程", title: "❓ 简易方程：求未知数",
      type: "options", retry: "等式两边同时加减乘除同一个数，等式不变",
      hint: "等式性质：两边同时加减乘除同一个数（除数不为0），等式不变",
      gen(level, last) {
        const k = H.r(5);
        let q, ans;
        if (k === 0) { const x = H.ri(5, 30), b = H.ri(3, 20); q = `x + ${b} = ${x + b}，x = ?`; ans = x; }
        else if (k === 1) { const x = H.ri(10, 40), b = H.ri(3, 15); q = `x - ${b} = ${x - b}，x = ?`; ans = x; }
        else if (k === 2) { const x = H.ri(3, 12), b = H.ri(2, 9); q = `${b}x = ${b * x}，x = ?`; ans = x; }
        else if (k === 3) { const x = H.ri(2, 12), b = H.ri(2, 9); q = `x ÷ ${b} = ${x}，x = ?`; ans = x * b; }
        else { const x = H.ri(2, 10), a = H.ri(2, 5), c = H.ri(3, 15); q = `${a}x + ${c} = ${a * x + c}，x = ?`; ans = x; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 8), ans + 8) };
      }
    },
    {
      id: "shudui", tab: "📍 数对定位", title: "📍 位置：数对大作战",
      type: "options", retry: "先列后行：(列，行)，别写反了",
      hint: "数对 = (列，行)，先列后行",
      gen(level, last) {
        const c = H.ri(1, 6);
        let r = H.ri(1, 6);
        if (r === c) r = (r % 6) + 1; // 列≠行，保证4个选项不重复
        let q, ans, opts;
        if (Math.random() < 0.5) {
          q = `第${c}列第${r}行，用数对表示是 ?`;
          ans = `(${c}，${r})`;
          opts = [`(${c}，${r})`, `(${r}，${c})`, `(${c}，${c})`, `(${r}，${r})`];
        } else {
          q = `数对(${c}，${r})表示 ?`;
          ans = `第${c}列第${r}行`;
          opts = [`第${c}列第${r}行`, `第${r}列第${c}行`, `第${c}列第${c}行`, `第${r}列第${r}行`];
        }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf([...new Set(opts)]) };
      }
    },
    {
      id: "mianji", tab: "📐 图形面积", title: "📐 多边形面积",
      type: "options", retry: "平行四边形=底×高；三角形=底×高÷2；梯形=(上底+下底)×高÷2",
      hint: "平行四边形=底×高 · 三角形=底×高÷2 · 梯形=(上+下)×高÷2",
      gen(level, last) {
        const k = H.r(3);
        let q, ans;
        if (k === 0) { const b = H.ri(3, 12), h = H.ri(2, 10); q = `底${b}、高${h}的平行四边形，面积 ?`; ans = b * h; }
        else if (k === 1) { const b = H.ri(2, 12) * 2, h = H.ri(2, 10); q = `底${b}、高${h}的三角形，面积 ?`; ans = (b * h) / 2; }
        else { const a = H.ri(2, 8), b = H.ri(3, 10), h = H.ri(2, 8) * 2; q = `上底${a}、下底${b}、高${h}的梯形，面积 ?`; ans = ((a + b) * h) / 2; }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.salt([ans], Math.max(1, ans - 15), ans + 15) };
      }
    },
    {
      id: "yinshu", tab: "🔍 因数倍数", title: "🔍 因数、倍数、质数合数",
      type: "options", retry: "1既不是质数也不是合数；2是最小的质数",
      hint: "1既不是质数也不是合数 · 个位0/2/4/6/8是2的倍数 · 各位和是3的倍数才是3的倍数",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, opts;
        if (k === 0) {
          const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
          const comps = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 25, 26, 27];
          ans = H.pick(primes);
          const set = new Set([ans]);
          while (set.size < 4) set.add(H.pick(comps));
          q = "下面哪个数是质数？"; opts = [...set];
        } else if (k === 1) {
          const n = H.pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]);
          const cnt = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).length;
          q = `${n}的因数有几个？`; ans = cnt;
          opts = H.salt([cnt], 1, 8);
        } else if (k === 2) {
          const good = H.pick([12, 15, 18, 21, 24, 27, 33, 123, 306]);
          const set = new Set([good]);
          while (set.size < 4) set.add(good + H.ri(1, 9));
          q = "下面哪个数是3的倍数？"; ans = good; opts = [...set];
        } else {
          const pairs = [[8, 12, 4], [6, 9, 3], [10, 15, 5], [12, 18, 6]];
          const p = H.pick(pairs);
          q = `${p[0]}和${p[1]}的最大公因数是 ?`; ans = p[2];
          opts = H.salt([p[2]], 1, 8);
        }
        if (q === last && k !== 0 && k !== 2) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "fenshu5", tab: "🍰 分数世界", title: "🍰 分数的约分通分",
      type: "options", retry: "约分除以公因数到最简；通分化成分母相同的分数再比",
      gen(level, last) {
        const k = H.r(3);
        let q, ans, opts;
        if (k === 0) {
          const pairs = [["12/18", "2/3"], ["8/12", "2/3"], ["15/25", "3/5"], ["6/9", "2/3"], ["10/15", "2/3"], ["4/10", "2/5"], ["9/12", "3/4"]];
          const p = H.pick(pairs);
          q = `${p[0]} 约分后是 ?`; ans = p[1];
          opts = [p[1], "1/2", "3/4", "4/5"].filter((v, i, a) => a.indexOf(v) === i);
          while (opts.length < 4) opts.push(`${H.ri(1, 5)}/${H.ri(6, 9)}`);
        } else if (k === 1) {
          const pairs = [["3/4", "5/6", "＜"], ["2/3", "3/5", "＞"], ["5/8", "7/12", "＞"], ["4/5", "7/9", "＞"]];
          const p = H.pick(pairs);
          q = `${p[0]} ? ${p[1]}`; ans = p[2]; opts = ["＞", "＜", "="];
        } else {
          const pairs = [["7/3", "2又1/3"], ["8/5", "1又3/5"], ["11/4", "2又3/4"], ["9/4", "2又1/4"]];
          const p = H.pick(pairs);
          q = `${p[0]} 化成带分数是 ?`; ans = p[1];
          opts = [p[1], "1又1/3", "3又1/3", "2又2/3"];
        }
        if (q === last) return this.gen(level, last);
        return { q, a: ans, opts: H.shuf(opts) };
      }
    },
    {
      id: "tiji", tab: "📦 体积容积", title: "📦 长方体正方体与体积",
      type: "options", retry: "1立方分米=1000立方厘米，1升=1000毫升；体积=长×宽×高",
      hint: "1立方分米=1000立方厘米 · 1升=1000毫升 · 长方体体积=长×宽×高",
      gen(level, last) {
        const k = H.r(4);
        let q, ans, unit;
        if (k === 0) { const v = H.ri(1, 9); q = `${v}立方分米 = ? 立方厘米`; ans = v * 1000; unit = "立方厘米"; }
        else if (k === 1) { const v = H.ri(1, 9); q = `${v}升 = ? 毫升`; ans = v * 1000; unit = "毫升"; }
        else if (k === 2) { const a = H.ri(2, 9), b = H.ri(2, 8), h = H.ri(2, 6); q = `长${a}宽${b}高${h}的长方体，体积 ?`; ans = a * b * h; unit = ""; }
        else { const s = H.ri(2, 6); q = `棱长${s}的正方体，体积 ?`; ans = s * s * s; unit = ""; }
        if (q === last) return this.gen(level, last);
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(1, ans + (H.ri(0, 6) - 3) * (ans > 500 ? 200 : 6)));
        return { q, a: unit ? ans + unit : ans, opts: H.shuf([...set]).map((v) => (unit ? v + unit : v)) };
      }
    }
  ],
  makers: [
    () => ({ q: "2.5 × 4 = ?", a: 10, opts: H.salt([100], 80, 120).map((v) => v / 10) }),
    () => { const x = H.ri(5, 30), b = H.ri(3, 20); return { q: `x + ${b} = ${x + b}，x = ?`, a: x, opts: H.salt([x], 1, 40) }; },
    () => { const b = H.ri(3, 12), h = H.ri(2, 10); return { q: `底${b}高${h}平行四边形面积 ?`, a: b * h, opts: H.salt([b * h], b * h - 15, b * h + 15) }; },
    () => { const p = H.pick([["12/18", "2/3"], ["15/25", "3/5"], ["9/12", "3/4"]]); return { q: `${p[0]}约分 ?`, a: p[1], opts: [p[1], "1/2", "3/4", "4/5"].filter((v, i, a) => a.indexOf(v) === i).concat(["5/6"]).slice(0, 4) }; },
    () => { const a = H.ri(2, 9), b = H.ri(2, 8), h = H.ri(2, 6); return { q: `长${a}宽${b}高${h}体积 ?`, a: a * b * h, opts: H.salt([a * b * h], a * b * h - 20, a * b * h + 20) }; },
    () => { const c = H.ri(1, 6); let r = H.ri(1, 6); if (r === c) r = (r % 6) + 1; return { q: `第${c}列第${r}行 ?`, a: `(${c}，${r})`, opts: [`(${c}，${r})`, `(${r}，${c})`, `(${c}，${c})`, `(${r}，${r})`] }; }
  ]
};
