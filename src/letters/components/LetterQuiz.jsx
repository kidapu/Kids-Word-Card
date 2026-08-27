import { useCallback } from "react";
import { flatten, sayOf } from "../letters.js";
import { LOCALE } from "../../shared/lang.js";
import { shuffle } from "../../shared/shuffle.js";
import { useQuiz } from "../../shared/useQuiz.js";
import { QuizScreen } from "../../shared/QuizScreen.jsx";
import { Letter } from "./Letter.jsx";

const CHOICES = 3;

/** もじが読まれて、3つから選ぶ。 */
export function LetterQuiz({ kind, speak, speakAll, talking }) {
  const makeRound = useCallback(() => ({
    pick: shuffle(flatten(kind)).slice(0, CHOICES),
    target: Math.floor(Math.random() * CHOICES),
  }), [kind]);

  const say = useCallback(
    item => speak(sayOf(item.letter, kind), LOCALE[kind]),
    [speak, kind]
  );

  const quiz = useQuiz({
    makeRound,
    ask: useCallback(r => say(r.pick[r.target]), [say]),
    sayRight: useCallback((item, done) => {
      speakAll([{ text: sayOf(item.letter, kind), lang: LOCALE[kind] }], done);
    }, [speakAll, kind]),
    sayWrong: say,
  });

  return (
    <QuizScreen score={quiz.score} onReplay={quiz.replay} talking={talking}>
      {quiz.round.pick.map((item, at) => (
        <Letter
          key={`${item.letter}-${at}`}
          letter={item.letter}
          row={item.row}
          onClick={e => quiz.answer(at, e.currentTarget)}
          className={quiz.mark?.at === at ? (quiz.mark.ok ? "animate-yay" : "animate-nope") : ""}
        />
      ))}
    </QuizScreen>
  );
}
