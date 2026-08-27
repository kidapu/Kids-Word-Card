/* いろのデータ。
   hex はカードの色、shade は押したときに沈む影の色（hex を暗くしたもの）。
   dark:true は、その色の上に白い文字を置くという意味。 */

export const COLORS = [
  { en: "red",    ja: "あか",     hex: "#E4543C", shade: "#B33A25" },
  { en: "orange", ja: "オレンジ", hex: "#F0873A", shade: "#C0641F" },
  { en: "yellow", ja: "きいろ",   hex: "#F5CE3C", shade: "#C7A116" },
  { en: "green",  ja: "みどり",   hex: "#43A87A", shade: "#2C7D57", dark: true },
  { en: "blue",   ja: "あお",     hex: "#3C82BE", shade: "#265F92", dark: true },
  { en: "purple", ja: "むらさき", hex: "#8467AC", shade: "#5E4682", dark: true },
  { en: "pink",   ja: "ピンク",   hex: "#EE93B4", shade: "#C46484" },
  { en: "brown",  ja: "ちゃいろ", hex: "#8B6144", shade: "#63422C", dark: true },
  { en: "black",  ja: "くろ",     hex: "#26302F", shade: "#0E1414", dark: true },
  { en: "white",  ja: "しろ",     hex: "#FFFFFF", shade: "#C9D4D8" },
];

/** その色を lang で読ませるときの文字列 */
export const nameOf = (color, lang) => (lang === "ja" ? color.ja : color.en);

export const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
