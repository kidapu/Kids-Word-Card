import { useEffect, useRef, useState } from "react";
import { CARDS } from "../cards.js";
import { Card } from "./Card.jsx";
import { CardDetail } from "./CardDetail.jsx";

/**
 * ずかん。pages は「88枚ひと巡り」の配列で、下まで来ると App が次の巡りを足す。
 * seed が変わるとグリッドごと作り直されて、カードが配られる演出が走る。
 */
export function BookMode({ pages, onNeedMore, seed, lang, speakAll, stop, talking }) {
  const [openIndex, setOpenIndex] = useState(null);
  const sentinel = useRef(null);

  // 下端が近づいたら次の巡りを足す。600px 手前で先に呼んで、継ぎ目を感じさせない。
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) onNeedMore(); },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onNeedMore]);

  return (
    <>
      <div
        key={seed}
        className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        {pages.map((order, page) =>
          order.map((i, pos) => (
            <Card
              key={`${page}-${pos}`}
              card={CARDS[i]}
              lang={lang}
              onClick={() => setOpenIndex(i)}
              // 配られる演出は最初の巡りだけ。継ぎ足し分はすぐ出す。
              delay={page === 0 ? Math.min(pos, 14) * 22 : 0}
              className="animate-deal"
            />
          ))
        )}
      </div>
      <div ref={sentinel} aria-hidden="true" className="h-px" />

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
