/** 先に鳴らすことば。ヘッダの ABC / あいう で切り替える。 */
export const LOCALE = { en: "en-US", ja: "ja-JP" };

export const other = lang => (lang === "ja" ? "en" : "ja");

/** そのカードを lang で読ませるときの文字列 */
export const wordOf = (card, lang) => (lang === "ja" ? card.ja : card.en);
