import { useCallback, useEffect, useRef, useState } from "react";
import { ASK, ITEMS, NUMBERS, sayNumber, shuffle } from "../counting.js";
import { LOCALE, other } from "../../shared/lang.js";
import { burst } from "../../shared/burst.js";
import { ding, buzz } from "../../shared/sfx.js";
import { NumberCard } from "./NumberCard.jsx";

const CHOICES = 3;

const newRound = () => {
  const answer = NUMBERS[Math.floor(Math.random() * NUMBERS.length)].n;
  const others = shuffle(NUMBERS.map(x => x.n).filter(n => n !== answer)).slice(0, CHOICES - 1);
  return {
    answer,
    item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
    pick: shuffle([answer, ...others]),
  };
};

/** 絵がいくつ並んでいるかを、3つの数字から選ぶ。 */
export function CountQuiz({ lang, speak, speakAll }) {
  const [round, setRound] = useState(newRound);
  const [score, setScore] = useState({ hit: 0, tries: 0 });
  const [mark, setMark] = useState(null);   // { n, ok }
  const locked = useRef(false);
  const timers = useRef([]);
  const alive = useRef(true);

  const later = useCallback((fn, ms) => { timers.current.push(setTimeout(fn, ms)); }, []);

  const ask = useCallback(() => speak(ASK[lang], LOCALE[lang]), [lang, speak]);

  // 問題が変わったら、少し置いてから問いかける。
  // 前の問題のタイマーが残っていると次の問題を飛ばしてしまうので、ここで捨てる。
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    locked.current = false;
    setMark(null);
    const t = setTimeout(ask, 250);
    return () => clearTimeout(t);
  }, [round, ask]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const answer = (n, el) => {
    if (locked.current) return;
    const ok = n === round.answer;
    setScore(s => ({ hit: s.hit + (ok ? 1 : 0), tries: s.tries + 1 }));
    setMark({ n, ok });

    if (ok) {
      locked.current = true;
      ding();
      burst(el);

      // ピンポンのあと、出題とは逆のことば → 出題したことば の順に数を読む
      const first = other(lang);
      const words = [
        { text: sayNumber(n, first), lang: LOCALE[first] },
        { text: sayNumber(n, lang),  lang: LOCALE[lang] },
      ];
      later(() => speakAll(words, () => {
        if (alive.current) later(() => setRound(newRound()), 700);
      }), 600);

      // 読み上げが返ってこないときの保険
      later(() => { if (alive.current && locked.current) setRound(newRound()); }, 6000);
    } else {
      buzz();
      // ブーのあと、押した数を読んで教える
      later(() => speak(sayNumber(n, lang), LOCALE[lang]), 520);
      later(() => setMark(null), 400);
    }
  };

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="text-[13px] font-bold tracking-[.1em] text-ink-soft">
        {score.hit} / {score.tries}
      </p>

      {/* 数える絵。折り返して中央に並べる。
          高さを決めておくと、個数が変わっても数字カードの位置が動かない。 */}
      <div className="mt-3 mb-7 flex min-h-[13rem] w-full max-w-[34rem] flex-wrap
                      items-center justify-center gap-1.5 md:gap-3">
        {Array.from({ length: round.answer }, (_, i) => (
          <span
            key={i}
            className="animate-deal text-[clamp(48px,12vw,88px)] leading-none
                       [filter:drop-shadow(0_3px_4px_rgba(0,0,0,.12))]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {round.item}
          </span>
        ))}
      </div>

      <div className="grid w-full max-w-[36rem] grid-cols-3 gap-4 md:gap-6">
        {round.pick.map(n => (
          <NumberCard
            key={n}
            n={n}
            onClick={e => answer(n, e.currentTarget)}
            className={
              "aspect-square " +
              (mark?.n === n ? (mark.ok ? "animate-yay" : "animate-nope") : "")
            }
          />
        ))}
      </div>
    </div>
  );
}
