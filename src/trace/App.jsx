import { useMemo, useState } from "react";
import { SETS } from "../shared/letters.js";
import { COVER } from "./trace.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Tool, Pills, Pill } from "../shared/ui.jsx";
import { TraceBoard } from "./components/TraceBoard.jsx";

export default function App() {
  const [kind, setKind] = useState("ja");   // なぞりは ひらがな から
  const [index, setIndex] = useState(0);
  const [erased, setErased] = useState(0);
  const [cover, setCover] = useState(0);

  const letters = useMemo(() => SETS[kind].rows.flat(), [kind]);
  const letter = letters[index % letters.length];

  const switchKind = next => { pip(); setKind(next); setIndex(0); setCover(0); };
  const erase = () => { pip(); setErased(n => n + 1); };
  const next = () => { setIndex(i => i + 1); setCover(0); };

  const header = (
    <>
      <HomeButton />
      <Pills>
        <Pill on={kind === "ja"} onClick={() => switchKind("ja")} label="ひらがな">あいう</Pill>
        <Pill on={kind === "en"} onClick={() => switchKind("en")} label="アルファベット">ABC</Pill>
        <Pill on={kind === "num"} onClick={() => switchKind("num")} label="すうじ">123</Pill>
      </Pills>

      <Tool onClick={erase} label="けす">
        🧽<span className="hidden sm:inline"> けす</span>
      </Tool>

      <p className="ml-auto pr-1 font-round text-[13px] font-bold tracking-[.1em] text-ink-soft">
        {(index % letters.length) + 1} / {letters.length}
      </p>
    </>
  );

  return (
    <Shell header={header}>
      <div className="pt-2">
        <TraceBoard
          letter={letter}
          eraseSeed={erased}
          onClear={next}
          onProgress={setCover}
        />
        {/* どのくらい塗れたか。目印まで伸びたらクリアで、そのあと右端まで伸びる。 */}
        <div className="mx-auto mt-4 flex w-[min(66svh,30rem)] items-center gap-3">
          <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-black/10">
            <div
              className="h-full rounded-full transition-[width,background-color] duration-[400ms] ease-out"
              style={{
                width: `${Math.min(100, cover * 100)}%`,
                background: cover >= COVER ? "var(--color-red)" : "var(--color-blue)",
              }}
            />
            {/* ここまで塗れたらクリア、という目印 */}
            <div
              className="absolute inset-y-0 w-[3px] rounded-full bg-ink/30"
              style={{ left: `calc(${COVER * 100}% - 1.5px)` }}
            />
          </div>
          <span
            className={
              "w-12 text-right font-round text-sm font-extrabold tabular-nums " +
              (cover >= COVER ? "text-red" : "text-ink-soft")
            }
          >
            {Math.round(cover * 100)}%
          </span>
        </div>
      </div>
    </Shell>
  );
}
