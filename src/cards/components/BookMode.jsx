import { useEffect, useRef, useState } from "react";
import { CARDS, wordOf } from "../cards.js";
import { LOCALE, other } from "../../shared/lang.js";
import { Card } from "./Card.jsx";

/**
 * ずかん。カードを押すと、その場で2つのことばを続けて読む。
 * pages は「88枚ひと巡り」の配列で、下まで来ると App が次の巡りを足す。
 * seed が変わるとグリッドごと作り直されて、カードが配られる演出が走る。
 */
export function BookMode({ pages, onNeedMore, seed, lang, speakAll }) {
  const [saying, setSaying] = useState(null);   // いま喋っているカードの位置
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

  const say = (card, at) => {
    const second = other(lang);
    setSaying(at);
    speakAll(
      [
        { text: wordOf(card, lang),   lang: LOCALE[lang] },
        { text: wordOf(card, second), lang: LOCALE[second] },
      ],
      // 途中で別のカードを押されたら、そちらの光りを消さないようにする
      () => setSaying(s => (s === at ? null : s))
    );
  };

  return (
    <>
      <div
        key={seed}
        className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      >
        {pages.map((order, page) =>
          order.map((i, pos) => {
            const at = `${page}-${pos}`;
            return (
              <Card
                key={at}
                card={CARDS[i]}
                lang={lang}
                talking={saying === at}
                onClick={() => say(CARDS[i], at)}
                // 配られる演出は最初の巡りだけ。継ぎ足し分はすぐ出す。
                delay={page === 0 ? Math.min(pos, 14) * 22 : 0}
                className="animate-deal"
              />
            );
          })
        )}
      </div>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
    </>
  );
}
