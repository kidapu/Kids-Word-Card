import { useCallback } from "react";
import { CARDS, wordOf } from "../cards.js";
import { LOCALE, other } from "../../shared/lang.js";
import { shuffle } from "../../shared/shuffle.js";
import { useQuiz } from "../../shared/useQuiz.js";
import { QuizScreen } from "../../shared/QuizScreen.jsx";
import { Card } from "./Card.jsx";

const CHOICES = 3;

const makeRound = () => ({
  pick: shuffle(CARDS.map((_, i) => i)).slice(0, CHOICES),
  target: Math.floor(Math.random() * CHOICES),
});

/** ことばが流れて、3枚から選ぶ。カードの絵の下には出題したことばが出る。 */
export function QuizMode({ lang, speak, speakAll, talking }) {
  const say = useCallback(
    (i, l) => speak(wordOf(CARDS[i], l), LOCALE[l]),
    [speak]
  );

  const quiz = useQuiz({
    makeRound,
    ask: useCallback(r => say(r.pick[r.target], lang), [say, lang]),
    // 出題とは逆のことば → 出題したことば の順に答えを返す
    sayRight: useCallback((i, done) => {
      const first = other(lang);
      speakAll(
        [
          { text: wordOf(CARDS[i], first), lang: LOCALE[first] },
          { text: wordOf(CARDS[i], lang),  lang: LOCALE[lang] },
        ],
        done
      );
    }, [speakAll, lang]),
    sayWrong: useCallback(i => say(i, lang), [say, lang]),
  });

  return (
    <QuizScreen score={quiz.score} onReplay={quiz.replay} talking={talking} wide>
      {quiz.round.pick.map((i, at) => (
        <Card
          key={i}
          card={CARDS[i]}
          lang={lang}
          hideSecondary
          artClassName="text-[clamp(56px,15vw,132px)]"
          onClick={e => quiz.answer(at, e.currentTarget)}
          className={quiz.mark?.at === at ? (quiz.mark.ok ? "animate-yay" : "animate-nope") : ""}
        />
      ))}
    </QuizScreen>
  );
}
