import { useCallback, useEffect } from "react";
import { TINT, wordOf } from "../cards.js";
import { LOCALE, other } from "../../shared/lang.js";

/** カードを拡大する画面。lang → もう一方のことば の順で続けて鳴らす。 */
export function CardDetail({ card, lang, talking, onSayAll, onClose }) {
  const second = other(lang);

  const sayBoth = useCallback(() => {
    onSayAll([
      { text: wordOf(card, lang),   lang: LOCALE[lang] },
      { text: wordOf(card, second), lang: LOCALE[second] },
    ]);
  }, [card, lang, second, onSayAll]);

  // 開いたら自動で1回鳴らす
  useEffect(() => { sayBoth(); }, [sayBoth]);

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
          className="absolute -top-6 -right-4 h-22 w-22 cursor-pointer rounded-full border-0
                     bg-white text-4xl font-extrabold text-ink shadow-[0_5px_16px_rgba(0,0,0,.28)]"
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
        <div className="mt-2.5 mb-0.5 text-[32px] font-extrabold">{wordOf(card, lang)}</div>
        <div className="mb-6 text-base font-bold text-ink-soft">{wordOf(card, second)}</div>

        <SayButton onClick={sayBoth} className="w-full bg-[var(--tint)]">
          🔊 もういっかい
        </SayButton>
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
        "cursor-pointer rounded-[18px] border-0 px-2 py-[19px] font-round text-lg " +
        "font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,.22)] " +
        "transition-[transform,box-shadow] duration-100 " +
        "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,.22)] " + className
      }
    >
      {children}
    </button>
  );
}
