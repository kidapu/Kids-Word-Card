import { useCallback, useEffect, useRef, useState } from "react";
import { flatten, sayOf, shuffle } from "../letters.js";
import { LOCALE } from "../../shared/lang.js";
import { burst } from "../../shared/burst.js";
import { ding, buzz } from "../../shared/sfx.js";
import { Letter } from "./Letter.jsx";

const CHOICES = 3;

const newRound = kind => ({
  pick: shuffle(flatten(kind)).slice(0, CHOICES),
  target: Math.floor(Math.random() * CHOICES),
});

/** もじが読まれて、3つから選ぶ。正解すると紙吹雪が出て次の問題へ。 */
export function LetterQuiz({ kind, speak, talking }) {
  const [round, setRound] = useState(() => newRound(kind));
  const [score, setScore] = useState({ hit: 0, tries: 0 });
  const [mark, setMark] = useState(null);   // { at, ok }
  const locked = useRef(false);
  const timers = useRef([]);
  const alive = useRef(true);

  const later = useCallback((fn, ms) => { timers.current.push(setTimeout(fn, ms)); }, []);

  const answerOf = r => r.pick[r.target];
  const say = useCallback(
    r => speak(sayOf(answerOf(r).letter, kind), LOCALE[kind]),
    [kind, speak]
  );

  // もじの種類を変えたら出し直す
  useEffect(() => { setRound(newRound(kind)); setScore({ hit: 0, tries: 0 }); }, [kind]);

  // 問題が変わったら、少し置いてから読み上げる
  useEffect(() => {
    locked.current = false;
    setMark(null);
    const t = setTimeout(() => say(round), 250);
    return () => clearTimeout(t);
  }, [round, say]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const answer = (at, el) => {
    if (locked.current) return;
    const ok = at === round.target;
    setScore(s => ({ hit: s.hit + (ok ? 1 : 0), tries: s.tries + 1 }));
    setMark({ at, ok });

    if (ok) {
      locked.current = true;
      ding();
      burst(el);
      // ピンポンのあと、もう一度読んでから次の問題へ
      later(() => say(round), 600);
      later(() => { if (alive.current) setRound(newRound(kind)); }, 2000);
    } else {
      buzz();
      later(() => setMark(null), 400);
    }
  };

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="text-[13px] font-bold tracking-[.1em] text-ink-soft">
        {score.hit} / {score.tries}
      </p>

      <button
        type="button"
        onClick={() => say(round)}
        className={
          "mt-1.5 mb-6 cursor-pointer rounded-full border-0 bg-ink px-8 py-4 font-round " +
          "text-lg font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,.25)] " +
          "transition-[transform,box-shadow] duration-100 " +
          "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,.25)] " +
          (talking ? "animate-wobble" : "")
        }
      >
        🔊 もういちど きく
      </button>

      <div className="grid w-full max-w-[36rem] grid-cols-3 gap-4 md:gap-6">
        {round.pick.map((item, at) => (
          <Letter
            key={`${item.letter}-${at}`}
            letter={item.letter}
            row={item.row}
            onClick={e => answer(at, e.currentTarget)}
            className={mark?.at === at ? (mark.ok ? "animate-yay" : "animate-nope") : ""}
          />
        ))}
      </div>
    </div>
  );
}
