# 開発の手引き

## 技術スタック

Vite + React 19 + Tailwind CSS v4。アプリごとに別ページのマルチページ構成で、
ルーターは入れていない。

そうしている理由:

- 静的ホスティング（GitHub Pages）のまま動く。404 のリライトが要らない
- 開いたアプリの JS だけ読み込まれる。React 本体は共有チャンクになるのでキャッシュも効く
- 片方のアプリを壊しても、もう片方に影響しない

Tailwind は `@tailwindcss/vite` プラグイン方式。設定ファイルは持たず、
`src/shared/index.css` の `@theme` に色とブレークポイントを書いている。

## ファイルの置き場所

```
index.html                       アプリをえらぶ画面
cards/index.html                 おしゃべりカード
counting/index.html              かずカード
letters/index.html               もじカード

src/shared/                      アプリ共通
  index.css                        Tailwind のテーマ（色・ブレークポイント）
  ui.jsx                           ヘッダの外枠とボタン類
  useSpeech.js                     読み上げ。将来 mp3 に差し替える窓口
  sfx.js                           ピンポン / ブー / ピン（Web Audio で合成）
  burst.js                         正解したときの紙吹雪
  lang.js                          en / ja の対応

src/home/                        アプリをえらぶ画面
src/cards/                       おしゃべりカード
  cards.js                         カードデータ（1行足せばカードが増える）
  components/                      Card / BookMode / QuizMode
src/counting/                    かずカード
  counting.js                      数と、数える絵
  components/                      NumberCard / NumberTable / CountQuiz
src/letters/                     もじカード
  letters.js                       文字データと読み方の差し替え
  components/                      Letter / LetterTable / LetterQuiz
```

## コマンド

```sh
npm install
npm run dev          # http://localhost:5173/Kids-Word-Card/
npm run build        # dist/ に出力
npm run preview      # ビルド結果を確認
```

実機で確認するときは LAN に公開する:

```sh
npm run dev -- --host
# → http://<開発機のIP>:5173/Kids-Word-Card/ を iPad の Safari で開く
```

音まわりを触ったら必ず実機で鳴らすこと。

## レイアウトの前提

ブレークポイントは iPad mini を基準にしている。縦(744px)で 4 列、横(1133px)で 5 列に
なるよう `--breakpoint-md` を 44rem に下げてある。数字を触るときはこの前提を壊さないこと。

ヘッダのボタンは iPad mini 縦で 1 行に収める。入りきらないときは、
シャッフルなどのラベルを `hidden lg:inline` で隠して絵文字だけにする。

## 音の扱い

読み上げは `src/shared/useSpeech.js` の `useSpeech` フックだけを窓口にしている。
mp3 に差し替えるときはここを直せば全アプリに効く。

`speakAll([{ text, lang }, ...], onDone)` で複数を順に読める。
`onDone` は全部読み終わったときに呼ばれる（止めたときにも呼ばれる）。

効果音は音声ファイルを持たず `src/shared/sfx.js` で Web Audio 合成している。
オフラインで完結し、容量も増えず、iOS で読み込みを待たなくて済む。

### 読み方が変なとき

`src/letters/letters.js` の `SAY` に読み方を書いて差し替える。すでに入っているもの:

- アルファベットは**大文字のまま渡すと「Capital A」と読まれる**ので、読み上げには
  小文字を渡している（表示は大文字のまま）。小文字にするだけで 26 文字すべて正しい。
- **綴りで書き直そうとしないこと。** `A` を `ay` にすると「アイ」になる。
- 「を」「ん」は 1 文字だと読み飛ばされることがあるので読み仮名で補っている。

読み方を確かめたいときは macOS の `say` で書き出して長さを比べるとよい。
同じ音なら長さもハッシュも一致する。

```sh
say -v Samantha "a" -o a.aiff && afinfo a.aiff | grep duration
```

大文字は 0.8 秒前後、小文字は 0.3〜0.5 秒なので、「Capital」の有無がすぐ分かる。

## クイズのタイマー

`setTimeout` は、問題が変わるたびに**全部捨てる**こと。前の問題のタイマー
（特に読み上げが返ってこないとき用の 6 秒の保険）が残っていると、次の問題の
読み上げ中に発火して問題を飛ばす。速く連続で正解したときだけ起きるので気づきにくい。

## アプリを増やすとき

1. `<name>/index.html` を作る（既存のものをコピーして title と script src を変える）
2. `src/<name>/` に `main.jsx` と中身を置く
3. `vite.config.js` の `rollupOptions.input` に 1 行足す
4. `src/home/Home.jsx` の `APPS` に 1 行足す

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が
`npm run build` の結果を GitHub Pages に公開する。

`vite.config.js` の `base` は Pages のパス（`/Kids-Word-Card/`）。
ここを変えると公開先で 404 になる。
