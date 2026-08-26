import { useState } from "react";
import { CARDS } from "../cards.js";
import { Card } from "./Card.jsx";
import { CardDetail } from "./CardDetail.jsx";

/**
 * ずかん。order は App が持っていて、シャッフルボタンで並びが変わる。
 * seed が変わるとグリッドごと作り直されて、カードが配られる演出が走る。
 */
export function BookMode({ order, seed, lang, speakAll, stop, talking }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <div
        key={seed}
        className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        {order.map((i, pos) => (
          <Card
            key={i}
            card={CARDS[i]}
            lang={lang}
            onClick={() => setOpenIndex(i)}
            delay={Math.min(pos, 14) * 22}
            className="animate-deal"
          />
        ))}
      </div>

      {openIndex !== null && (
        <CardDetail
          card={CARDS[openIndex]}
          lang={lang}
          talking={talking}
          onSayAll={speakAll}
          onClose={() => { stop(); setOpenIndex(null); }}
        />
      )}
    </>
  );
}
