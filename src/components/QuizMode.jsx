import { useCallback, useEffect, useRef, useState } from "react";
import { CARDS, shuffle } from "../cards.js";
import { burst } from "../burst.js";
import { ding, buzz } from "../sfx.js";
import { LOCALE, other, wordOf } from "../lang.js";
import { Card } from "./Card.jsx";

const CHOICES = 3;

const newRound = () => {
  const pick = shuffle(CARDS.map((_, i) => i)).slice(0, CHOICES);
  return { pick, target: pick[Math.floor(Math.random() * CHOICES)] };
};

/** 英語が流れて、3枚から選ぶ。正解すると紙吹雪が出て次の問題へ。 */
export function QuizMode({ lang, speak, speakAll, talking }) {
  const [round, setRound] = useState(newRound);
  const [score, setScore] = useState({ hit: 0, tries: 0 });
  const [mark, setMark] = useState(null);   // { index, ok }
  const locked = useRef(false);
  const timers = useRef([]);
  const alive = useRef(true);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  // 問題が変わったら、少し置いてから読み上げる
  useEffect(() => {
    locked.current = false;
    setMark(null);
    const t = setTimeout(() => speak(wordOf(CARDS[round.target], lang), LOCALE[lang]), 250);
    return () => clearTimeout(t);
  }, [round, lang, speak]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const answer = (i, el) => {
    if (locked.current) return;
    const ok = i === round.target;
    setScore(s => ({ hit: s.hit + (ok ? 1 : 0), tries: s.tries + 1 }));
    setMark({ index: i, ok });

    if (ok) {
      locked.current = true;
      ding();
      burst(el);

      // ピンポンのあと、出題とは逆のことば → 出題したことば の順に答えを返す。
      // 読み終わってから次の問題に進むので、長いことばでも切れない。
      const first = other(lang);
      const words = [
        { text: wordOf(CARDS[i], first), lang: LOCALE[first] },
        { text: wordOf(CARDS[i], lang),  lang: LOCALE[lang] },
      ];
      later(() => speakAll(words, () => {
        if (alive.current) later(() => setRound(newRound()), 700);
      }), 600);

      // 読み上げが返ってこないときの保険（次の問題に入れば locked は false に戻る）
      later(() => { if (alive.current && locked.current) setRound(newRound()); }, 6000);
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
        onClick={() => speak(wordOf(CARDS[round.target], lang), LOCALE[lang])}
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

      <div className="grid w-full max-w-[54rem] grid-cols-3 gap-3 md:gap-6">
        {round.pick.map(i => (
          <Card
            key={i}
            card={CARDS[i]}
            lang={lang}
            hideSecondary
            artClassName="text-[clamp(56px,15vw,132px)]"
            onClick={e => answer(i, e.currentTarget)}
            className={
              mark?.index === i ? (mark.ok ? "animate-yay" : "animate-nope") : ""
            }
          />
        ))}
      </div>
    </div>
  );
}
