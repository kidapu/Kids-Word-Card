import { useMemo, useState } from "react";
import { SETS } from "../shared/letters.js";
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
        {/* どのくらい塗れたかの目安。大人が見て調整できるように出している */}
        <p className="mt-3 text-center font-round text-xs font-bold text-ink-soft">
          {Math.round(cover * 100)}%
        </p>
      </div>
    </Shell>
  );
}
