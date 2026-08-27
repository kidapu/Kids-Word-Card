import { useCallback, useEffect, useRef, useState } from "react";
import { SIZE, INK_WIDTH, makeSurface, drawLetter, strokeInk, measure } from "../trace.js";
import { burst } from "../../shared/burst.js";
import { ding } from "../../shared/sfx.js";

/**
 * 手本の文字を薄く出して、その上を指でなぞる。
 * 何度なぞってもよくて、文字が塗れたらクリア。筆順は問わない。
 *
 * 判定は「文字を塗れた割合」と「線が文字に乗っている割合」の2つ。
 * 後者があるので、画面を塗りつぶすだけではクリアできない。
 */
export function TraceBoard({ letter, eraseSeed, onClear, onProgress }) {
  const view = useRef(null);        // 画面に出す面
  const guide = useRef(null);       // 手本の文字だけの面（判定用）
  const ink = useRef(null);         // なぞった線だけの面（判定用）
  const drawing = useRef(false);
  const done = useRef(false);
  const last = useRef(null);
  const timer = useRef(null);
  const [cleared, setCleared] = useState(false);

  /** 画面の面を描き直す。手本を薄く、その上になぞった線を重ねる。 */
  const repaint = useCallback(() => {
    const ctx = view.current.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.globalAlpha = cleared ? 0.32 : 0.16;
    ctx.drawImage(guide.current, 0, 0);
    ctx.globalAlpha = 1;

    // なぞった線は、文字に乗っているところだけ色を変えて見せる
    ctx.drawImage(ink.current, 0, 0);
  }, [cleared]);

  /** 文字が変わったら、手本を描き直してなぞりを消す */
  useEffect(() => {
    if (!guide.current) { guide.current = makeSurface(); ink.current = makeSurface(); }
    drawLetter(guide.current.getContext("2d"), letter);
    ink.current.getContext("2d").clearRect(0, 0, SIZE, SIZE);
    drawing.current = false;
    done.current = false;
    last.current = null;
    setCleared(false);
    onProgress?.(0);
    repaint();
  }, [letter, repaint, onProgress]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const erase = useCallback(() => {
    if (done.current) return;
    ink.current.getContext("2d").clearRect(0, 0, SIZE, SIZE);
    last.current = null;
    onProgress?.(0);
    repaint();
  }, [repaint, onProgress]);

  // 親の「けす」ボタンが押されたら消す
  useEffect(() => { if (eraseSeed) erase(); }, [eraseSeed, erase]);

  const toLocal = e => {
    const r = view.current.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * SIZE,
      y: ((e.clientY - r.top) / r.height) * SIZE,
    };
  };

  const check = () => {
    const m = measure(guide.current.getContext("2d"), ink.current.getContext("2d"));
    onProgress?.(m.cover);
    if (m.done && !done.current) {
      done.current = true;
      setCleared(true);
      ding();
      burst(view.current);
      timer.current = setTimeout(onClear, 1200);
    }
  };

  const down = e => {
    if (done.current) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 拾えなくても続けられる */ }
    drawing.current = true;
    const p = toLocal(e);
    last.current = p;
    // 点を置いただけでも印が残るように、その場に短い線を引く
    strokeInk(ink.current.getContext("2d"), p, p);
    repaint();
  };

  const move = e => {
    if (!drawing.current || done.current) return;
    const p = toLocal(e);
    strokeInk(ink.current.getContext("2d"), last.current, p);
    last.current = p;
    repaint();
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    check();
  };

  return (
    <canvas
      ref={view}
      width={SIZE}
      height={SIZE}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{ touchAction: "none" }}
      className={
        "mx-auto block h-[min(66svh,30rem)] w-[min(66svh,30rem)] rounded-[26px] bg-paper-soft " +
        "shadow-[0_7px_0_rgba(20,40,50,.12),0_12px_20px_rgba(20,40,50,.12)] " +
        (cleared ? "animate-yay" : "")
      }
    />
  );
}

export { INK_WIDTH };
