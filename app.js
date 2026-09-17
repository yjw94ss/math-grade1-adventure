// 数学小探险家 · 一年级本地网页，无依赖
const $ = (id) => document.getElementById(id);
const store = {
  get() {
    try { return JSON.parse(localStorage.getItem("mathAdv") || "{}"); }
    catch { return {}; }
  },
  set(d) { localStorage.setItem("mathAdv", JSON.stringify(d)); }
};
let data = Object.assign({ total: 0, ten: 0, calc: 0, clock: 0, shape: 0, warm: 0, compare: 0, pattern: 0, money: 0, quest: 0, best: 0, wrong: [] }, store.get());
if (!Array.isArray(data.wrong)) data.wrong = [];

function speak(t) {
  try {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "zh-CN"; u.rate = 0.95;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch {}
}
function addStar(key, msg) {
  data[key] = (data[key] || 0) + 1;
  data.total += 1;
  store.set(data); renderStars();
  return msg || "太棒了！+1⭐";
}
function renderStars() {
  $("starTotal").textContent = data.total;
  $("pTotal").textContent = data.total;
  const names = { warm: "热身骰子", ten: "凑十挑战", calc: "加减小火车", clock: "钟表侦探", shape: "图形乐园", compare: "比大小", pattern: "找规律", money: "小小商店", quest: "闯关10题" };
  $("pList").innerHTML = Object.keys(names).map(k =>
    `<li>${names[k]}：${data[k] || 0} ⭐</li>`).join("") + `<li>历史最佳连击：${data.best || 0} 连击 🔥</li>`;
}

// ---- tabs ----
$("tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll(".tabs button").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  $("tab-" + b.dataset.tab).classList.add("active");
});

// ---- 首页：热身比大小 + 今日任务 ----
const faces = ["⚀","⚁","⚂","⚃","⚄","⚅"];
let warmA = 1, warmB = 6;
$("btnWarmup").onclick = () => {
  $("warmupArea").classList.remove("hidden");
  newWarm();
};
function newWarm() {
  warmA = 1 + Math.floor(Math.random() * 6);
  warmB = 1 + Math.floor(Math.random() * 6);
  $("diceA").textContent = faces[warmA - 1];
  $("diceB").textContent = faces[warmB - 1];
  $("warmupMsg").textContent = ""; $("warmupMsg").className = "msg";
}
function warmGuess(g) {
  const ok = (g === "left" && warmA > warmB) || (g === "right" && warmB > warmA) || (g === "eq" && warmA === warmB);
  const m = $("warmupMsg");
  if (ok) { m.textContent = "答对啦！🎉 " + addStar("warm"); m.className = "msg good"; speak("答对了，真厉害"); setTimeout(newWarm, 900); }
  else { m.textContent = "再看看，数一数点点 😊"; m.className = "msg bad"; }
}
$("warmLeft").onclick = () => warmGuess("left");
$("warmRight").onclick = () => warmGuess("right");
$("warmEqual").onclick = () => warmGuess("eq");

const taskPool = [
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
];
function newTasks() {
  const picks = [...taskPool].sort(() => Math.random() - 0.5).slice(0, 3);
  $("todayTasks").innerHTML = picks.map((t, i) => `<li><b>${["热身3分","挑战7分","生活5分"][i]}：</b>${t}</li>`).join("");
}
$("btnNewTasks").onclick = newTasks;
newTasks();

// ---- 凑十 ----
let tenAnswer = 4;
function newTen() {
  const n = 1 + Math.floor(Math.random() * 9);
  tenAnswer = 10 - n;
  $("tenNum").textContent = n;
  $("tenDots").textContent = "🟠".repeat(n) + "⚪".repeat(10 - n);
  const opts = new Set([tenAnswer]);
  while (opts.size < 4) opts.add(1 + Math.floor(Math.random() * 9));
  $("tenOpts").innerHTML = "";
  [...opts].sort(() => Math.random() - 0.5).forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v;
    b.onclick = () => {
      const m = $("tenMsg");
      if (v === tenAnswer) { m.textContent = "凑对10啦！🎉 " + addStar("ten"); m.className = "msg good"; speak(`${n}加${v}等于十`); setTimeout(newTen, 900); }
      else { m.textContent = "差一点，再想想 🔍"; m.className = "msg bad"; }
    };
    $("tenOpts").appendChild(b);
  });
  $("tenMsg").textContent = ""; $("tenMsg").className = "msg";
}
newTen();

// ---- 加减 ----
let calcAnswer = 0;
function newCalc() {
  const level = document.querySelector('input[name="level"]:checked').value;
  let a, b, op;
  if (level === "10") {
    a = Math.floor(Math.random() * 10); b = Math.floor(Math.random() * 10);
    op = Math.random() < 0.5 ? "+" : "-";
    if (op === "-" && b > a) [a, b] = [b, a];
    calcAnswer = op === "+" ? a + b : a - b;
  } else {
    // 20以内进位加 / 退位减
    if (Math.random() < 0.5) { a = 6 + Math.floor(Math.random() * 4); b = 5 + Math.floor(Math.random() * 5); op = "+"; calcAnswer = a + b; }
    else { a = 11 + Math.floor(Math.random() * 8); b = 3 + Math.floor(Math.random() * 7); op = "-"; if (b >= a - 9) b = a - 10 + 1; calcAnswer = a - b; }
  }
  $("calcQ").textContent = `${a} ${op} ${b} = ?`;
  $("calcDots").textContent = a <= 20 ? "🟢".repeat(Math.min(a, 20)) + (op === "+" ? "  ➕  " + "🟡".repeat(Math.min(b, 20)) : "") : "";
  $("calcMsg").textContent = ""; $("calcMsg").className = "msg";
}
document.querySelectorAll('input[name="level"]').forEach(r => r.onchange = newCalc);
(function buildPad() {
  const pad = $("calcPad");
  for (let i = 0; i <= 20; i++) {
    const b = document.createElement("button");
    b.textContent = i;
    b.onclick = () => {
      const m = $("calcMsg");
      if (i === calcAnswer) { m.textContent = "小火车到站！🚂 " + addStar("calc"); m.className = "msg good"; speak("答对了"); setTimeout(newCalc, 1000); }
      else { m.textContent = "再摆一摆小棒试试 💪"; m.className = "msg bad"; }
    };
    pad.appendChild(b);
  }
})();
newCalc();

// ---- 钟表 ----
let clockAnswer = "";
function drawClock(h, m) {
  const c = $("clockCanvas"), ctx = c.getContext("2d");
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
}
function newClock() {
  const h = 1 + Math.floor(Math.random() * 12);
  const half = Math.random() < 0.5;
  const m = half ? 30 : 0;
  clockAnswer = half ? `${h}:30 半时` : `${h}:00 整时`;
  drawClock(h, m);
  const opts = new Set([clockAnswer]);
  while (opts.size < 4) {
    const hh = 1 + Math.floor(Math.random() * 12);
    const mm = Math.random() < 0.5 ? ":00 整时" : ":30 半时";
    opts.add(`${hh}${mm}`);
  }
  $("clockOpts").innerHTML = "";
  [...opts].sort(() => Math.random() - 0.5).forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v.replace(" ", "\n");
    b.onclick = () => {
      const msg = $("clockMsg");
      if (v === clockAnswer) { msg.textContent = "小侦探破案啦！🔍 " + addStar("clock"); msg.className = "msg good"; speak("时间看对了"); setTimeout(newClock, 1000); }
      else { msg.textContent = "看看长针指着12还是6？🕐"; msg.className = "msg bad"; }
    };
    $("clockOpts").appendChild(b);
  });
  $("clockMsg").textContent = ""; $("clockMsg").className = "msg";
}
newClock();

// ---- 图形 ----
const shapes = [
  { e: "⭕", n: "圆形" }, { e: "🔺", n: "三角形" },
  { e: "🟧", n: "正方形" }, { e: "📏", n: "长方形" },
  { e: "⚽", n: "球" }, { e: "📦", n: "长方体" }
];
let shapeAnswer = "圆形";
function newShape() {
  const s = shapes[Math.floor(Math.random() * shapes.length)];
  shapeAnswer = s.n;
  $("shapeShow").textContent = s.e;
  const opts = new Set([s.n]);
  while (opts.size < 4) opts.add(shapes[Math.floor(Math.random() * shapes.length)].n);
  $("shapeOpts").innerHTML = "";
  [...opts].sort(() => Math.random() - 0.5).forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v;
    b.onclick = () => {
      const m = $("shapeMsg");
      if (v === shapeAnswer) { m.textContent = "认对啦！🎨 " + addStar("shape"); m.className = "msg good"; speak(v); setTimeout(newShape, 900); }
      else { m.textContent = "数一数边和角，再猜一次 💡"; m.className = "msg bad"; }
    };
    $("shapeOpts").appendChild(b);
  });
  $("shapeMsg").textContent = ""; $("shapeMsg").className = "msg";
}
newShape();

// ---- 比大小 ----
let cmpAnswer = "<";
function cmpVal() {
  const lvl = document.querySelector('input[name="cmpLevel"]:checked').value;
  if (lvl === "num") { const v = Math.floor(Math.random() * 21); return { t: String(v), v }; }
  const a = 1 + Math.floor(Math.random() * 9), b = 1 + Math.floor(Math.random() * 9);
  const op = Math.random() < 0.5 ? "+" : "-";
  const x = op === "+" ? a + b : Math.abs(a - b);
  return { t: `${Math.max(a,b)} ${op} ${Math.min(a,b)}（=${x}）`, v: x };
}
function newCmp(last) {
  let L = cmpVal(), R = cmpVal();
  if (L.v === R.v && Math.random() < 0.7) R = cmpVal(); // 制造点不一样
  cmpAnswer = L.v > R.v ? "＞" : L.v < R.v ? "＜" : "=";
  const q = `${L.t}  ?  ${R.t}`;
  if (q === last) return newCmp(last);
  $("cmpQ").textContent = q;
  $("cmpOpts").innerHTML = "";
  ["＞", "＜", "="].forEach(s => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = s;
    b.onclick = () => {
      const m = $("cmpMsg");
      if (s === cmpAnswer) { m.textContent = "比对啦！⚖️ " + addStar("compare"); m.className = "msg good"; speak("比对了"); setTimeout(() => newCmp(q), 900); }
      else { m.textContent = "开口朝大数，再看看 👀"; m.className = "msg bad"; }
    };
    $("cmpOpts").appendChild(b);
  });
  $("cmpMsg").textContent = ""; $("cmpMsg").className = "msg";
}
document.querySelectorAll('input[name="cmpLevel"]').forEach(r => r.onchange = () => newCmp());
newCmp();

// ---- 找规律 / 数的组成 ----
let patAnswer = 0;
function newPat(last) {
  const lvl = document.querySelector('input[name="patLevel"]:checked').value;
  let q, ans;
  if (lvl === "makeup") {
    const kind = Math.random();
    if (kind < 0.5) { // 十位个位组成
      const t = 1 + Math.floor(Math.random() * 9), o = Math.floor(Math.random() * 10);
      const v = t * 10 + o; q = `${v} 是由 ${t} 个十和 ? 个一组成的`; ans = o;
    } else { // 整十加减
      const t = 10 * (1 + Math.floor(Math.random() * 9)), o = 1 + Math.floor(Math.random() * 9);
      if (Math.random() < 0.5) { q = `${t} + ${o} = ?`; ans = t + o; }
      else { q = `${t + o} - ${t} = ?`; ans = o; }
    }
  } else {
    const starts = [
      () => { const s = 1 + Math.floor(Math.random() * 5), d = 1 + Math.floor(Math.random() * 5); return { arr: [s, s + d, s + 2 * d], ans: s + 3 * d }; },
      () => { const s = 2 + Math.floor(Math.random() * 8), d = 2 + Math.floor(Math.random() * 3); return { arr: [s, s + d, s + 2 * d], ans: s + 3 * d }; },
      () => { const s = 20 - Math.floor(Math.random() * 8), d = 1 + Math.floor(Math.random() * 3); return { arr: [s, s - d, s - 2 * d], ans: s - 3 * d }; },
      () => { const s = 5 * (1 + Math.floor(Math.random() * 3)); return { arr: [s, s + 5, s + 10], ans: s + 15 }; },
      () => { const s = 10 * (1 + Math.floor(Math.random() * 4)); return { arr: [s, s + 10, s + 20], ans: s + 30 }; }
    ];
    const r = starts[Math.floor(Math.random() * starts.length)]();
    q = r.arr.join("、") + "、?"; ans = r.ans;
  }
  if (q === last) return newPat(last);
  patAnswer = ans;
  $("patQ").textContent = q;
  const opts = new Set([ans]);
  const step = Math.max(1, Math.floor(Math.random() * 5));
  while (opts.size < 4) opts.add(Math.max(0, ans + (Math.floor(Math.random() * 7) - 3) * step || 1));
  $("patOpts").innerHTML = "";
  [...opts].sort(() => Math.random() - 0.5).forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v;
    b.onclick = () => {
      const m = $("patMsg");
      if (v === patAnswer) { m.textContent = "找到规律啦！🔍 " + addStar("pattern"); m.className = "msg good"; speak("找对了"); setTimeout(() => newPat(q), 900); }
      else { m.textContent = "看看每次多几 / 少几 💡"; m.className = "msg bad"; }
    };
    $("patOpts").appendChild(b);
  });
  $("patMsg").textContent = ""; $("patMsg").className = "msg";
}
document.querySelectorAll('input[name="patLevel"]').forEach(r => r.onchange = () => newPat());
newPat();

// ---- 小小商店 ----
const goods = [["🍎苹果", 3], ["🍌香蕉", 2], ["🥛牛奶", 5], ["📖本子", 4], ["✏️铅笔", 1], ["🧸玩偶", 8], ["⚽足球", 9], ["🍞面包", 6]];
let moneyAnswer = 0;
function newMoney(last) {
  const lvl = document.querySelector('input[name="moneyLevel"]:checked').value;
  let q, shop = "";
  if (lvl === "know") {
    if (Math.random() < 0.5) { q = "1元 = ? 角"; moneyAnswer = 10; }
    else { const y = 1 + Math.floor(Math.random() * 5); q = `${y}元 = ? 角`; moneyAnswer = y * 10; }
  } else {
    const g1 = goods[Math.floor(Math.random() * goods.length)];
    let g2 = goods[Math.floor(Math.random() * goods.length)];
    if (g2 === g1) g2 = goods[(goods.indexOf(g1) + 3) % goods.length];
    const kind = Math.random();
    if (kind < 0.5) { q = `${g1[0]}${g1[1]}元 + ${g2[0]}${g2[1]}元，一共 ? 元`; moneyAnswer = g1[1] + g2[1]; }
    else { const total = g1[1] + g2[1]; const give = total + 1 + Math.floor(Math.random() * 5); q = `一共${total}元，付${give}元，找回 ? 元`; moneyAnswer = give - total; }
    shop = `<div>${g1[0]} ${g1[1]}元</div><div>${g2[0]} ${g2[1]}元</div>`;
  }
  if (q === last) return newMoney(last);
  $("moneyQ").textContent = q;
  $("moneyShop").innerHTML = shop;
  const opts = new Set([moneyAnswer]);
  while (opts.size < 4) opts.add(Math.max(0, moneyAnswer + Math.floor(Math.random() * 7) - 3));
  $("moneyOpts").innerHTML = "";
  [...opts].sort(() => Math.random() - 0.5).forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v + (String($("moneyQ").textContent).includes("角") ? "角" : "元");
    b.onclick = () => {
      const m = $("moneyMsg");
      if (v === moneyAnswer) { m.textContent = "算对账啦！🛒 " + addStar("money"); m.className = "msg good"; speak("算对了"); setTimeout(() => newMoney(q), 900); }
      else { m.textContent = "摆摆硬币数一数 🪙"; m.className = "msg bad"; }
    };
    $("moneyOpts").appendChild(b);
  });
  $("moneyMsg").textContent = ""; $("moneyMsg").className = "msg";
}
document.querySelectorAll('input[name="moneyLevel"]').forEach(r => r.onchange = () => newMoney());
newMoney();

// ---- 闯关10题 ----
let quest = { i: 0, streak: 0, best: 0, cur: null, retryMode: false, retryList: [] };
function randQ(exclude) {
  const makers = [mkTen, mkCalc10, mkCalc20, mkCmp, mkPat, mkMoney];
  for (let t = 0; t < 20; t++) {
    const q = makers[Math.floor(Math.random() * makers.length)]();
    if (!exclude || q.q !== exclude) return q;
  }
  return makers[0]();
}
function mkTen() { const n = 1 + Math.floor(Math.random() * 9); return { q: `${n} + ? = 10`, a: 10 - n, opts: salt([10 - n], 1, 9) }; }
function mkCalc10() {
  const a = Math.floor(Math.random() * 10), b = Math.floor(Math.random() * 10);
  if (Math.random() < 0.5) return { q: `${a} + ${b} = ?`, a: a + b, opts: salt([a + b], 0, 18) };
  const x = Math.max(a, b), y = Math.min(a, b);
  return { q: `${x} - ${y} = ?`, a: x - y, opts: salt([x - y], 0, 10) };
}
function mkCalc20() {
  if (Math.random() < 0.5) { const a = 6 + Math.floor(Math.random() * 4), b = 5 + Math.floor(Math.random() * 5); return { q: `${a} + ${b} = ?`, a: a + b, opts: salt([a + b], 10, 19) }; }
  const a = 12 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 6);
  return { q: `${a} - ${b} = ?`, a: a - b, opts: salt([a - b], 0, 15) };
}
function mkCmp() {
  const a = Math.floor(Math.random() * 21), b = Math.floor(Math.random() * 21);
  const ans = a > b ? "＞" : a < b ? "＜" : "=";
  return { q: `${a} ? ${b}`, a: ans, opts: ["＞", "＜", "="] };
}
function mkPat() {
  const s = 1 + Math.floor(Math.random() * 6), d = 1 + Math.floor(Math.random() * 4);
  const ans = s + 3 * d;
  return { q: `${s}、${s + d}、${s + 2 * d}、?`, a: ans, opts: salt([ans], 0, 30) };
}
function mkMoney() {
  if (Math.random() < 0.5) { const y = 1 + Math.floor(Math.random() * 5); return { q: `${y}元 = ? 角`, a: y * 10, opts: salt([y * 10], 0, 50) }; }
  const g1 = 1 + Math.floor(Math.random() * 8), g2 = 1 + Math.floor(Math.random() * 8);
  return { q: `${g1}元 + ${g2}元 = ? 元`, a: g1 + g2, opts: salt([g1 + g2], 0, 18) };
}
function salt(right, lo, hi) {
  const s = new Set(right);
  let guard = 0;
  while (s.size < 4 && guard++ < 60) s.add(lo + Math.floor(Math.random() * (hi - lo + 1)));
  return [...s].sort(() => Math.random() - 0.5);
}
function questRender() {
  $("questBar").style.width = (quest.i / 10 * 100) + "%";
  $("questInfo").textContent = quest.i >= 10
    ? `完成！10题闯关结束，最高连击 x${quest.best} 🔥`
    : `第 ${quest.i + 1}/10 题，连击 x${quest.streak}`;
  if (quest.i >= 10) {
    $("questQ").textContent = "🎉 通关！+5⭐";
    $("questOpts").innerHTML = "";
    return;
  }
  const c = quest.cur;
  $("questQ").textContent = c.q;
  $("questOpts").innerHTML = "";
  c.opts.forEach(v => {
    const b = document.createElement("button");
    b.className = "opt"; b.textContent = v;
    b.onclick = () => questAnswer(v);
    $("questOpts").appendChild(b);
  });
}
function pushWrong(q, a) {
  data.wrong.push({ q, a: String(a) });
  if (data.wrong.length > 30) data.wrong = data.wrong.slice(-30);
  store.set(data); renderWrong();
}
function questAnswer(v) {
  const m = $("questMsg");
  const ok = String(v) === String(quest.cur.a);
  if (ok) {
    quest.streak++; quest.best = Math.max(quest.best, quest.streak);
    m.textContent = (quest.streak >= 3 ? `🔥 ${quest.streak}连击！` : "答对啦！🎉 ") + addStar("quest");
    m.className = "msg good"; speak(quest.streak >= 3 ? quest.streak + "连击" : "答对了");
  } else {
    m.textContent = `不对哦，答案是 ${quest.cur.a}，已记入错题本 📝`;
    m.className = "msg bad";
    pushWrong(quest.cur.q, quest.cur.a);
    quest.streak = 0;
  }
  quest.i++;
  if (quest.i >= 10) {
    for (let k = 0; k < 5; k++) addStar("quest");
    data.best = Math.max(data.best || 0, quest.best); store.set(data); renderStars();
    speak("闯关成功");
  } else {
    quest.cur = randQ(quest.cur.q);
  }
  setTimeout(() => { m.textContent = ""; m.className = "msg"; questRender(); }, 1100);
  questRender();
}
$("btnQuest").onclick = () => {
  quest = { i: 0, streak: 0, best: 0, cur: randQ(), retryMode: false, retryList: [] };
  $("questMsg").textContent = ""; $("questMsg").className = "msg";
  questRender();
};
function renderWrong() {
  const el = $("wrongList");
  if (!data.wrong.length) { el.innerHTML = "<li>暂无错题，太厉害了！🌟</li>"; return; }
  el.innerHTML = data.wrong.slice().reverse().map(w => `<li>${w.q} → <b>${w.a}</b></li>`).join("");
}
$("btnWrongClear").onclick = () => { data.wrong = []; store.set(data); renderWrong(); };
$("btnWrongRetry").onclick = () => {
  if (!data.wrong.length) return;
  const w = data.wrong[data.wrong.length - 1];
  const num = Number(w.a);
  const isSym = ["＞", "＜", "="].includes(w.a);
  const ans = isSym ? w.a : (isNaN(num) ? w.a : num);
  const opts = isSym ? ["＞", "＜", "="] : salt([ans], 0, 20);
  quest = { i: 0, streak: 0, best: 0, cur: { q: w.q, a: ans, opts }, retryMode: true, retryList: [] };
  document.querySelector('[data-tab="quest"]').click();
  $("questMsg").textContent = "从最新错题开始练 🔁"; $("questMsg").className = "msg";
  questRender();
};
renderWrong();

// ---- 护照 ----
$("btnReset").onclick = () => {
  if (!confirm("确定清零星星吗？")) return;
  data = { total: 0, ten: 0, calc: 0, clock: 0, shape: 0, warm: 0, compare: 0, pattern: 0, money: 0, quest: 0, best: 0, wrong: [] };
  store.set(data); renderStars(); renderWrong();
};
$("btnSpeak").onclick = () => speak(`你已经得了${data.total}颗星，继续加油`);
renderStars();
