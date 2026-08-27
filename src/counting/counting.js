/* かずのデータ。数える絵は ITEMS から毎回ひとつ選ぶ。 */

export const TINTS = [
  "var(--color-red)",
  "var(--color-yellow)",
  "var(--color-green)",
  "var(--color-blue)",
  "var(--color-purple)",
];

/** 未就学児が数えられる範囲。増やすならここに足す。 */
export const NUMBERS = [
  { n: 1,  ja: "いち",   en: "one" },
  { n: 2,  ja: "に",     en: "two" },
  { n: 3,  ja: "さん",   en: "three" },
  { n: 4,  ja: "よん",   en: "four" },
  { n: 5,  ja: "ご",     en: "five" },
  { n: 6,  ja: "ろく",   en: "six" },
  { n: 7,  ja: "なな",   en: "seven" },
  { n: 8,  ja: "はち",   en: "eight" },
  { n: 9,  ja: "きゅう", en: "nine" },
  { n: 10, ja: "じゅう", en: "ten" },
];

/** 数える対象。ぱっと見て何個か分かる、輪郭のはっきりしたものだけ。 */
export const ITEMS = [
  "🍎", "🍌", "🍓", "🍪", "🍰",
  "🐶", "🐱", "🐰", "🐤", "🐟",
  "⭐", "🎈", "🌸", "🚗", "⚽",
];

/** 数字の読み方。助数詞は付けず、数だけ読む。 */
export const sayNumber = (n, lang) => {
  const item = NUMBERS.find(x => x.n === n);
  return lang === "ja" ? item.ja : item.en;
};

/** 「いくつ？」の問いかけ */
export const ASK = { ja: "これは いくつ？", en: "How many?" };

export const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
