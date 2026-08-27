import { useCallback } from "react";
import { ASK, ITEMS, NUMBERS, sayNumber } from "../counting.js";
import { LOCALE, other } from "../../shared/lang.js";
import { shuffle } from "../../shared/shuffle.js";
import { useQuiz } from "../../shared/useQuiz.js";
import { QuizScreen } from "../../shared/QuizScreen.jsx";
import { NumberCard } from "./NumberCard.jsx";

const CHOICES = 3;

const makeRound = () => {
  const pick = shuffle(NUMBERS.map(x => x.n)).slice(0, CHOICES);
  return {
    pick,
    target: Math.floor(Math.random() * CHOICES),
    item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
  };
};

/** 絵がいくつ並んでいるかを、3つの数字から選ぶ。 */
export function CountQuiz({ lang, speak, speakAll }) {
  const quiz = useQuiz({
    makeRound,
    ask: useCallback(() => speak(ASK[lang], LOCALE[lang]), [speak, lang]),
    // 出題とは逆のことば → 出題したことば の順に数を読む
    sayRight: useCallback((n, done) => {
      const first = other(lang);
      speakAll(
        [
          { text: sayNumber(n, first), lang: LOCALE[first] },
          { text: sayNumber(n, lang),  lang: LOCALE[lang] },
        ],
        done
      );
    }, [speakAll, lang]),
    sayWrong: useCallback(n => speak(sayNumber(n, lang), LOCALE[lang]), [speak, lang]),
  });

  const count = quiz.round.pick[quiz.round.target];

  const items = (
    // 高さを決めておくと、個数が変わっても数字カードの位置が動かない
    <div className="mt-3 mb-7 flex min-h-[13rem] w-full max-w-[34rem] flex-wrap
                    items-center justify-center gap-1.5 md:gap-3">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="animate-deal text-[clamp(48px,12vw,88px)] leading-none
                     [filter:drop-shadow(0_3px_4px_rgba(0,0,0,.12))]"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {quiz.round.item}
        </span>
      ))}
    </div>
  );

  return (
    <QuizScreen score={quiz.score} above={items}>
      {quiz.round.pick.map((n, at) => (
        <NumberCard
          key={n}
          n={n}
          onClick={e => quiz.answer(at, e.currentTarget)}
          className={
            "aspect-square " +
            (quiz.mark?.at === at ? (quiz.mark.ok ? "animate-yay" : "animate-nope") : "")
          }
        />
      ))}
    </QuizScreen>
  );
}
