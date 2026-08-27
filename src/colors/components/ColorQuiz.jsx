import { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, nameOf, shuffle } from "../colors.js";
import { LOCALE, other } from "../../shared/lang.js";
import { burst } from "../../shared/burst.js";
import { ding, buzz } from "../../shared/sfx.js";
import { ColorCard } from "./ColorCard.jsx";

const CHOICES = 3;

const newRound = () => {
  const pick = shuffle(COLORS).slice(0, CHOICES);
  return { pick, target: Math.floor(Math.random() * CHOICES) };
};

/** 色の名前が読まれて、3つから選ぶ。カードには名前を出さない。 */
export function ColorQuiz({ lang, speak, speakAll, talking }) {
  const [round, setRound] = useState(newRound);
  const [score, setScore] = useState({ hit: 0, tries: 0 });
  const [mark, setMark] = useState(null);   // { at, ok }
  const locked = useRef(false);
  const timers = useRef([]);
  const alive = useRef(true);

  const later = useCallback((fn, ms) => { timers.current.push(setTimeout(fn, ms)); }, []);

  const ask = useCallback(
    r => speak(nameOf(r.pick[r.target], lang), LOCALE[lang]),
    [lang, speak]
  );

  // 問題が変わったら、少し置いてから読み上げる。
  // 前の問題のタイマーが残っていると次の問題を飛ばしてしまうので、ここで捨てる。
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    locked.current = false;
    setMark(null);
    const t = setTimeout(() => ask(round), 250);
    return () => clearTimeout(t);
  }, [round, ask]);

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
    const color = round.pick[at];
    setScore(s => ({ hit: s.hit + (ok ? 1 : 0), tries: s.tries + 1 }));
    setMark({ at, ok });

    if (ok) {
      locked.current = true;
      ding();
      burst(el);

      // ピンポンのあと、出題とは逆のことば → 出題したことば の順に読む
      const first = other(lang);
      const words = [
        { text: nameOf(color, first), lang: LOCALE[first] },
        { text: nameOf(color, lang),  lang: LOCALE[lang] },
      ];
      later(() => speakAll(words, () => {
        if (alive.current) later(() => setRound(newRound()), 700);
      }), 600);

      // 読み上げが返ってこないときの保険
      later(() => { if (alive.current && locked.current) setRound(newRound()); }, 6000);
    } else {
      buzz();
      // ブーのあと、押した色を読んで教える
      later(() => speak(nameOf(color, lang), LOCALE[lang]), 520);
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
        onClick={() => ask(round)}
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
        {round.pick.map((color, at) => (
          <ColorCard
            key={color.en}
            color={color}
            onClick={e => answer(at, e.currentTarget)}
            className={mark?.at === at ? (mark.ok ? "animate-yay" : "animate-nope") : ""}
          />
        ))}
      </div>
    </div>
  );
}
