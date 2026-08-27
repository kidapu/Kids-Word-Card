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
        {/* どのくらい塗れたか。目印まで伸びたらクリア。 */}
        <div
          className="relative mx-auto mt-4 h-4 w-[min(66svh,30rem)] overflow-hidden
                     rounded-full bg-black/10"
        >
          <div
            className="h-full rounded-full transition-[width,background-color] duration-200"
            style={{
              width: `${Math.min(100, cover * 100)}%`,
              background: cover >= COVER ? "var(--color-green)" : "var(--color-blue)",
            }}
          />
          {/* ここまで塗れたらクリア、という目印 */}
          <div
            className="absolute inset-y-0 w-[3px] rounded-full bg-ink/30"
            style={{ left: `calc(${COVER * 100}% - 1.5px)` }}
          />
        </div>
      </div>
    </Shell>
  );
}
