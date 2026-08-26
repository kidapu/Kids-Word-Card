import { useCallback, useState } from "react";
import { CARDS, shuffle } from "./cards.js";
import { useSpeech } from "./useSpeech.js";
import { BookMode } from "./components/BookMode.jsx";
import { QuizMode } from "./components/QuizMode.jsx";

const ORDER = CARDS.map((_, i) => i);

export default function App() {
  const [mode, setMode] = useState("book");
  const [order, setOrder] = useState(ORDER);
  const [seed, setSeed] = useState(0);
  const { speak, stop, talking } = useSpeech();

  const doShuffle = useCallback(() => {
    stop();
    setOrder(o => shuffle(o));
    setSeed(s => s + 1);
  }, [stop]);

  const switchTo = next => { stop(); setMode(next); };

  return (
    <div className="mx-auto max-w-[68rem] px-4 pb-14 md:px-6">
      <header className="flex items-center gap-3 py-3 md:py-4">
        {mode === "book" ? (
          <button
            type="button"
            onClick={doShuffle}
            className="cursor-pointer rounded-full border-0 bg-white/70 px-5 py-2.5 font-round
                       text-sm font-extrabold text-ink shadow-[0_3px_0_rgba(20,40,50,.12)]
                       transition-[transform,box-shadow] duration-100
                       active:translate-y-0.5 active:shadow-none md:text-base"
          >
            🔀 シャッフル
          </button>
        ) : (
          <span />
        )}

        <div className="ml-auto flex gap-0.5 rounded-full bg-white/70 p-1">
          <ModeButton on={mode === "book"} onClick={() => switchTo("book")}>ずかん</ModeButton>
          <ModeButton on={mode === "quiz"} onClick={() => switchTo("quiz")}>クイズ</ModeButton>
        </div>
      </header>

      <main>
        {mode === "book" ? (
          <BookMode order={order} seed={seed} speak={speak} stop={stop} talking={talking} />
        ) : (
          <QuizMode speak={speak} talking={talking} />
        )}
      </main>
    </div>
  );
}

function ModeButton({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={
        "cursor-pointer rounded-full border-0 px-5 py-2.5 font-round text-sm font-extrabold " +
        "md:text-base " +
        (on ? "bg-ink text-white" : "bg-transparent text-ink-soft")
      }
    >
      {children}
    </button>
  );
}
