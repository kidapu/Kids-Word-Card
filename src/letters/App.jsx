import { useState } from "react";
import { useSpeech } from "../shared/useSpeech.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Pills, Pill } from "../shared/ui.jsx";
import { LetterTable } from "./components/LetterTable.jsx";
import { LetterQuiz } from "./components/LetterQuiz.jsx";

export default function App() {
  const [mode, setMode] = useState("table");
  const [kind, setKind] = useState("en");   // ABC か あいう か
  const { speak, stop, talking } = useSpeech();

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchKind = next => { pip(); stop(); setKind(next); };

  const header = (
    <>
      <HomeButton onClick={stop} />

      <Pills>
        <Pill on={kind === "en"} onClick={() => switchKind("en")} label="アルファベット">ABC</Pill>
        <Pill on={kind === "ja"} onClick={() => switchKind("ja")} label="ひらがな">あいう</Pill>
      </Pills>

      <Pills className="ml-auto">
        <Pill on={mode === "table"} onClick={() => switchMode("table")}>ずかん</Pill>
        <Pill on={mode === "quiz"} onClick={() => switchMode("quiz")}>クイズ</Pill>
      </Pills>
    </>
  );

  return (
    <Shell header={header}>
      {mode === "table" ? (
        <LetterTable kind={kind} speak={speak} />
      ) : (
        <LetterQuiz kind={kind} speak={speak} talking={talking} />
      )}
    </Shell>
  );
}
