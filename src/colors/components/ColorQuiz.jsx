import { useCallback } from "react";
import { COLORS, nameOf } from "../colors.js";
import { LOCALE, other } from "../../shared/lang.js";
import { shuffle } from "../../shared/shuffle.js";
import { useQuiz } from "../../shared/useQuiz.js";
import { QuizScreen } from "../../shared/QuizScreen.jsx";
import { ColorCard } from "./ColorCard.jsx";

const CHOICES = 3;

const makeRound = () => ({
  pick: shuffle(COLORS).slice(0, CHOICES),
  target: Math.floor(Math.random() * CHOICES),
});

/** 色の名前が読まれて、3つから選ぶ。カードには名前を出さない。 */
export function ColorQuiz({ lang, speak, speakAll, talking }) {
  const say = useCallback(
    color => speak(nameOf(color, lang), LOCALE[lang]),
    [speak, lang]
  );

  const quiz = useQuiz({
    makeRound,
    ask: useCallback(r => say(r.pick[r.target]), [say]),
    // 出題とは逆のことば → 出題したことば の順に読む
    sayRight: useCallback((color, done) => {
      const first = other(lang);
      speakAll(
        [
          { text: nameOf(color, first), lang: LOCALE[first] },
          { text: nameOf(color, lang),  lang: LOCALE[lang] },
        ],
        done
      );
    }, [speakAll, lang]),
    sayWrong: say,
  });

  return (
    <QuizScreen score={quiz.score} onReplay={quiz.replay} talking={talking}>
      {quiz.round.pick.map((color, at) => (
        <ColorCard
          key={color.en}
          color={color}
          onClick={e => quiz.answer(at, e.currentTarget)}
          className={quiz.mark?.at === at ? (quiz.mark.ok ? "animate-yay" : "animate-nope") : ""}
        />
      ))}
    </QuizScreen>
  );
}
