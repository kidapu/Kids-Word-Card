import { useEffect } from "react";
import { TINT } from "../cards.js";

/** カードを拡大して、英語 / にほんご を聞き分ける画面。 */
export function CardDetail({ card, talking, onSay, onClose }) {
  // 開いたら英語を自動で1回鳴らす
  useEffect(() => { onSay(card.en, "en-US"); }, [card, onSay]);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      className="animate-fade fixed inset-0 z-20 flex items-center justify-center
                 bg-[rgba(24,42,48,.55)] p-6 backdrop-blur-[4px]"
    >
      <div
        style={{ "--tint": TINT[card.cat] }}
        className="animate-pop relative w-[min(420px,100%)] rounded-[34px] bg-paper-soft
                   px-6 pt-8 pb-6 text-center
                   shadow-[0_12px_0_var(--tint),0_26px_50px_rgba(0,0,0,.3)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="とじる"
          className="absolute -top-3.5 -right-2 h-11 w-11 cursor-pointer rounded-full border-0
                     bg-white text-xl font-extrabold text-ink shadow-[0_4px_12px_rgba(0,0,0,.25)]"
        >
          ✕
        </button>

        <div
          className={
            "inline-block text-[clamp(88px,22vw,132px)] leading-none " +
            "[filter:drop-shadow(0_6px_8px_rgba(0,0,0,.15))] " +
            (talking ? "animate-wobble" : "")
          }
        >
          {card.art}
        </div>
        <div className="mt-2.5 mb-0.5 text-[32px] font-extrabold">{card.en}</div>
        <div className="mb-6 text-base font-bold text-ink-soft">{card.ja}</div>

        <div className="flex gap-3">
          <SayButton onClick={() => onSay(card.en, "en-US")} className="bg-[var(--tint)]">
            🔊 English
          </SayButton>
          <SayButton onClick={() => onSay(card.ja, "ja-JP")} className="bg-ink">
            🔊 にほんご
          </SayButton>
        </div>
      </div>
    </div>
  );
}

function SayButton({ onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex-1 cursor-pointer rounded-[18px] border-0 px-2 py-[17px] font-round text-base " +
        "font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,.22)] " +
        "transition-[transform,box-shadow] duration-100 " +
        "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,.22)] " + className
      }
    >
      {children}
    </button>
  );
}
