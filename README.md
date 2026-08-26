# こどもアプリ（Kids Word Card）

未就学児向けの、タップすると音が鳴るカードアプリを集めたもの。
市販の「音の出る英語カード」玩具のデジタル版。

## 公開先

**https://kidapu.github.io/Kids-Word-Card/**

トップにアプリが並んでいて、そこから選ぶ。
iPad mini の Safari で開き、ホーム画面に追加して使うことを想定している。

| アプリ | URL | 中身 |
| --- | --- | --- |
| 🍎 おしゃべりカード | `/cards/` | ことばのカード 88 枚 |
| 🔤 もじカード | `/letters/` | アルファベット 26 字とひらがな 46 字 |

## おしゃべりカード

- **ABC / あいう**: 先に鳴らすことばを切り替える。**あいう** にすると日本語が主になり、
  カードの大きい文字も、自動再生も、クイズの出題もすべて日本語が先になる。
- **ずかんモード**: カード一覧 → タップで拡大表示。2つのことばが続けて自動再生される。
  **🔊 もういっかい** で同じ順にもう一度聞ける。
  下まで行くと次の巡りが継ぎ足されるので、いくらでもスクロールできる。
  **🔀** で混ぜ直し、**🗂** でカテゴリ順（どうぶつ → たべもの → …）に戻る。
- **クイズモード**: 音声が流れ、3枚から選ぶ。絵の下には出題したことばが出る。
  正解でピンポンと紙吹雪が出て、2つのことばで答えが返る。間違えたらブー。
- カードは 88 枚（どうぶつ / たべもの / のりもの / しぜん / みのまわり）。
  カテゴリごとに色が付く。絵柄は絵文字のプレースホルダ。

## もじカード

- **ABC / あいう**: アルファベットとひらがなを切り替える。
- **ずかんモード**: 五十音表・アルファベット表。押すとその文字を発音する。
- **クイズモード**: 文字が読まれて、3つから選ぶ。正解でピンポンと紙吹雪、間違えたらブー。

## 技術スタック

Vite + React 19 + Tailwind CSS v4。アプリごとに別ページのマルチページ構成。

```
index.html                       アプリをえらぶ画面
cards/index.html                 おしゃべりカード
letters/index.html               もじカード

src/shared/                      アプリ共通
  index.css                        Tailwind のテーマ（色・ブレークポイント）
  ui.jsx                           ヘッダの外枠とボタン類
  useSpeech.js                     読み上げ。将来 mp3 に差し替える窓口
  sfx.js                           ピンポン / ブー / ピン（Web Audio で合成）
  burst.js                         正解したときの紙吹雪
  lang.js                          en / ja の対応

src/home/                        アプリをえらぶ画面
src/cards/                       おしゃべりカード（cards.js にカードデータ）
src/letters/                     もじカード（letters.js に文字データ）
```

## 開発

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

### アプリを増やすとき

1. `<name>/index.html` を作る（既存のものをコピーして title と script src を変える）
2. `src/<name>/` に `main.jsx` と中身を置く
3. `vite.config.js` の `rollupOptions.input` に1行足す
4. `src/home/Home.jsx` の `APPS` に1行足す

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が
`npm run build` の結果を GitHub Pages に公開する。

`vite.config.js` の `base` は Pages のパス（`/Kids-Word-Card/`）に合わせてある。

## 方針

設計の原則・やること・保留にしている機能は [CLAUDE.md](./CLAUDE.md) にまとめてある。
