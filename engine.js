// 数学小探险家 · 通用引擎
// 每个年级页先定义全局 GRADE，再引入本文件：
// GRADE = { n, title, subtitle, storeKey, tasks[], roadmap[], questCount,
//           modules:[{id,tab,title,hint,type:'options'|'pad'|'custom',
//                     padMax,levels:[{v,label}],gen(level,last),render(ctx)}],
//           makers:[()=>({q,a,opts})] }
(function () {
"use strict";
if (typeof GRADE === "undefined") { document.body.innerHTML = "<p>缺少年级配置 GRADE</p>"; return; }
document.body.dataset.grade = GRADE.n;

// ---------- 工具 ----------
const H = {
  r: (n) => Math.floor(Math.random() * n),
  ri: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  shuf: (arr) => [...arr].sort(() => Math.random() - 0.5),
  salt: (right, lo, hi) => {
    const s = new Set(right.map(String));
    let guard = 0;
    while (s.size < 4 && guard++ < 80) s.add(String(H.ri(lo, hi)));
    return H.shuf([...s]).map((x) => (/^-?\d+$/.test(x) ? Number(x) : x));
  }
};
window.H = H;
const $ = (id) => document.getElementById(id);

// 数学排版：分数堆叠、上标、根号加横线、单个小写字母变斜体（纯展示，不影响答案比对）
function pretty(s) {
  s = String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(^|[^A-Za-z])([a-z])(?![A-Za-z])/g, "$1<i>$2</i>")
    .replace(/\^(-?\d+)/g, "<sup>$1</sup>")
    .replace(/√(\d+|\([^()]*\))/g, "√<span class=\"rad\">$1</span>")
    .replace(/(\d+)\s*\/\s*(\d+)/g, "<span class=\"frac\"><span>$1</span><span>$2</span></span>")
    .replace(/(\d+)\s*\/\s*(\([^()]*\))/g, "<span class=\"frac\"><span>$1</span><span>$2</span></span>");
  return s;
}
window.__pretty = pretty; // 测试钩子

// ---------- 存档（每个年级独立） ----------
const store = {
  get() { try { return JSON.parse(localStorage.getItem(GRADE.storeKey) || "{}"); } catch { return {}; } },
  set(d) { try { localStorage.setItem(GRADE.storeKey, JSON.stringify(d)); } catch {} }
};
let data = Object.assign({ total: 0, best: 0, wrong: [] }, store.get());
if (!Array.isArray(data.wrong)) data.wrong = [];
function save() { store.set(data); }

function speak(t) {
  try {
    if (typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "zh-CN"; u.rate = 0.95;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch {}
}
function addStar(key) {
  data[key] = (data[key] || 0) + 1;
  data.total += 1;
  save(); renderStars();
  return "太棒了！+1⭐";
}
function renderStars() {
  $("starTotal").textContent = data.total;
  $("pTotal").textContent = data.total;
  $("pList").innerHTML = GRADE.modules.map((m) =>
    `<li>${m.tab}：${data[m.id] || 0} ⭐</li>`).join("") +
    `<li>闯关：${data.quest || 0} ⭐ · 历史最佳连击：${data.best || 0} 🔥</li>`;
}

// ---------- 页签骨架 ----------
const tabsEl = $("tabs"), mainEl = $("main");
function addTab(id, label, active) {
  const b = document.createElement("button");
  b.dataset.tab = id; b.textContent = label;
  if (active) b.classList.add("active");
  tabsEl.appendChild(b);
}
function addPanel(id, active) {
  const s = document.createElement("section");
  s.id = "tab-" + id; s.className = "panel" + (active ? " active" : "");
  mainEl.appendChild(s);
  return s;
}
tabsEl.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  tabsEl.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  mainEl.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
  $("tab-" + b.dataset.tab).classList.add("active");
});
function card(parent, html) {
  const d = document.createElement("div");
  d.className = "card"; d.innerHTML = html;
  parent.appendChild(d);
  return d;
}

// ---------- 首页 ----------
addTab("home", "🏠 今天玩什么", true);
(function home() {
  const p = addPanel("home", true);
  const hero = card(p, `<h1>${GRADE.title} · 每天15分钟，玩着学数学</h1><p>${GRADE.subtitle}，不刷题、不计时、不批评。</p>
    <div class="steps"><div><b>3分钟</b><span>热身骰子</span></div><div><b>7分钟</b><span>1个新挑战</span></div><div><b>5分钟</b><span>生活小任务</span></div></div>
    <button class="big-btn" id="btnWarmup">🎲 开始3分钟热身</button>
    <div id="warmupArea" class="game-area hidden">
      <div class="dice-row"><div class="dice" id="diceA">⚀</div><div class="vs">VS</div><div class="dice" id="diceB">⚅</div></div>
      <p style="text-align:center">哪个大？点一点！</p>
      <div class="row"><button class="opt" id="warmLeft">左边大</button><button class="opt" id="warmRight">右边大</button><button class="opt" id="warmEqual">一样大</button></div>
      <p id="warmupMsg" class="msg"></p></div>`);
  const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  let A = 1, B = 6;
  const fresh = () => {
    A = H.ri(1, 6); B = H.ri(1, 6);
    hero.querySelector("#diceA").textContent = faces[A - 1];
    hero.querySelector("#diceB").textContent = faces[B - 1];
    const m = hero.querySelector("#warmupMsg"); m.textContent = ""; m.className = "msg";
  };
  hero.querySelector("#btnWarmup").onclick = () => { hero.querySelector("#warmupArea").classList.remove("hidden"); fresh(); };
  const guess = (g) => {
    const ok = (g === "l" && A > B) || (g === "r" && B > A) || (g === "e" && A === B);
    const m = hero.querySelector("#warmupMsg");
    if (ok) { m.textContent = "答对啦！🎉 " + addStar("warm"); m.className = "msg good"; speak("答对了，真厉害"); setTimeout(fresh, 900); }
    else { m.textContent = "再看看，数一数点点 😊"; m.className = "msg bad"; }
  };
  hero.querySelector("#warmLeft").onclick = () => guess("l");
  hero.querySelector("#warmRight").onclick = () => guess("r");
  hero.querySelector("#warmEqual").onclick = () => guess("e");
  const tc = card(p, `<h2>📋 今日探险任务（家长读一遍）</h2><ol id="todayTasks" class="tasks"></ol><button class="small-btn" id="btnNewTasks">🔄 换一组任务</button>`);
  const labels = ["热身3分", "挑战7分", "生活5分"];
  const newTasks = () => {
    tc.querySelector("#todayTasks").innerHTML = H.shuf(GRADE.tasks).slice(0, 3)
      .map((t, i) => `<li><b>${labels[i]}：</b>${t}</li>`).join("");
  };
  tc.querySelector("#btnNewTasks").onclick = newTasks;
  newTasks();
  card(p, `<div class="card tip" style="box-shadow:none;margin:0;padding:0"><h2>💡 家长3句话</h2><p>“你怎么想的？”“还有别的方法吗？”“错了也没事，我们看看卡在哪。”</p></div>`);
  if (window.AdSlot) window.AdSlot.mountHome(p); // 示例广告位（演示用）
})();

// ---------- 标准模块 ----------
function paintOpts(mod, box, q) {
  if (q.display !== undefined) { box.dsp.innerHTML = pretty(q.display); box.dsp.style.display = ""; }
  else box.dsp.style.display = "none";
  box.q.innerHTML = pretty(q.q);
  box.vis.textContent = q.visual || "";
  box.vis.style.display = q.visual ? "" : "none";
  box.ext.innerHTML = q.extra || "";
  box.msg.textContent = ""; box.msg.className = "msg";
  box.opts.innerHTML = "";
  q.opts.forEach((v) => {
    const b = document.createElement("button");
    b.className = "opt"; b.innerHTML = pretty(v); b.dataset.raw = v;
    b.onclick = () => {
      if (String(v) === String(q.a)) {
        b.classList.add("correct");
        box.msg.textContent = H.pick(["答对啦！🎉 ", "太厉害了！🎉 ", "完全正确！🎉 "]) + addStar(mod.id);
        box.msg.className = "msg good"; speak("答对了");
        setTimeout(() => mod._next(box, q.q), 900);
      } else {
        b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 650);
        box.msg.textContent = (mod.retry || "再想一想 💪"); box.msg.className = "msg bad";
      }
    };
    box.opts.appendChild(b);
  });
}
GRADE.modules.forEach((mod) => {
  addTab(mod.id, mod.tab);
  const p = addPanel(mod.id);
  const c = card(p, `<h2>${mod.title}</h2>
    ${mod.levels ? `<div class="row">${mod.levels.map((l, i) => `<label><input type="radio" name="lv-${mod.id}" value="${l.v}"${i === 0 ? " checked" : ""} /> ${l.label}</label>`).join("")}</div>` : ""}
    <div class="big-num" id="dsp-${mod.id}"></div>
    <div class="big-num small" id="q-${mod.id}"></div>
    <div class="dots" id="vis-${mod.id}"></div>
    <div class="shop" id="ext-${mod.id}"></div>
    <div class="row" id="opts-${mod.id}"></div>
    <p id="msg-${mod.id}" class="msg"></p>
    ${mod.hint ? `<p class="hint">${mod.hint}</p>` : ""}`);
  const box = {};
  ["dsp", "q", "vis", "ext", "opts", "msg"].forEach((k) => {
    box[k] = c.querySelector("#" + k + "-" + mod.id);
  });
  // 数字键盘模块
  if (mod.type === "pad") {
    const level = () => { const r = c.querySelector(`input[name="lv-${mod.id}"]:checked`); return r ? r.value : null; };
    mod._next = () => {
      const q = mod.gen(level(), mod._last);
      mod._last = q.q;
      if (q.display !== undefined) { box.dsp.innerHTML = pretty(q.display); box.dsp.style.display = ""; } else box.dsp.style.display = "none";
      box.q.innerHTML = pretty(q.q);
      box.vis.textContent = q.visual || ""; box.vis.style.display = q.visual ? "" : "none";
      box.msg.textContent = ""; box.msg.className = "msg";
      box.padAns = q.a;
    };
    const pad = document.createElement("div");
    pad.className = "pad";
    const max = mod.padMax || 20;
    for (let i = 0; i <= max; i++) {
      const b = document.createElement("button");
      b.textContent = i;
      b.onclick = () => {
        if (i === box.padAns) {
          b.classList.add("correct");
          box.msg.textContent = "答对啦！🎉 " + addStar(mod.id);
          box.msg.className = "msg good"; speak("答对了");
          setTimeout(() => mod._next(), 900);
        } else {
          b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 650);
          box.msg.textContent = (mod.retry || "再摆一摆试试 💪"); box.msg.className = "msg bad";
        }
      };
      pad.appendChild(b);
    }
    box.opts.replaceWith(pad);
    c.querySelectorAll(`input[name="lv-${mod.id}"]`).forEach((r) => (r.onchange = () => mod._next()));
    mod._next();
    return;
  }
  // 配对模块（连线）：gen -> {q, pairs:[[左,右],...]}
  if (mod.type === "match") {
    const level = () => { const r = c.querySelector(`input[name="lv-${mod.id}"]:checked`); return r ? r.value : null; };
    mod._next = () => {
      const g = mod.gen(level(), mod._last);
      mod._last = g.q;
      box.dsp.style.display = "none";
      box.q.innerHTML = pretty(g.q || "左边点一个，右边找配对");
      box.vis.style.display = "none"; box.ext.innerHTML = "";
      box.msg.textContent = ""; box.msg.className = "msg";
      box.opts.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "match-wrap";
      const lc = document.createElement("div"); lc.className = "match-col";
      const rc = document.createElement("div"); rc.className = "match-col";
      wrap.appendChild(lc); wrap.appendChild(rc); box.opts.appendChild(wrap);
      let sel = null, done = 0;
      const total = g.pairs.length;
      g.pairs.forEach(([l], i) => {
        const b = document.createElement("button");
        b.className = "opt"; b.innerHTML = pretty(l); b.dataset.side = "L"; b.dataset.k = i;
        b.onclick = () => {
          if (b.disabled) return;
          lc.querySelectorAll(".opt").forEach((x) => x.classList.remove("sel"));
          b.classList.add("sel"); sel = i;
        };
        lc.appendChild(b);
      });
      H.shuf(g.pairs.map((_, i) => i)).forEach((i) => {
        const b = document.createElement("button");
        b.className = "opt"; b.innerHTML = pretty(g.pairs[i][1]); b.dataset.side = "R"; b.dataset.k = i;
        b.onclick = () => {
          if (b.disabled) return;
          if (sel === null) { box.msg.textContent = "先点左边一个 👈"; box.msg.className = "msg bad"; return; }
          if (Number(b.dataset.k) === sel) {
            b.classList.add("correct"); b.disabled = true;
            const lb = lc.querySelector('[data-k="' + sel + '"]');
            if (lb) { lb.classList.add("correct"); lb.classList.remove("sel"); lb.disabled = true; }
            sel = null; done++;
            if (done >= total) {
              box.msg.textContent = "全部配对成功！🎉 " + addStar(mod.id);
              box.msg.className = "msg good"; speak("全部配对成功");
              setTimeout(() => mod._next(), 1100);
            } else { box.msg.textContent = `配对成功 ${done}/${total} ✅`; box.msg.className = "msg good"; }
          } else {
            b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 650);
            box.msg.textContent = (mod.retry || "再想想，这两个是一对吗？"); box.msg.className = "msg bad";
          }
        };
        rc.appendChild(b);
      });
    };
    c.querySelectorAll(`input[name="lv-${mod.id}"]`).forEach((r) => (r.onchange = () => mod._next()));
    mod._next();
    return;
  }
  // 排序模块：gen -> {q, cards:[{t:显示, v:数值}], dir:'asc'|'desc'}
  if (mod.type === "order") {
    const level = () => { const r = c.querySelector(`input[name="lv-${mod.id}"]:checked`); return r ? r.value : null; };
    mod._next = () => {
      const g = mod.gen(level(), mod._last);
      mod._last = g.q;
      box.dsp.style.display = "none";
      box.q.innerHTML = pretty(g.q);
      box.vis.style.display = "none"; box.ext.innerHTML = "";
      box.msg.textContent = ""; box.msg.className = "msg";
      box.opts.innerHTML = "";
      const sorted = [...g.cards].sort((a, b) => (g.dir === "desc" ? b.v - a.v : a.v - b.v));
      mod._order = { seq: sorted.map((x) => x.t) };
      let idx = 0;
      H.shuf(g.cards).forEach((card) => {
        const b = document.createElement("button");
        b.className = "opt"; b.innerHTML = pretty(card.t); b.dataset.t = card.t;
        b.onclick = () => {
          if (b.disabled) return;
          if (card.t === mod._order.seq[idx]) {
            b.classList.add("correct"); b.disabled = true; idx++;
            if (idx >= mod._order.seq.length) {
              box.msg.textContent = "排序正确！🎉 " + addStar(mod.id);
              box.msg.className = "msg good"; speak("排序正确");
              setTimeout(() => mod._next(), 1100);
            }
          } else {
            b.classList.add("wrong"); setTimeout(() => b.classList.remove("wrong"), 650);
            box.msg.textContent = (mod.retry || "顺序不对，再看看 👀"); box.msg.className = "msg bad";
          }
        };
        box.opts.appendChild(b);
      });
    };
    c.querySelectorAll(`input[name="lv-${mod.id}"]`).forEach((r) => (r.onchange = () => mod._next()));
    mod._next();
    return;
  }
  // 真题库模块：mod.bank = [{q, a, opts, src, tip}]，不放回抽完一轮
  if (mod.type === "bank") {
    if (!box.tip) { box.tip = document.createElement("p"); box.tip.className = "hint"; box.tip.style.textAlign = "left"; c.appendChild(box.tip); }
    mod._next = () => {
      if (!mod._queue || !mod._queue.length) {
        mod._queue = H.shuf(mod.bank.map((_, i) => i));
        mod._right = 0;
      }
      const it = mod.bank[mod._queue[mod._queue.length - 1]];
      mod._bank = { cur: it };
      box.dsp.style.display = "none";
      box.q.innerHTML = pretty(it.q);
      box.vis.style.display = "none";
      box.ext.innerHTML = `<div>📜 ${it.src}</div><div>真题 ${mod.bank.length - mod._queue.length + 1}/${mod.bank.length} · 已答对 ${mod._right}</div>`;
      box.msg.textContent = ""; box.msg.className = "msg";
      box.tip.textContent = "";
      box.opts.innerHTML = "";
      it.opts.forEach((v) => {
        const b = document.createElement("button");
        b.className = "opt"; b.innerHTML = pretty(v); b.dataset.raw = v;
        b.onclick = () => {
          box.opts.querySelectorAll(".opt").forEach((x) => (x.disabled = true));
          mod._queue.pop();
          if (String(v) === String(it.a)) {
            b.classList.add("correct"); mod._right++;
            box.msg.textContent = "真题拿下！🎉 " + addStar(mod.id);
            box.msg.className = "msg good"; speak("答对了");
          } else {
            b.classList.add("wrong");
            box.msg.textContent = `正确答案是 ${it.a} 📝`;
            box.msg.className = "msg bad";
          }
          box.tip.innerHTML = "💡 解析：" + pretty(it.tip);
          setTimeout(() => mod._next(), 2800);
        };
        box.opts.appendChild(b);
      });
    };
    mod._next();
    return;
  }
  // 自定义模块（钟表等）
  if (mod.type === "custom") {
    mod.render({ box, card: c, addStar, speak, H, data, save });
    return;
  }
  // 选择题模块
  const level = () => { const r = c.querySelector(`input[name="lv-${mod.id}"]:checked`); return r ? r.value : null; };
  mod._next = (b, last) => paintOpts(mod, box, mod.gen(level(), last));
  c.querySelectorAll(`input[name="lv-${mod.id}"]`).forEach((r) => (r.onchange = () => mod._next(box)));
  mod._next(box);
});

// ---------- 闯关 ----------
const QN = GRADE.questCount || 10;
addTab("quest", `🏆 闯关${QN}题`);
(function quest() {
  const p = addPanel("quest");
  card(p, `<h2>🏆 闯关${QN}题：混合大挑战</h2><p class="hint">各模块随机抽题，不重复刷题</p>
    <div class="progress"><div id="questBar"></div></div>
    <p id="questInfo" style="text-align:center"></p>
    <div class="big-num small" id="questQ">点开始吧！</div>
    <div class="row" id="questOpts"></div>
    <p id="questMsg" class="msg"></p>
    <div class="row"><button class="big-btn" id="btnQuest">🚀 开始闯关</button></div>`);
  card(p, `<h2>📝 错题本（只记闯关错的）</h2><ul id="wrongList" class="plist"></ul>
    <div class="row"><button class="small-btn" id="btnWrongRetry">🔁 重练错题</button><button class="small-btn danger" id="btnWrongClear">🗑 清空错题</button></div>`);
  let st = { i: 0, streak: 0, best: 0, cur: null };
  const randQ = (exclude) => {
    for (let t = 0; t < 30; t++) {
      const q = H.pick(GRADE.makers)();
      if (!exclude || q.q !== exclude) return q;
    }
    return GRADE.makers[0]();
  };
  const render = () => {
    $("questBar").style.width = (st.i / QN * 100) + "%";
    $("questInfo").textContent = st.i >= QN ? `完成！${QN}题闯关结束，最高连击 x${st.best} 🔥` : (st.cur ? `第 ${st.i + 1}/${QN} 题，连击 x${st.streak}` : `共 ${QN} 题，点开始`);
    if (st.i >= QN) { $("questQ").textContent = "🎉 通关！+5⭐"; $("questOpts").innerHTML = ""; return; }
    if (!st.cur) return;
    $("questQ").innerHTML = pretty(st.cur.q);
    $("questOpts").innerHTML = "";
    st.cur.opts.forEach((v) => {
      const b = document.createElement("button");
      b.className = "opt"; b.innerHTML = pretty(v); b.dataset.raw = v;
      b.onclick = () => answer(v);
      $("questOpts").appendChild(b);
    });
  };
  const pushWrong = (q, a) => {
    data.wrong.push({ q, a: String(a) });
    if (data.wrong.length > 30) data.wrong = data.wrong.slice(-30);
    save(); renderWrong();
  };
  const answer = (v) => {
    const m = $("questMsg");
    if (String(v) === String(st.cur.a)) {
      st.streak++; st.best = Math.max(st.best, st.streak);
      m.textContent = (st.streak >= 3 ? `🔥 ${st.streak}连击！` : "答对啦！🎉 ") + addStar("quest");
      m.className = "msg good"; speak(st.streak >= 3 ? st.streak + "连击" : "答对了");
    } else {
      m.textContent = `不对哦，答案是 ${st.cur.a}，已记入错题本 📝`;
      m.className = "msg bad";
      pushWrong(st.cur.q, st.cur.a);
      st.streak = 0;
    }
    st.i++;
    if (st.i >= QN) {
      for (let k = 0; k < 5; k++) addStar("quest");
      data.best = Math.max(data.best || 0, st.best); save(); renderStars();
      speak("闯关成功");
    } else st.cur = randQ(st.cur.q);
    render();
    if (st.i < QN) setTimeout(() => { m.textContent = ""; m.className = "msg"; }, 1000);
  };
  $("btnQuest").onclick = () => {
    st = { i: 0, streak: 0, best: 0, cur: randQ() };
    $("questMsg").textContent = ""; $("questMsg").className = "msg";
    render();
  };
  window.__questCur = () => st.cur; // 测试钩子：读当前闯关题
  function renderWrong() {
    const el = $("wrongList");
    if (!data.wrong.length) { el.innerHTML = "<li>暂无错题，太厉害了！🌟</li>"; return; }
    el.innerHTML = data.wrong.slice().reverse().map((w) => `<li>${w.q} → <b>${w.a}</b></li>`).join("");
  }
  window.__renderWrong = renderWrong;
  $("btnWrongClear").onclick = () => { data.wrong = []; save(); window.__renderWrong(); };
  $("btnWrongRetry").onclick = () => {
    if (!data.wrong.length) return;
    const w = data.wrong[data.wrong.length - 1];
    const sym = ["＞", "＜", "="].includes(w.a);
    const num = Number(w.a);
    const ans = sym ? w.a : (isNaN(num) ? w.a : num);
    st = { i: 0, streak: 0, best: 0, cur: { q: w.q, a: ans, opts: sym ? ["＞", "＜", "="] : H.salt([ans], 0, 20) } };
    document.querySelector('[data-tab="quest"]').click();
    $("questMsg").textContent = "从最新错题开始练 🔁"; $("questMsg").className = "msg";
    render();
  };
  render(); window.__renderWrong();
})();

// ---------- 护照 ----------
addTab("passport", "🛂 我的护照");
(function passport() {
  const p = addPanel("passport");
  card(p, `<h2>🛂 我的探险护照 · ${GRADE.title}</h2><p>总星星：<b id="pTotal">0</b> ⭐</p><ul id="pList" class="plist"></ul>
    <div class="row"><button class="small-btn" id="btnSpeak">🔊 读出表扬</button><button class="small-btn danger" id="btnReset">🗑 清零重来</button></div>`);
  card(p, `<h2>🗓 本年级路线图</h2><ol class="tasks small">${GRADE.roadmap.map((t) => `<li>${t}</li>`).join("")}</ol>
    <p class="hint">每周记录一句：能讲清道理吗？愿意再试一次吗？</p><div class="row"><a class="small-btn" style="text-decoration:none;color:inherit" href="index.html">‹ 返回年级大厅</a></div>`);
  $("btnReset").onclick = () => {
    if (typeof confirm !== "undefined" && !confirm("确定清零本年级星星吗？")) return;
    const keep = GRADE.storeKey;
    data = { total: 0, best: 0, wrong: [] };
    try { localStorage.setItem(keep, JSON.stringify(data)); } catch {}
    renderStars(); window.__renderWrong();
  };
  $("btnSpeak").onclick = () => speak(`你已经得了${data.total}颗星，继续加油`);
})();

renderStars();
})();
