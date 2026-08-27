import { useState } from "react";
import { useSpeech } from "../shared/useSpeech.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Pills, Pill } from "../shared/ui.jsx";
import { NumberTable } from "./components/NumberTable.jsx";
import { CountQuiz } from "./components/CountQuiz.jsx";

export default function App() {
  const [mode, setMode] = useState("table");
  const [lang, setLang] = useState("en");   // 数を読むことば
  const { speak, speakAll, stop } = useSpeech();

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchLang = next => { pip(); stop(); setLang(next); };

  const header = (
    <>
      <HomeButton onClick={stop} />
      <Pills>
        <Pill on={lang === "en"} onClick={() => switchLang("en")} label="えいごで かぞえる">ABC</Pill>
        <Pill on={lang === "ja"} onClick={() => switchLang("ja")} label="にほんごで かぞえる">あいう</Pill>
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
        <NumberTable lang={lang} speakAll={speakAll} />
      ) : (
        <CountQuiz lang={lang} speak={speak} speakAll={speakAll} />
      )}
    </Shell>
  );
}
