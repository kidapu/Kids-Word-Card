import { useState } from "react";
import { pip } from "../shared/sfx.js";
import { Shell, HomeButton, Tool } from "../shared/ui.jsx";
import { MazeBoard } from "./components/MazeBoard.jsx";

export default function App() {
  const [stage, setStage] = useState(0);
  const [board, setBoard] = useState(0);   // 同じ面を作り直すための目印

  const next = () => { setStage(s => s + 1); setBoard(b => b + 1); };
  const again = () => { pip(); setBoard(b => b + 1); };

  const header = (
    <>
      <HomeButton />
      <Tool onClick={again} label="もういちど">
        🔄<span className="hidden sm:inline"> もういちど</span>
      </Tool>
      <p className="ml-auto pr-1 font-round text-[13px] font-bold tracking-[.1em] text-ink-soft">
        {stage} めん クリア
      </p>
    </>
  );

  return (
    <Shell header={header}>
      <div className="pt-2">
        <MazeBoard key={board} stage={stage} onClear={next} />
      </div>
    </Shell>
  );
}
