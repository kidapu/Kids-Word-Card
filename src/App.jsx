import { useCallback, useState } from "react";
import { CARDS, shuffle } from "./cards.js";
import { useSpeech } from "./useSpeech.js";
import { pip } from "./sfx.js";
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

  return (
    <div className="mx-auto max-w-[68rem] px-4 pb-14 md:px-6">
      {/* スクロールしても出しっぱなしにする。カードが透けて見えるよう半透明 + ぼかし */}
      <header
        className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-paper/80 px-4 py-3
                   backdrop-blur-md shadow-[0_2px_14px_rgba(20,40,50,.07)]
                   md:-mx-6 md:gap-3 md:px-6 md:py-4"
      >
        {mode === "book" && (
          <>
            <Tool onClick={() => sortBy("shuffle")}>
              🔀<span className="hidden sm:inline"> シャッフル</span>
            </Tool>
            <Tool onClick={() => sortBy("category")}>
              🗂<span className="hidden sm:inline"> カテゴリ</span>
            </Tool>
          </>
        )}

        {/* 先に鳴らすことば。ABC = えいごから、あいう = にほんごから */}
        <Pills className={mode === "book" ? "" : "mr-auto"}>
          <Pill on={lang === "en"} onClick={() => switchLang("en")} label="えいごから">ABC</Pill>
          <Pill on={lang === "ja"} onClick={() => switchLang("ja")} label="にほんごから">あいう</Pill>
        </Pills>

        <Pills className="ml-auto">
          <Pill on={mode === "book"} onClick={() => switchMode("book")}>ずかん</Pill>
          <Pill on={mode === "quiz"} onClick={() => switchMode("quiz")}>クイズ</Pill>
        </Pills>
      </header>

      <main>
        {mode === "book" ? (
          <BookMode
            pages={pages} onNeedMore={addPage} seed={seed} lang={lang}
            speakAll={speakAll} stop={stop} talking={talking}
          />
        ) : (
          <QuizMode lang={lang} speak={speak} talking={talking} />
        )}
      </main>
    </div>
  );
}

function Tool({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 cursor-pointer rounded-full border-0 bg-white/70 px-4 py-2.5 font-round
                 text-sm font-extrabold text-ink shadow-[0_3px_0_rgba(20,40,50,.12)]
                 transition-[transform,box-shadow] duration-100
                 active:translate-y-0.5 active:shadow-none md:px-5 md:text-base"
    >
      {children}
    </button>
  );
}

function Pills({ className = "", children }) {
  return (
    <div className={"flex shrink-0 gap-0.5 rounded-full bg-white/70 p-1 " + className}>{children}</div>
  );
}

function Pill({ on, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={
        "cursor-pointer rounded-full border-0 px-4 py-2.5 font-round text-sm font-extrabold " +
        "md:px-5 md:text-base " +
        (on ? "bg-ink text-white" : "bg-transparent text-ink-soft")
      }
    >
      {children}
    </button>
  );
}
