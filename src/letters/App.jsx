import { useState } from "react";
import { useSpeech } from "../shared/useSpeech.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Tool, Pills, Pill } from "../shared/ui.jsx";
import { LetterTable } from "./components/LetterTable.jsx";
import { LetterQuiz } from "./components/LetterQuiz.jsx";

export default function App() {
  const [mode, setMode] = useState("table");
  const [kind, setKind] = useState("en");    // ABC か あいう か
  const [sort, setSort] = useState("table"); // 表のまま か ばらばら か
  const [seed, setSeed] = useState(0);
  const { speak, stop, talking } = useSpeech();

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchKind = next => { pip(); stop(); setKind(next); };

  /** 並べ替えて先頭から出し直す。シャッフルは押すたびに混ぜ直す。 */
  const sortBy = next => {
    pip();
    stop();
    setSort(next);
    setSeed(s => s + 1);
    window.scrollTo({ top: 0 });
  };

  const header = (
    <>
      <HomeButton onClick={stop} />

      <Pills>
        <Pill on={kind === "en"} onClick={() => switchKind("en")} label="アルファベット">ABC</Pill>
        <Pill on={kind === "ja"} onClick={() => switchKind("ja")} label="ひらがな">あいう</Pill>
      </Pills>

      {mode === "table" && (
        <>
          <Tool onClick={() => sortBy("shuffle")} label="シャッフル">
            🔀<span className="hidden lg:inline"> シャッフル</span>
          </Tool>
          <Tool onClick={() => sortBy("table")} label="じゅんばん">
            🗂<span className="hidden lg:inline"> じゅんばん</span>
          </Tool>
        </>
      )}

      <Pills className="ml-auto">
        <Pill on={mode === "table"} onClick={() => switchMode("table")}>ずかん</Pill>
        <Pill on={mode === "quiz"} onClick={() => switchMode("quiz")}>クイズ</Pill>
      </Pills>
    </>
  );

  return (
    <Shell header={header}>
      {mode === "table" ? (
        <LetterTable kind={kind} sort={sort} seed={seed} speak={speak} />
      ) : (
        <LetterQuiz kind={kind} speak={speak} talking={talking} />
      )}
    </Shell>
  );
}
