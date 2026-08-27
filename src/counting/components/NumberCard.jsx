import { TINTS } from "../counting.js";

/**
 * 数字1つ。dots を付けると、その数だけ丸が並んで「いくつ分か」が目で分かる。
 * 形（正方形にするかどうか）は使う側が className で決める。
 */
export function NumberCard({ n, dots = false, talking = false, onClick, className = "",
                             style, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ "--tint": TINTS[(n - 1) % TINTS.length], ...style }}
      className={
        "pressable flex flex-col items-center justify-center gap-1 rounded-[22px] " +
        "border-0 bg-paper-soft py-4 font-round font-extrabold text-ink cursor-pointer " +
        className
      }
      {...rest}
    >
      <span
        className={"text-[clamp(40px,11vw,76px)] leading-none " + (talking ? "animate-wobble" : "")}
      >
        {n}
      </span>
      {dots && (
        <span className="flex max-w-[5.5rem] flex-wrap justify-center gap-[3px]">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-[var(--tint)]" />
          ))}
        </span>
      )}
    </button>
  );
}
