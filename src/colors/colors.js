/* いろのデータ。
   fill はカードの塗り（にじいろだけグラデーション）、
   shade は押したときに沈む影の色。
   dark:true は白い文字を置くという意味、glow:true は文字に影をつけるという意味。 */

export const COLORS = [
  { en: "red",        ja: "あか",     fill: "#E4543C", shade: "#B33A25" },
  { en: "orange",     ja: "オレンジ", fill: "#F0873A", shade: "#C0641F" },
  { en: "yellow",     ja: "きいろ",   fill: "#F5CE3C", shade: "#C7A116" },
  { en: "green",      ja: "みどり",   fill: "#43A87A", shade: "#2C7D57", dark: true },
  { en: "light blue", ja: "みずいろ", fill: "#7FC9E8", shade: "#4E9CBD" },
  { en: "blue",       ja: "あお",     fill: "#3C82BE", shade: "#265F92", dark: true },
  { en: "purple",     ja: "むらさき", fill: "#8467AC", shade: "#5E4682", dark: true },
  { en: "pink",       ja: "ピンク",   fill: "#EE93B4", shade: "#C46484" },
  { en: "brown",      ja: "ちゃいろ", fill: "#8B6144", shade: "#63422C", dark: true },
  { en: "black",      ja: "くろ",     fill: "#26302F", shade: "#0E1414", dark: true },
  { en: "white",      ja: "しろ",     fill: "#FFFFFF", shade: "#C9D4D8" },
  {
    en: "rainbow", ja: "にじいろ",
    fill: "linear-gradient(135deg, #E4543C 0%, #F0873A 18%, #F5CE3C 36%, " +
          "#43A87A 54%, #3C82BE 72%, #8467AC 100%)",
    shade: "#6E5590",
    dark: true, glow: true,
  },
];

/** その色を lang で読ませるときの文字列 */
export const nameOf = (color, lang) => (lang === "ja" ? color.ja : color.en);
