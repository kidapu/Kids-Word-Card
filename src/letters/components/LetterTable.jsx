import { SETS, sayOf } from "../letters.js";
import { LOCALE } from "../../shared/lang.js";
import { Letter } from "./Letter.jsx";

/** ひょう。行ごとに並べているので、五十音表の形のまま出る。 */
export function LetterTable({ kind, speak }) {
  return (
    <div className="mx-auto flex max-w-[46rem] flex-col gap-3 pt-2 md:gap-4">
      {SETS[kind].rows.map((row, r) => (
        <div key={r} className="flex justify-center gap-3 md:gap-4">
          {row.map(letter => (
            <div key={letter} className="w-[18%] min-w-14 md:w-[19%]">
              <Letter
                letter={letter}
                row={r}
                className="animate-deal"
                onClick={() => speak(sayOf(letter, kind), LOCALE[kind])}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
