/* めいろの盤面。座標は viewBox（100 x 150）の中の値。 */

export const W = 100;
export const H = 150;
export const BAR_H = 7;

export const START = { x: 50, y: 13 };
export const GOAL  = { x: 50, y: H - 13 };
export const HOLE  = 9;   // スタートとゴールの丸の大きさ

const MAX_ROWS = 5;       // かべはここまで増える
const MIN_GAP = 20;       // 穴はここまでしか狭くならない

export const TINTS = [
  "var(--color-red)",
  "var(--color-yellow)",
  "var(--color-green)",
  "var(--color-blue)",
  "var(--color-purple)",
];

/**
 * かべを横に渡し、1本につき1か所だけ穴を開ける。
 * 穴を通れば必ずゴールに着けるので、解けない面ができない。
 *
 * はじめの面はかべ 0 本。指でなぞる操作を覚えるための面で、まっすぐ引けばクリアできる。
 * そこから 1 本ずつ増えて、5 本まで。そのあとは穴が少しずつ狭くなる。
 */
export function makeLevel(stage) {
  const rows = Math.min(stage, MAX_ROWS);
  if (rows === 0) return [];

  const gap = Math.max(36 - (stage - 1) * 3, MIN_GAP);
  const top = 30;
  const bottom = H - 30 - BAR_H;

  return Array.from({ length: rows }, (_, i) => ({
    y: rows === 1 ? (top + bottom) / 2 : top + ((bottom - top) * i) / (rows - 1),
    gx: 5 + Math.random() * (W - 10 - gap),   // 穴の左端
    gap,
  }));
}

/** その点が、かべにぶつかっているか */
export const hitsBar = (p, bar) =>
  p.y >= bar.y && p.y <= bar.y + BAR_H &&
  (p.x < bar.gx || p.x > bar.gx + bar.gap);

const near = (p, c, r) => (p.x - c.x) ** 2 + (p.y - c.y) ** 2 <= r * r;

export const atGoal = p => near(p, GOAL, HOLE);
export const atStart = p => near(p, START, HOLE + 3);

/** 指を速く動かしてもすり抜けないよう、前の点との間を細かく調べる */
export function* between(a, b) {
  const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 1.2));
  for (let s = 1; s <= steps; s++) {
    yield { x: a.x + ((b.x - a.x) * s) / steps, y: a.y + ((b.y - a.y) * s) / steps };
  }
}

/** 足あとの間隔と、道の中心からの左右のずれ */
const STEP = 7;
const OFF = 2.6;

/**
 * なぞった線に沿って、足あとを左右かわりばんこに置く場所を出す。
 * すでに置いた分は使い回して、続きだけ足す。
 */
export function addPrints(prints, from, to, carry, side) {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  let travelled = carry + d;
  let s = side;

  while (travelled >= STEP && d > 0) {
    travelled -= STEP;
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    prints.push({
      x: to.x - Math.sin(ang) * OFF * s,
      y: to.y + Math.cos(ang) * OFF * s,
      deg: (ang * 180) / Math.PI + 90,   // 足あとは進む向きに合わせて回す
    });
    s = -s;
  }
  return { carry: travelled, side: s };
}
