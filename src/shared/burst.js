const PIECES = ["🎉", "✨", "⭐", "🎊"];

/** 正解した要素の中心から紙吹雪を飛ばす。1秒で自分を片付ける。 */
export function burst(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const box = document.createElement("div");
  box.className = "burst";
  for (let n = 0; n < 12; n++) {
    const s = document.createElement("span");
    s.textContent = PIECES[n % PIECES.length];
    s.style.left = r.left + r.width / 2 + "px";
    s.style.top = r.top + r.height / 2 + "px";
    s.style.setProperty("--dx", Math.random() * 260 - 130 + "px");
    s.style.setProperty("--dy", -Math.random() * 220 - 60 + "px");
    s.style.setProperty("--rot", Math.random() * 540 - 270 + "deg");
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 1000);
}
