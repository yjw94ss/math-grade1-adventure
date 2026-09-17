// 示例广告组件（演示用）：无真实广告网络、无任何追踪上报
// 真实上线时把 demos 换成广告联盟代码即可，mount 位置不用动
window.AdSlot = (function () {
"use strict";
const demos = [
  { emoji: "📚", title: "《数学绘本乐园》全12册", desc: "示例广告 · 让孩子爱上数学的第一套绘本", cta: "看看详情" },
  { emoji: "💡", title: "护眼学习台灯 · 减蓝光", desc: "示例广告 · 每天15分钟，眼睛也要被照顾", cta: "了解更多" },
  { emoji: "📢", title: "广告位招租", desc: "示例广告 · 教辅 / 文具 / 课程，联系站长投放", cta: "联系合作" }
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
  el.querySelector(".ad-cta").onclick = (e) => { e.target.textContent = "示例广告 · 暂无跳转"; };
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
