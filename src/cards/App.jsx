import { useCallback, useState } from "react";
import { CARDS, shuffle } from "./cards.js";
import { useSpeech } from "../shared/useSpeech.js";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Tool, Pills, Pill } from "../shared/ui.jsx";
import { BookMode } from "./components/BookMode.jsx";
import { QuizMode } from "./components/QuizMode.jsx";

// cards.js の並び順そのまま = カテゴリ順（どうぶつ → たべもの → …）
const ORDER = CARDS.map((_, i) => i);

// 下に行くほど巡りを足していく。際限なく増えないための歯止め。
const MAX_PAGES = 30;

export default function App() {
  const [mode, setMode] = useState("book");
  const [lang, setLang] = useState("en");     // 先に鳴らすことば
  const [sort, setSort] = useState("category");
  const [pages, setPages] = useState([ORDER]);
  const [seed, setSeed] = useState(0);
  const { speak, speakAll, stop, talking } = useSpeech();

  const pageFor = s => (s === "shuffle" ? shuffle(ORDER) : ORDER);

  /** 並べ替えて先頭から配り直す */
  const sortBy = next => {
    pip();
    stop();
    setSort(next);
    setPages([pageFor(next)]);
    setSeed(s => s + 1);
    window.scrollTo({ top: 0 });
  };

  /** 下端が近づいたときに、いまの並び方で次の巡りを足す */
  const addPage = useCallback(() => {
    setPages(p => (p.length >= MAX_PAGES ? p : [...p, pageFor(sort)]));
  }, [sort]);

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchLang = next => { pip(); stop(); setLang(next); };

  const header = (
    <>
      <HomeButton onClick={stop} />

      {/* 先に鳴らすことば。どのモードでも左上の定位置に置く */}
      <Pills>
        <Pill on={lang === "en"} onClick={() => switchLang("en")} label="えいごから">ABC</Pill>
        <Pill on={lang === "ja"} onClick={() => switchLang("ja")} label="にほんごから">あいう</Pill>
      </Pills>

      {mode === "book" && (
        <>
          <Tool onClick={() => sortBy("shuffle")} label="シャッフル">
            🔀<span className="hidden lg:inline"> シャッフル</span>
          </Tool>
          <Tool onClick={() => sortBy("category")} label="カテゴリじゅん">
            🗂<span className="hidden lg:inline"> カテゴリ</span>
          </Tool>
        </>
      )}

      <Pills className="ml-auto">
        <Pill on={mode === "book"} onClick={() => switchMode("book")}>ずかん</Pill>
        <Pill on={mode === "quiz"} onClick={() => switchMode("quiz")}>クイズ</Pill>
      </Pills>
    </>
  );

  return (
    <Shell header={header}>
      {mode === "book" ? (
        <BookMode
          pages={pages} onNeedMore={addPage} seed={seed} lang={lang}
          speakAll={speakAll} stop={stop} talking={talking}
        />
      ) : (
        <QuizMode lang={lang} speak={speak} speakAll={speakAll} talking={talking} />
      )}
    </Shell>
  );
}
