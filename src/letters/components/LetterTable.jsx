import { useMemo } from "react";
import { SETS, flatten, sayOf } from "../letters.js";
import { LOCALE } from "../../shared/lang.js";
import { shuffle } from "../../shared/shuffle.js";
import { useSaying } from "../../shared/useSaying.js";
import { Letter } from "./Letter.jsx";

/**
 * ずかん。sort が "table" のときは行ごとに並べて五十音表・アルファベット表の形にする。
 * "shuffle" のときは順番をばらして並べる（seed が変わるたびに混ぜ直す）。
 */
export function LetterTable({ kind, sort, seed, speakAll }) {
  const { saying, say } = useSaying(speakAll);

  const shuffled = useMemo(
    () => (sort === "shuffle" ? shuffle(flatten(kind)) : null),
    [sort, kind, seed]
  );

  const tap = (letter, at) =>
    say(at, [{ text: sayOf(letter, kind), lang: LOCALE[kind] }]);

  if (shuffled) {
    return (
      <div className="mx-auto grid max-w-[46rem] grid-cols-5 gap-3 pt-2 md:gap-4">
        {shuffled.map((item, i) => (
          <Letter
            key={`${item.letter}-${i}`}
            letter={item.letter}
            row={item.row}
            talking={saying === `s${i}`}
            delay={Math.min(i, 14) * 22}
            className="animate-deal"
            onClick={() => tap(item.letter, `s${i}`)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[46rem] flex-col gap-3 pt-2 md:gap-4">
      {SETS[kind].rows.map((row, r) => (
        <div key={r} className="flex justify-center gap-3 md:gap-4">
          {row.map((letter, i) => (
            <div key={letter} className="w-[18%] min-w-14 md:w-[19%]">
              <Letter
                letter={letter}
                row={r}
                talking={saying === letter}
                delay={Math.min(r * 5 + i, 14) * 22}
                className="animate-deal"
                onClick={() => tap(letter, letter)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
