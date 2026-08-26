import { TINT } from "../cards.js";

/**
 * カード1枚。hideEn を渡すと英語の文字を隠す（クイズで絵と音だけで当てさせる）。
 * delay は「シャッフル後に順番に配られる」演出のためのもの。
 */
export function Card({ card, onClick, hideEn = false, delay = 0, className = "",
                       artClassName = "text-[clamp(46px,11vw,72px)]", ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ "--tint": TINT[card.cat], animationDelay: delay ? `${delay}ms` : undefined }}
      className={
        "pressable relative flex flex-col items-center gap-1.5 rounded-[22px] " +
        "border-0 bg-paper-soft px-3 pt-5 pb-4 font-round text-ink cursor-pointer " +
        className
      }
      {...rest}
    >
      <span className={artClassName + " leading-none [filter:drop-shadow(0_3px_4px_rgba(0,0,0,.12))]"}>
        {card.art}
      </span>
      {!hideEn && (
        <span className="text-[17px] font-extrabold tracking-[.01em]">{card.en}</span>
      )}
      <span className="text-xs font-bold text-ink-soft">{card.ja}</span>
    </button>
  );
}
