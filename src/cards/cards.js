/* カードデータ：ここに1行足すだけでカードが増えます。
   cat は色分けにだけ使っています（TINT を参照）。
   本番では art を画像に、音声を事前生成した mp3 に差し替える想定。 */
export const TINT = {
  animal:  "var(--color-yellow)",
  food:    "var(--color-red)",
  vehicle: "var(--color-blue)",
  nature:  "var(--color-green)",
  thing:   "var(--color-purple)"
};

export const CARDS = [
  /* ---- どうぶつ ---- */
  {art:"🐶", en:"dog",        ja:"いぬ",        cat:"animal"},
  {art:"🐱", en:"cat",        ja:"ねこ",        cat:"animal"},
  {art:"🐰", en:"rabbit",     ja:"うさぎ",      cat:"animal"},
  {art:"🐻", en:"bear",       ja:"くま",        cat:"animal"},
  {art:"🐼", en:"panda",      ja:"パンダ",      cat:"animal"},
  {art:"🦁", en:"lion",       ja:"ライオン",    cat:"animal"},
  {art:"🐯", en:"tiger",      ja:"とら",        cat:"animal"},
  {art:"🐵", en:"monkey",     ja:"さる",        cat:"animal"},
  {art:"🐘", en:"elephant",   ja:"ぞう",        cat:"animal"},
  {art:"🦒", en:"giraffe",    ja:"きりん",      cat:"animal"},
  {art:"🐮", en:"cow",        ja:"うし",        cat:"animal"},
  {art:"🐷", en:"pig",        ja:"ぶた",        cat:"animal"},
  {art:"🐴", en:"horse",      ja:"うま",        cat:"animal"},
  {art:"🐑", en:"sheep",      ja:"ひつじ",      cat:"animal"},
  {art:"🐔", en:"chicken",    ja:"にわとり",    cat:"animal"},
  {art:"🐤", en:"chick",      ja:"ひよこ",      cat:"animal"},
  {art:"🐦", en:"bird",       ja:"とり",        cat:"animal"},
  {art:"🐧", en:"penguin",    ja:"ペンギン",    cat:"animal"},
  {art:"🐸", en:"frog",       ja:"かえる",      cat:"animal"},
  {art:"🐟", en:"fish",       ja:"さかな",      cat:"animal"},
  {art:"🐬", en:"dolphin",    ja:"いるか",      cat:"animal"},
  {art:"🐢", en:"turtle",     ja:"かめ",        cat:"animal"},
  {art:"🐝", en:"bee",        ja:"はち",        cat:"animal"},
  {art:"🦋", en:"butterfly",  ja:"ちょうちょ",  cat:"animal"},

  /* ---- たべもの ---- */
  {art:"🍎", en:"apple",      ja:"りんご",      cat:"food"},
  {art:"🍌", en:"banana",     ja:"バナナ",      cat:"food"},
  {art:"🍇", en:"grapes",     ja:"ぶどう",      cat:"food"},
  {art:"🍓", en:"strawberry", ja:"いちご",      cat:"food"},
  {art:"🍉", en:"watermelon", ja:"すいか",      cat:"food"},
  {art:"🍊", en:"orange",     ja:"みかん",      cat:"food"},
  {art:"🍅", en:"tomato",     ja:"トマト",      cat:"food"},
  {art:"🥕", en:"carrot",     ja:"にんじん",    cat:"food"},
  {art:"🌽", en:"corn",       ja:"とうもろこし", cat:"food"},
  {art:"🍞", en:"bread",      ja:"パン",        cat:"food"},
  {art:"🍚", en:"rice",       ja:"ごはん",      cat:"food"},
  {art:"🍙", en:"rice ball",  ja:"おにぎり",    cat:"food"},
  {art:"🍜", en:"noodles",    ja:"ラーメン",    cat:"food"},
  {art:"🍛", en:"curry",      ja:"カレー",      cat:"food"},
  {art:"🥚", en:"egg",        ja:"たまご",      cat:"food"},
  {art:"🥛", en:"milk",       ja:"ぎゅうにゅう", cat:"food"},
  {art:"🍰", en:"cake",       ja:"ケーキ",      cat:"food"},
  {art:"🍪", en:"cookie",     ja:"クッキー",    cat:"food"},
  {art:"🍦", en:"ice cream",  ja:"アイス",      cat:"food"},
  {art:"🍬", en:"candy",      ja:"キャンディ",  cat:"food"},

  /* ---- のりもの ---- */
  {art:"🚗", en:"car",         ja:"くるま",         cat:"vehicle"},
  {art:"🚌", en:"bus",         ja:"バス",           cat:"vehicle"},
  {art:"🚕", en:"taxi",        ja:"タクシー",       cat:"vehicle"},
  {art:"🚑", en:"ambulance",   ja:"きゅうきゅうしゃ", cat:"vehicle"},
  {art:"🚒", en:"fire engine", ja:"しょうぼうしゃ",  cat:"vehicle"},
  {art:"🚓", en:"police car",  ja:"パトカー",       cat:"vehicle"},
  {art:"🚚", en:"truck",       ja:"トラック",       cat:"vehicle"},
  {art:"🚲", en:"bicycle",     ja:"じてんしゃ",     cat:"vehicle"},
  {art:"🚃", en:"train",       ja:"でんしゃ",       cat:"vehicle"},
  {art:"✈️", en:"airplane",    ja:"ひこうき",       cat:"vehicle"},
  {art:"🚢", en:"ship",        ja:"ふね",           cat:"vehicle"},
  {art:"🚀", en:"rocket",      ja:"ロケット",       cat:"vehicle"},

  /* ---- しぜん ---- */
  {art:"☀️", en:"sun",       ja:"たいよう",     cat:"nature"},
  {art:"🌙", en:"moon",      ja:"つき",         cat:"nature"},
  {art:"⭐", en:"star",      ja:"ほし",         cat:"nature"},
  {art:"☁️", en:"cloud",     ja:"くも",         cat:"nature"},
  {art:"☔", en:"rain",      ja:"あめ",         cat:"nature"},
  {art:"❄️", en:"snow",      ja:"ゆき",         cat:"nature"},
  {art:"⛄", en:"snowman",   ja:"ゆきだるま",   cat:"nature"},
  {art:"🌈", en:"rainbow",   ja:"にじ",         cat:"nature"},
  {art:"🌸", en:"flower",    ja:"おはな",       cat:"nature"},
  {art:"🌳", en:"tree",      ja:"き",           cat:"nature"},
  {art:"🍁", en:"leaf",      ja:"はっぱ",       cat:"nature"},
  {art:"🌊", en:"sea",       ja:"うみ",         cat:"nature"},

  /* ---- みのまわり ---- */
  {art:"👀", en:"eyes",      ja:"め",           cat:"thing"},
  {art:"👂", en:"ear",       ja:"みみ",         cat:"thing"},
  {art:"👄", en:"mouth",     ja:"くち",         cat:"thing"},
  {art:"✋", en:"hand",      ja:"て",           cat:"thing"},
  {art:"🦶", en:"foot",      ja:"あし",         cat:"thing"},
  {art:"👕", en:"shirt",     ja:"シャツ",       cat:"thing"},
  {art:"👟", en:"shoes",     ja:"くつ",         cat:"thing"},
  {art:"🧦", en:"socks",     ja:"くつした",     cat:"thing"},
  {art:"🧢", en:"cap",       ja:"ぼうし",       cat:"thing"},
  {art:"☂️", en:"umbrella",  ja:"かさ",         cat:"thing"},
  {art:"🏠", en:"house",     ja:"いえ",         cat:"thing"},
  {art:"🛏️", en:"bed",       ja:"ベッド",       cat:"thing"},
  {art:"🪑", en:"chair",     ja:"いす",         cat:"thing"},
  {art:"🚪", en:"door",      ja:"ドア",         cat:"thing"},
  {art:"📕", en:"book",      ja:"ほん",         cat:"thing"},
  {art:"✏️", en:"pencil",    ja:"えんぴつ",     cat:"thing"},
  {art:"🕐", en:"clock",     ja:"とけい",       cat:"thing"},
  {art:"🔑", en:"key",       ja:"かぎ",         cat:"thing"},
  {art:"🎈", en:"balloon",   ja:"ふうせん",     cat:"thing"},
  {art:"⚽", en:"ball",      ja:"ボール",       cat:"thing"}
];

export const shuffle = a => a.map(v => [Math.random(), v]).sort((x,y) => x[0]-y[0]).map(v => v[1]);

/** そのカードを lang（"en" | "ja"）で読ませるときの文字列 */
export const wordOf = (card, lang) => (lang === "ja" ? card.ja : card.en);
