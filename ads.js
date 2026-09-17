// 示例广告组件（演示用）：无真实广告网络、无任何追踪上报
// 真实上线时把 demos 换成广告联盟代码即可，mount 位置不用动
window.AdSlot = (function () {
"use strict";
// 品牌广告：奥数真功夫（荆门奥数中心自有课程）
// 要换文案只改 demos；要加跳转把 link 填上，CTA 会自动跳
const demos = [
  { emoji: "🏆", title: "奥数真功夫", desc: "荆门奥数中心 · 分层教学小班精讲 · 首次试听免费", cta: "预约免费试听", link: "" }
];
function mount(el) {
  const d = demos[Math.floor(Math.random() * demos.length)];
  el.innerHTML =
    `<button class="ad-close" aria-label="关闭广告">×</button>` +
    `<span class="ad-badge">广告</span>` +
    `<div class="ad-emoji">${d.emoji}</div>` +
    `<div class="ad-body"><div class="ad-title">${d.title}</div>` +
    `<div class="ad-desc">${d.desc}</div></div>` +
    `<button class="ad-cta">${d.cta}</button>`;
  el.querySelector(".ad-close").onclick = () => { el.style.display = "none"; };
  el.querySelector(".ad-cta").onclick = (e) => {
    if (d.link) { window.location.href = d.link; return; }
    e.target.textContent = "请到校区咨询，预约免费试听";
  };
}
function makeSlot() {
  const d = document.createElement("div");
  d.className = "card ad-slot";
  return d;
}
return {
  // 年级页首页末尾挂一个
  mountHome(panel) { const s = makeSlot(); panel.appendChild(s); mount(s); },
  // 大厅年级宫格里占一整行
  mountHub(grid) { const s = makeSlot(); s.style.gridColumn = "1 / -1"; s.style.margin = "0"; grid.appendChild(s); mount(s); }
};
})();
