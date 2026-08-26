import { TINTS } from "../letters.js";

/** もじ1つ。押すと発音する。 */
export function Letter({ letter, row, onClick, delay = 0, className = "", ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        "--tint": TINTS[row % TINTS.length],
        animationDelay: delay ? `${delay}ms` : undefined,
      }}
      className={
        "pressable flex aspect-square w-full items-center justify-center rounded-[22px] " +
        "border-0 bg-paper-soft font-round font-extrabold text-ink cursor-pointer " +
        className
      }
      {...rest}
    >
      <span className="text-[clamp(34px,9vw,64px)] leading-none">{letter}</span>
    </button>
  );
}
