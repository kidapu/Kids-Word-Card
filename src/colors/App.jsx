import { useState } from "react";
import { useSpeech } from "../shared/useSpeech.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Pills, Pill } from "../shared/ui.jsx";
import { ColorTable } from "./components/ColorTable.jsx";
import { ColorQuiz } from "./components/ColorQuiz.jsx";

export default function App() {
  const [mode, setMode] = useState("table");
  const [lang, setLang] = useState("en");   // 先に鳴らすことば
  const { speak, speakAll, stop, talking } = useSpeech();

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchLang = next => { pip(); stop(); setLang(next); };

  const header = (
    <>
      <HomeButton onClick={stop} />
      <Pills>
        <Pill on={lang === "en"} onClick={() => switchLang("en")} label="えいごから">ABC</Pill>
        <Pill on={lang === "ja"} onClick={() => switchLang("ja")} label="にほんごから">あいう</Pill>
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
        <ColorTable lang={lang} speakAll={speakAll} />
      ) : (
        <ColorQuiz lang={lang} speak={speak} speakAll={speakAll} talking={talking} />
      )}
    </Shell>
  );
}
