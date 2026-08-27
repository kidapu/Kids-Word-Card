import { useCallback, useEffect, useRef, useState } from "react";
import { burst } from "./burst.js";
import { ding, buzz } from "./sfx.js";

/**
 * クイズの進行。どのアプリのクイズも中身は同じなので、ここにまとめている。
 * 出題の作り方と読み上げだけ渡せば、音・紙吹雪・次の問題へ進む段取りは面倒を見る。
 *
 * round は `{ pick, target }` の形にすること。target は pick の中の位置。
 *
 * - makeRound()            次の問題を作る
 * - ask(round)             出題を読み上げる
 * - sayRight(item, done)   正解のときに読み上げる。読み終わったら done() を呼ぶ
 * - sayWrong(item)         間違えたときに、押したものを読み上げる
 *
 * どれも useCallback で包んで渡すこと（毎回作り直すと出題が鳴り直してしまう）。
 */
export function useQuiz({ makeRound, ask, sayRight, sayWrong }) {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState({ hit: 0, tries: 0 });
  const [mark, setMark] = useState(null);   // { at, ok } 押した位置と正誤
  const locked = useRef(false);
  const timers = useRef([]);
  const alive = useRef(true);

  const later = useCallback((fn, ms) => { timers.current.push(setTimeout(fn, ms)); }, []);

  // 問題が変わったら、少し置いてから出題する。
  // 前の問題のタイマー（特に下の保険）が残っていると、次の問題の読み上げ中に
  // 発火して問題を飛ばしてしまうので、ここで必ず捨てる。
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

  const next = useCallback(() => {
    if (alive.current) setRound(makeRound());
  }, [makeRound]);

  const answer = (at, el) => {
    if (locked.current) return;
    const ok = at === round.target;
    const item = round.pick[at];
    setScore(s => ({ hit: s.hit + (ok ? 1 : 0), tries: s.tries + 1 }));
    setMark({ at, ok });

    if (ok) {
      locked.current = true;
      ding();
      burst(el);
      // ピンポンが鳴り終わってから答えを返し、読み終わってから次の問題へ
      later(() => sayRight(item, () => later(next, 700)), 600);
      // 読み上げが返ってこないときの保険
      later(() => { if (locked.current) next(); }, 6000);
    } else {
      buzz();
      // ブーのあと、押したものが何だったかを教える
      later(() => sayWrong(item), 520);
      later(() => setMark(null), 400);
    }
  };

  /** 出題をもう一度読む */
  const replay = () => ask(round);

  return { round, score, mark, answer, replay };
}
