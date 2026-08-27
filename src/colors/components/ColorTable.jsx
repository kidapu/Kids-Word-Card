import { COLORS, nameOf } from "../colors.js";
import { LOCALE, other } from "../../shared/lang.js";
import { useSaying } from "../../shared/useSaying.js";
import { ColorCard } from "./ColorCard.jsx";

/** ずかん。押すと2つのことばで色の名前を続けて読む。 */
export function ColorTable({ lang, speakAll }) {
  const { saying, say } = useSaying(speakAll);

  const tap = color => {
    const second = other(lang);
    say(color.en, [
      { text: nameOf(color, lang),   lang: LOCALE[lang] },
      { text: nameOf(color, second), lang: LOCALE[second] },
    ]);
  };

  return (
    <div className="grid grid-cols-2 gap-3.5 pt-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5">
      {COLORS.map((color, i) => (
        <ColorCard
          key={color.en}
          color={color}
          lang={lang}
          showName
          talking={saying === color.en}
          className="animate-deal"
          style={{ animationDelay: `${Math.min(i, 14) * 30}ms` }}
          onClick={() => tap(color)}
        />
      ))}
    </div>
  );
}
