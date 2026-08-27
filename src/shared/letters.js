/* もじのデータ。行ごとに並べているので、五十音表の形をそのまま出せる。
   色は行ごとに変えている（TINTS を順に使う）。 */

export const TINTS = [
  "var(--color-red)",
  "var(--color-yellow)",
  "var(--color-green)",
  "var(--color-blue)",
  "var(--color-purple)",
];

const ALPHABET_ROWS = [
  ["A", "B", "C", "D", "E"],
  ["F", "G", "H", "I", "J"],
  ["K", "L", "M", "N", "O"],
  ["P", "Q", "R", "S", "T"],
  ["U", "V", "W", "X", "Y"],
  ["Z"],
];

const NUMBER_ROWS = [
  ["1", "2", "3", "4", "5"],
  ["6", "7", "8", "9", "0"],
];

const KANA_ROWS = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "ゆ", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "を", "ん"],
];

/**
 * 読ませ方が文字と違うものだけ書いておく。
 * ひらがなを1文字だけ渡すと読み飛ばされることがあるので、読み仮名で補う。
 *
 * アルファベットはここに書かない。大文字のまま渡すと「Capital A」と読まれるので
 * 小文字にするだけでよく、26 文字すべてそれで正しい文字名になる（実測ずみ）。
 * 綴りで書こうとすると別の単語として読まれる（"ay" は「アイ」になってしまう）。
 */
const SAY = {
  ja: { "を": "お", "ん": "ンー" },
  en: {},
};

export const SETS = {
  en:  { rows: ALPHABET_ROWS, label: "アルファベット" },
  ja:  { rows: KANA_ROWS,     label: "ひらがな" },
  // なぞりカードだけで使う。もじカードのトグルは あいう / ABC の 2 つのまま。
  num: { rows: NUMBER_ROWS,   label: "すうじ" },
};

/** 表示は文字そのまま、読み上げだけ差し替える */
export const sayOf = (letter, kind) =>
  SAY[kind][letter] ?? (kind === "en" ? letter.toLowerCase() : letter);

/** 行構造を平らにして、行番号（＝色）を添える */
export const flatten = kind =>
  SETS[kind].rows.flatMap((row, r) => row.map(letter => ({ letter, row: r })));
