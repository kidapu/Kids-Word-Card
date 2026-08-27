import { nameOf } from "../colors.js";
import { other } from "../../shared/lang.js";

/**
 * いろ1つ。カードそのものがその色になる。
 * showName を渡すと色の名前を重ねて出す（クイズでは答えが見えるので出さない）。
 * しろは背景と同化するので、どの色にも薄い縁をつけている。
 */
export function ColorCard({ color, lang = "en", showName = false, talking = false,
                           onClick, className = "", style, ...rest }) {
  const text = color.dark ? "text-white" : "text-ink";
  // にじいろは下地の明るさがまちまちなので、文字に影をつけて読めるようにする
  const glow = color.glow ? "[text-shadow:0_1px_4px_rgba(0,0,0,.55)]" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ "--tint": color.shade, background: color.fill, ...style }}
      className={
        "pressable flex aspect-square w-full flex-col items-center justify-center gap-0.5 " +
        "rounded-[22px] font-round cursor-pointer " +
        "border border-black/10 " + text + " " + glow + " " + className
      }
      {...rest}
    >
      {showName && (
        <>
          <span
            className={"text-[clamp(17px,4.5vw,24px)] font-extrabold " +
                       (talking ? "animate-wobble" : "")}
          >
            {nameOf(color, lang)}
          </span>
          <span className="text-xs font-bold opacity-70">{nameOf(color, other(lang))}</span>
        </>
      )}
    </button>
  );
}
