import { useState } from "react";
import { NUMBERS, sayNumber } from "../counting.js";
import { LOCALE } from "../../shared/lang.js";
import { NumberCard } from "./NumberCard.jsx";

/** ずかん。1 から 10 が並んでいて、押すとその数を読む。 */
export function NumberTable({ lang, speakAll }) {
  const [saying, setSaying] = useState(null);

  const say = n => {
    setSaying(n);
    speakAll(
      [{ text: sayNumber(n, lang), lang: LOCALE[lang] }],
      // 途中で別の数字を押されたら、そちらの光りを消さないようにする
      () => setSaying(s => (s === n ? null : s))
    );
  };

  return (
    <div className="mx-auto grid max-w-[46rem] grid-cols-3 gap-3 pt-2 sm:grid-cols-4 md:grid-cols-5 md:gap-4">
      {NUMBERS.map(({ n }, i) => (
        <NumberCard
          key={n}
          n={n}
          dots
          talking={saying === n}
          className="animate-deal"
          style={{ animationDelay: `${i * 30}ms` }}
          onClick={() => say(n)}
        />
      ))}
    </div>
  );
}
