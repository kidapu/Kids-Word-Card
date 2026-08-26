import { useCallback, useState } from "react";
import { CARDS, shuffle } from "./cards.js";
import { useSpeech } from "./useSpeech.js";
import { pip } from "./sfx.js";
import { BookMode } from "./components/BookMode.jsx";
import { QuizMode } from "./components/QuizMode.jsx";

const ORDER = CARDS.map((_, i) => i);

export default function App() {
  const [mode, setMode] = useState("book");
  const [lang, setLang] = useState("en");   // 先に鳴らすことば
  const [order, setOrder] = useState(ORDER);
  const [seed, setSeed] = useState(0);
  const { speak, stop, talking } = useSpeech();

  const doShuffle = useCallback(() => {
    pip();
    stop();
    setOrder(o => shuffle(o));
    setSeed(s => s + 1);
  }, [stop]);

  const switchMode = next => { pip(); stop(); setMode(next); };
  const switchLang = next => { pip(); stop(); setLang(next); };

  return (
    <div className="mx-auto max-w-[68rem] px-4 pb-14 md:px-6">
      <header className="flex items-center gap-2 py-3 md:gap-3 md:py-4">
        {mode === "book" ? (
          <button
            type="button"
            onClick={doShuffle}
            className="cursor-pointer rounded-full border-0 bg-white/70 px-4 py-2.5 font-round
                       text-sm font-extrabold text-ink shadow-[0_3px_0_rgba(20,40,50,.12)]
                       transition-[transform,box-shadow] duration-100
                       active:translate-y-0.5 active:shadow-none md:px-5 md:text-base"
          >
            🔀<span className="hidden sm:inline"> シャッフル</span>
          </button>
        ) : (
          <span />
        )}

        {/* 先に鳴らすことば。ABC = えいごから、あいう = にほんごから */}
        <Pills>
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
            order={order} seed={seed} lang={lang}
            speak={speak} stop={stop} talking={talking}
          />
        ) : (
          <QuizMode lang={lang} speak={speak} talking={talking} />
        )}
      </main>
    </div>
  );
}

function Pills({ className = "", children }) {
  return (
    <div className={"flex gap-0.5 rounded-full bg-white/70 p-1 " + className}>{children}</div>
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
