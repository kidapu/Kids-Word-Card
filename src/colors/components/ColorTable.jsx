import { useState } from "react";
import { COLORS, nameOf } from "../colors.js";
import { LOCALE, other } from "../../shared/lang.js";
import { ColorCard } from "./ColorCard.jsx";

/** ずかん。押すと2つのことばで色の名前を続けて読む。 */
export function ColorTable({ lang, speakAll }) {
  const [saying, setSaying] = useState(null);

  const say = color => {
    const second = other(lang);
    setSaying(color.en);
    speakAll(
      [
        { text: nameOf(color, lang),   lang: LOCALE[lang] },
        { text: nameOf(color, second), lang: LOCALE[second] },
      ],
      // 途中で別の色を押されたら、そちらの光りを消さないようにする
      () => setSaying(s => (s === color.en ? null : s))
    );
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
          onClick={() => say(color)}
        />
      ))}
    </div>
  );
}
