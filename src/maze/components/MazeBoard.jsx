import { useEffect, useRef, useState } from "react";
import {
  W, H, BAR_H, START, GOAL, HOLE, TINTS,
  makeLevel, hitsBar, atGoal, atStart, between, addPrints,
} from "../maze.js";
import { burst } from "../../shared/burst.js";
import { ding, buzz } from "../../shared/sfx.js";

/**
 * スタートに指を置いて、かべに当たらないようにゴールまでなぞる。
 * 指を離すか、かべに当たるとやり直し。ゴールに着いたら次の面へ。
 */
export function MazeBoard({ stage, onClear }) {
  const [bars, setBars] = useState(() => makeLevel(stage));
  const [path, setPath] = useState([]);      // 描くためだけの控え
  const [prints, setPrints] = useState([]);  // うさぎの足あと
  const trail = useRef([]);
  const carry = useRef(0);                   // 足あとを置くまでの残り
  const side = useRef(1);                    // つぎは右足か左足か
  // なぞっている最中の判断は ref で持つ。state だと同じ指の動きの中では
  // 前の値のままなので、ゴール判定が何度も通ってしまう。
  const drawing = useRef(false);
  const done = useRef(false);
  const points = useRef([]);
  const svg = useRef(null);
  const goalRef = useRef(null);
  const timer = useRef(null);

  // 面が変わったら盤面を作り直す
  useEffect(() => {
    setBars(makeLevel(stage));
    points.current = [];
    trail.current = [];
    carry.current = 0;
    side.current = 1;
    setPath([]);
    setPrints([]);
    drawing.current = false;
    done.current = false;
  }, [stage]);

  useEffect(() => () => clearTimeout(timer.current), []);

  /** 画面の座標を、盤面の座標に直す */
  const toLocal = e => {
    const r = svg.current.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const reset = () => {
    drawing.current = false;
    points.current = [];
    trail.current = [];
    carry.current = 0;
    side.current = 1;
    setPath([]);
    setPrints([]);
  };

  const fail = () => {
    buzz();
    reset();
  };

  const clear = () => {
    done.current = true;
    drawing.current = false;
    ding();
    burst(goalRef.current);
    timer.current = setTimeout(onClear, 1100);
  };

  const down = e => {
    if (done.current) return;
    const p = toLocal(e);
    if (!atStart(p)) return;           // スタートからしか始められない
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 拾えなくても続けられる */ }
    drawing.current = true;
    points.current = [p];
    trail.current = [];
    carry.current = 0;
    side.current = 1;
    setPath([p]);
    setPrints([]);
  };

  /** 点を足しながら、間隔があいたら足あとを置く */
  const stampTo = p => {
    const from = points.current[points.current.length - 1];
    const r = addPrints(trail.current, from, p, carry.current, side.current);
    carry.current = r.carry;
    side.current = r.side;
    points.current.push(p);
  };

  const move = e => {
    if (!drawing.current || done.current) return;
    const p = toLocal(e);
    const last = points.current[points.current.length - 1];
    if (!last) return;

    // 前の点との間を細かく調べる。すり抜けも見逃さない。
    for (const q of between(last, p)) {
      if (atGoal(q)) {
        stampTo(q);
        setPath([...points.current]);
        setPrints([...trail.current]);
        clear();
        return;
      }
      if (q.x < 0 || q.x > W || q.y < 0 || q.y > H) { fail(); return; }
      if (bars.some(bar => hitsBar(q, bar))) { fail(); return; }
    }
    stampTo(p);
    setPath([...points.current]);
    setPrints([...trail.current]);
  };

  // ゴールまで着かずに指を離したら、静かにやり直し（ブーは鳴らさない）
  const up = () => { if (drawing.current && !done.current) reset(); };

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${W} ${H}`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{ touchAction: "none" }}
      className="mx-auto block h-[min(72svh,34rem)] w-auto rounded-[26px] bg-paper-soft
                 shadow-[0_7px_0_rgba(20,40,50,.12),0_12px_20px_rgba(20,40,50,.12)]"
    >
      {/* かべ。1本につき1か所だけ穴が開いている */}
      {bars.map((bar, i) => {
        const tint = TINTS[i % TINTS.length];
        return (
          <g key={i} fill={tint}>
            <rect x="0" y={bar.y} width={bar.gx} height={BAR_H} rx={BAR_H / 2} />
            <rect
              x={bar.gx + bar.gap} y={bar.y}
              width={Math.max(0, W - bar.gx - bar.gap)} height={BAR_H} rx={BAR_H / 2}
            />
          </g>
        );
      })}

      {/* スタートとゴール */}
      <circle cx={START.x} cy={START.y} r={HOLE} fill="var(--color-green)" opacity=".18" />
      <circle ref={goalRef} cx={GOAL.x} cy={GOAL.y} r={HOLE} fill="var(--color-red)" opacity=".18" />
      <text x={START.x} y={START.y} textAnchor="middle" dominantBaseline="central" fontSize="12">🐰</text>
      <text x={GOAL.x} y={GOAL.y} textAnchor="middle" dominantBaseline="central" fontSize="12">🥕</text>

      {/* 通った道。うすいグレーで、足あとの下じきにする */}
      {path.length > 1 && (
        <polyline
          points={path.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--color-ink-soft)"
          strokeWidth="3.5"
          strokeOpacity=".28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* うさぎの足あと。左右かわりばんこに、進む向きへ回して置く */}
      {prints.map((p, i) => (
        <text
          key={i}
          x={p.x} y={p.y}
          textAnchor="middle" dominantBaseline="central"
          fontSize="5"
          transform={`rotate(${p.deg} ${p.x} ${p.y})`}
        >
          🐾
        </text>
      ))}
    </svg>
  );
}
