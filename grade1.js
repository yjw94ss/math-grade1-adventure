// 一年级配置：数感 → 计算 → 生活数学
const GRADE = {
  n: 1,
  title: "一年级",
  subtitle: "一年级 · 数感 → 计算 → 生活数学",
  storeKey: "mathAdv1",
  questCount: 10,
  tasks: [
    "玩3局凑十挑战，说出“几和几凑成10”。",
    "做5道10以内加减，先摆积木再写算式。",
    "挑战2道20以内：用凑十/破十讲出过程。",
    "去比大小玩5局，读出“几大于几”。",
    "去找规律玩5局，把规律说出来。",
    "去小小商店买2样东西，算总价和找回。",
    "来一次闯关10题，看看能得几星。",
    "看家里钟表，说出现在是整时还是半时。",
    "找3个圆形、3个长方形，摸一摸边。",
    "倒着从20数到1，再单数跳格子。",
    "玩藏花生：10颗藏几颗，猜分合。",
    "数100颗豆，10个10个装袋，读出几十。"
  ],
  roadmap: [
    "第1-4周：数到20，10的分合，加减含义",
    "第5-8周：认识11-20，凑十加、破十减，图形位置",
    "第9-12周：钟表、100以内数、人民币、找规律"
  ],
  modules: [
    {
      id: "ten", tab: "🔟 凑十挑战", title: "🔟 凑十挑战：看到几，就想差几凑成10",
      type: "options", retry: "差一点，再想想 🔍",
      gen(level, last) {
        const n = H.ri(1, 9);
        const q = `${n} + ? = 10`;
        if (q === last) return this.gen(level, last);
        return { display: n, q, visual: "🟠".repeat(n) + "⚪".repeat(10 - n), a: 10 - n, opts: H.salt([10 - n], 1, 9) };
      }
    },
    {
      id: "calc", tab: "🚂 加减小火车", title: "🚂 加减小火车",
      type: "pad", padMax: 20, retry: "再摆一摆小棒试试 💪",
      levels: [{ v: "10", label: "10以内" }, { v: "20", label: "20以内进位/退位" }],
      gen(level) {
        let a, b, op;
        if (level === "20") {
          if (Math.random() < 0.5) { a = H.ri(6, 9); b = H.ri(5, 9); op = "+"; }
          else { a = H.ri(11, 18); b = H.ri(3, 9); if (b >= a - 9) b = a - 10 + 1; op = "-"; }
        } else {
          a = H.r(10); b = H.r(10); op = Math.random() < 0.5 ? "+" : "-";
          if (op === "-" && b > a) [a, b] = [b, a];
        }
        const ans = op === "+" ? a + b : a - b;
        return { q: `${a} ${op} ${b} = ?`, visual: "🟢".repeat(Math.min(a, 20)) + (op === "+" ? "  ➕  " + "🟡".repeat(Math.min(b, 20)) : ""), a: ans };
      }
    },
    {
      id: "clock", tab: "🕐 钟表侦探", title: "🕐 钟表小侦探：只考整时和半时",
      type: "custom", hint: "长针指12是整时，指6是半时",
      render({ box, addStar, speak, H }) {
        box.dsp.style.display = "none"; box.vis.style.display = "none";
        box.q.textContent = "现在是几点？";
        const cv = document.createElement("canvas");
        cv.width = 220; cv.height = 220; cv.id = "clockCanvas";
        box.ext.innerHTML = ""; box.ext.appendChild(cv);
        const draw = (h, m) => {
          let ctx = null;
          try { ctx = cv.getContext("2d"); } catch {}
          if (!ctx) return;
          ctx.clearRect(0, 0, 220, 220);
          ctx.beginPath(); ctx.arc(110, 110, 100, 0, 7); ctx.fillStyle = "#fff"; ctx.fill();
          ctx.lineWidth = 6; ctx.strokeStyle = "#FF8A3D"; ctx.stroke();
          ctx.fillStyle = "#333"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          for (let i = 1; i <= 12; i++) {
            const a = i / 12 * Math.PI * 2 - Math.PI / 2;
            ctx.fillText(i, 110 + Math.cos(a) * 78, 110 + Math.sin(a) * 78);
          }
          const ha = ((h % 12) + m / 60) / 12 * Math.PI * 2 - Math.PI / 2;
          const ma = (m / 60) * Math.PI * 2 - Math.PI / 2;
          ctx.lineWidth = 8; ctx.strokeStyle = "#333"; ctx.beginPath();
          ctx.moveTo(110, 110); ctx.lineTo(110 + Math.cos(ha) * 45, 110 + Math.sin(ha) * 45); ctx.stroke();
          ctx.lineWidth = 5; ctx.strokeStyle = "#3D9BFF"; ctx.beginPath();
          ctx.moveTo(110, 110); ctx.lineTo(110 + Math.cos(ma) * 70, 110 + Math.sin(ma) * 70); ctx.stroke();
          ctx.fillStyle = "#FF6B8B"; ctx.beginPath(); ctx.arc(110, 110, 8, 0, 7); ctx.fill();
        };
        const next = () => {
          const h = H.ri(1, 12), half = Math.random() < 0.5;
          const ans = half ? `${h}:30 半时` : `${h}:00 整时`;
          draw(h, half ? 30 : 0);
          const set = new Set([ans]);
          while (set.size < 4) set.add(`${H.ri(1, 12)}${Math.random() < 0.5 ? ":00 整时" : ":30 半时"}`);
          box.opts.innerHTML = ""; box.msg.textContent = ""; box.msg.className = "msg";
          H.shuf([...set]).forEach((v) => {
            const b = document.createElement("button");
            b.className = "opt"; b.textContent = v;
            b.onclick = () => {
              if (v === ans) { b.classList.add("correct"); box.msg.textContent = "小侦探破案啦！🔍 " + addStar("clock"); box.msg.className = "msg good"; speak("时间看对了"); setTimeout(next, 900); }
              else { b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 650); box.msg.textContent = "看看长针指着12还是6？🕐"; box.msg.className = "msg bad"; }
            };
            box.opts.appendChild(b);
          });
        };
        next();
      }
    },
    {
      id: "shape", tab: "🔷 图形乐园", title: "🔷 图形乐园：认一认、找一找",
      type: "options", retry: "数一数边和角，再猜一次 💡",
      hint: "生活找一找：家里哪里有圆形 / 长方形？找到+1⭐",
      gen(level, last) {
        const shapes = [["⭕", "圆形"], ["🔺", "三角形"], ["🟧", "正方形"], ["📏", "长方形"], ["⚽", "球"], ["📦", "长方体"]];
        const s = H.pick(shapes);
        if (s[1] === last) return this.gen(level, last);
        const set = new Set([s[1]]);
        while (set.size < 4) set.add(H.pick(shapes)[1]);
        return { display: s[0], q: "这个图形叫什么？", a: s[1], opts: H.shuf([...set]) };
      }
    },
    {
      id: "compare", tab: "⚖️ 比大小", title: "⚖️ 比大小：填 ＞ ＜ =",
      type: "options", retry: "开口朝大数，再看看 👀", hint: "开口朝大数：7 ＜ 9，尖尖对小数",
      levels: [{ v: "num", label: "数字比" }, { v: "expr", label: "算式比" }],
      gen(level, last) {
        const val = () => {
          if (level !== "expr") { const v = H.r(21); return { t: String(v), v }; }
          const a = H.ri(1, 9), b = H.ri(1, 9);
          const op = Math.random() < 0.5 ? "+" : "-";
          const x = op === "+" ? a + b : Math.abs(a - b);
          return { t: `${Math.max(a, b)} ${op} ${Math.min(a, b)}（=${x}）`, v: x };
        };
        let L = val(), R = val();
        if (L.v === R.v && Math.random() < 0.7) R = val();
        const q = `${L.t}  ?  ${R.t}`;
        if (q === last) return this.gen(level, last);
        return { q, a: L.v > R.v ? "＞" : L.v < R.v ? "＜" : "=", opts: ["＞", "＜", "="] };
      }
    },
    {
      id: "pattern", tab: "🔍 找规律", title: "🔍 找规律：后面该是谁？",
      type: "options", retry: "看看每次多几 / 少几 💡",
      levels: [{ v: "seq", label: "数字列" }, { v: "makeup", label: "数的组成" }],
      gen(level, last) {
        let q, ans;
        if (level === "makeup") {
          if (Math.random() < 0.5) {
            const t = H.ri(1, 9), o = H.r(10);
            q = `${t * 10 + o} 是由 ${t} 个十和 ? 个一组成的`; ans = o;
          } else {
            const t = 10 * H.ri(1, 9), o = H.ri(1, 9);
            if (Math.random() < 0.5) { q = `${t} + ${o} = ?`; ans = t + o; }
            else { q = `${t + o} - ${t} = ?`; ans = o; }
          }
        } else {
          const kinds = [
            () => { const s = H.ri(1, 5), d = H.ri(1, 5); return [`${s}、${s + d}、${s + 2 * d}、?`, s + 3 * d]; },
            () => { const s = 20 - H.r(8), d = H.ri(1, 3); return [`${s}、${s - d}、${s - 2 * d}、?`, s - 3 * d]; },
            () => { const s = 5 * H.ri(1, 3); return [`${s}、${s + 5}、${s + 10}、?`, s + 15]; },
            () => { const s = 10 * H.ri(1, 4); return [`${s}、${s + 10}、${s + 20}、?`, s + 30]; }
          ];
          [q, ans] = H.pick(kinds)();
        }
        if (q === last) return this.gen(level, last);
        const step = Math.max(1, H.r(5));
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(0, ans + (H.ri(0, 6) - 3) * step || 1));
        return { q, a: ans, opts: H.shuf([...set]) };
      }
    },
    {
      id: "money", tab: "🛒 小小商店", title: "🛒 小小商店：认识元角分",
      type: "options", retry: "摆摆硬币数一数 🪙",
      levels: [{ v: "know", label: "认钱换钱" }, { v: "shop", label: "买东西算账" }],
      gen(level, last) {
        let q, ans, extra = "";
        if (level === "shop") {
          const goods = [["🍎苹果", 3], ["🍌香蕉", 2], ["🥛牛奶", 5], ["📖本子", 4], ["✏️铅笔", 1], ["🧸玩偶", 8], ["⚽足球", 9], ["🍞面包", 6]];
          const g1 = H.pick(goods);
          let g2 = H.pick(goods);
          if (g2 === g1) g2 = goods[(goods.indexOf(g1) + 3) % goods.length];
          if (Math.random() < 0.5) { q = `${g1[0]}${g1[1]}元 + ${g2[0]}${g2[1]}元，一共 ? 元`; ans = g1[1] + g2[1]; }
          else { const total = g1[1] + g2[1], give = total + H.ri(1, 5); q = `一共${total}元，付${give}元，找回 ? 元`; ans = give - total; }
          extra = `<div>${g1[0]} ${g1[1]}元</div><div>${g2[0]} ${g2[1]}元</div>`;
        } else {
          const y = H.ri(1, 5);
          q = `${y}元 = ? 角`; ans = y * 10;
        }
        if (q === last) return this.gen(level, last);
        const unit = q.includes("角") ? "角" : "元";
        const set = new Set([ans]);
        while (set.size < 4) set.add(Math.max(0, ans + H.ri(0, 6) - 3));
        return { q, extra, a: ans + unit, opts: H.shuf([...set]).map((v) => v + unit) };
      }
    },
    {
      id: "lianxian", tab: "🔗 连线配对", title: "🔗 连线：算式找得数",
      type: "match", retry: "再算一遍，这两个真是一对吗？",
      gen() {
        const used = new Set(), pairs = [];
        let guard = 0;
        while (pairs.length < 4 && guard++ < 120) {
          const a = H.r(10), b = H.r(10);
          const op = Math.random() < 0.5 ? "+" : "-";
          const x = Math.max(a, b), y = Math.min(a, b);
          const ans = op === "+" ? x + y : x - y;
          if (ans > 10 || used.has(ans)) continue;
          used.add(ans);
          pairs.push([`${x} ${op} ${y}`, String(ans)]);
        }
        return { q: "左边点一道算式，右边点它的得数", pairs };
      }
    },
    {
      id: "paixu", tab: "🔢 排排队", title: "🔢 排排队：按顺序点",
      type: "order", retry: "顺序不对，再看看 👀",
      levels: [{ v: "10", label: "10以内" }, { v: "20", label: "20以内" }],
      gen(level) {
        const mx = level === "20" ? 20 : 10;
        const set = new Set();
        while (set.size < 4) set.add(H.r(mx + 1));
        const dir = Math.random() < 0.5 ? "asc" : "desc";
        return { q: dir === "asc" ? "从小到大依次点一遍 👆" : "从大到小依次点一遍 👆", cards: [...set].map((v) => ({ t: String(v), v })), dir };
      }
    }
  ],
  makers: [
    () => { const n = H.ri(1, 9); return { q: `${n} + ? = 10`, a: 10 - n, opts: H.salt([10 - n], 1, 9) }; },
    () => { const a = H.r(10), b = H.r(10); return { q: `${a} + ${b} = ?`, a: a + b, opts: H.salt([a + b], 0, 18) }; },
    () => { const a = H.ri(6, 9), b = H.ri(5, 9); return { q: `${a} + ${b} = ?`, a: a + b, opts: H.salt([a + b], 10, 19) }; },
    () => { const a = H.r(21), b = H.r(21); return { q: `${a} ? ${b}`, a: a > b ? "＞" : a < b ? "＜" : "=", opts: ["＞", "＜", "="] }; },
    () => { const s = H.ri(1, 6), d = H.ri(1, 4); return { q: `${s}、${s + d}、${s + 2 * d}、?`, a: s + 3 * d, opts: H.salt([s + 3 * d], 0, 30) }; },
    () => { const y = H.ri(1, 5); return { q: `${y}元 = ? 角`, a: y * 10, opts: H.salt([y * 10], 0, 50) }; }
  ],
  formulas: [
    { title: "➕ 加法与减法", items: [
      { name: "加法各部分", expr: "加数＋加数＝和" },
      { name: "求加数", expr: "和－一个加数＝另一个加数" },
      { name: "减法各部分", expr: "被减数－减数＝差" },
      { name: "求减数", expr: "减数＝被减数－差" },
      { name: "求被减数", expr: "被减数＝减数＋差" }
    ] },
    { title: "🔟 凑十歌", items: [
      { name: "凑成10", expr: "9要1，8要2，7要3，6要4，5要5", note: "看到9找1，看到8找2，先凑10再加剩下的" }
    ] },
    { title: "🔢 数位", items: [
      { name: "两位数", expr: "15＝1个十＋5个一", note: "右边第一位是个位，第二位是十位" }
    ] }
  ]
};
