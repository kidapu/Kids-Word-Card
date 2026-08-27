/* なぞりの判定。
   文字だけを描いた面と、なぞった線だけを描いた面を重ねて、
   「文字をどれだけ塗れたか」と「線が文字からどれだけ外れていないか」を見る。 */

export const SIZE = 600;          // 判定に使う面の大きさ（正方形）
export const FONT_SIZE = 460;     // 文字の大きさ
export const INK_WIDTH = 46;      // なぞる線の太さ

/** どのくらい塗れたらクリアか */
const COVER = 0.72;
/** 線のうち、これだけ文字に乗っていること（画面を塗りつぶすだけでは通らないように） */
const ACCURACY = 0.45;

const FONT =
  '"Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN", "Zen Maru Gothic", ' +
  '"Rounded Mplus 1c", system-ui, sans-serif';

/** 面をひとつ作る（画面には出さない） */
export function makeSurface() {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  return c;
}

/** 手本の文字を描く */
export function drawLetter(ctx, letter) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.font = `${FONT_SIZE}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  // 中心よりわずかに下げると、ひらがなの見た目の重心に合う
  ctx.fillText(letter, SIZE / 2, SIZE / 2 + FONT_SIZE * 0.04);
}

/** なぞった線を1本描き足す（色は判定に関係ない。濃さだけ見ている） */
export function strokeInk(ctx, from, to) {
  ctx.strokeStyle = "#3C82BE";
  ctx.lineWidth = INK_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

/**
 * 塗れ具合を数える。全部の点を見ると重いので、4 つおきに拾っている。
 * → { cover: 文字を塗れた割合, accuracy: 線が文字に乗っている割合, done: クリアか }
 */
export function measure(letterCtx, inkCtx) {
  const a = letterCtx.getImageData(0, 0, SIZE, SIZE).data;
  const b = inkCtx.getImageData(0, 0, SIZE, SIZE).data;

  let letterPx = 0, coveredPx = 0, inkPx = 0, inkOnLetter = 0;
  const step = 4 * 4;   // 1 画素 4 バイト × 4 画素とばし
  for (let i = 3; i < a.length; i += step) {
    const onLetter = a[i] > 40;
    const onInk = b[i] > 40;
    if (onLetter) { letterPx++; if (onInk) coveredPx++; }
    if (onInk) { inkPx++; if (onLetter) inkOnLetter++; }
  }

  const cover = letterPx ? coveredPx / letterPx : 0;
  const accuracy = inkPx ? inkOnLetter / inkPx : 0;
  return { cover, accuracy, done: cover >= COVER && accuracy >= ACCURACY };
}
