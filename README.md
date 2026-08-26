# おしゃべりカード（Kids Word Card）

未就学児向けの、絵カードをタップすると英語と日本語の発音が鳴るアプリ。
市販の「音の出る英語カード」玩具のデジタル版。

## 公開先

**https://kidapu.github.io/Kids-Word-Card/**

iPad mini の Safari で開き、ホーム画面に追加して使うことを想定している。

## できること

- **ABC / あいう**: 先に鳴らすことばを切り替える。**あいう** にすると日本語が主になり、
  カードの大きい文字も、自動再生も、クイズの出題もすべて日本語が先になる。
- **ずかんモード**: カード一覧 → タップで拡大表示。2つのことばが続けて自動再生される。
  **🔊 もういっかい** で同じ順にもう一度聞ける。
  下まで行くと次の巡りが継ぎ足されるので、いくらでもスクロールできる。
  **🔀 シャッフル** で混ぜ直し、**🗂 カテゴリ** でカテゴリ順（どうぶつ → たべもの → …）に戻る。
- **クイズモード**: 音声が流れ、3枚から選ぶ。絵の下には出題したことばが出る。
  正解でピンポンと紙吹雪が出て、出題とは逆のことばで答えが返る。間違えたらブー。
  上のメニューを押すと「ピン」と鳴る。
- カードは 88 枚（どうぶつ / たべもの / のりもの / しぜん / みのまわり）。
  カテゴリごとに色が付く。
- 音声は Web Speech API（`speechSynthesis`）。事前生成した mp3 に差し替える予定。
- 絵柄は絵文字のプレースホルダ。

## 技術スタック

Vite + React 19 + Tailwind CSS v4。

```
index.html                    Vite のエントリ
src/cards.js                  カードデータ（ここに1行足せばカードが増える）
src/useSpeech.js              読み上げ。将来 mp3 に差し替える窓口
src/lang.js                   先に鳴らすことばの扱い
src/burst.js                  正解したときの紙吹雪
src/sfx.js                    ピンポン / ブーの効果音（Web Audio で合成）
src/App.jsx                   モード切り替えとヘッダ
src/components/Card.jsx       カード1枚
src/components/CardDetail.jsx 拡大表示
src/components/BookMode.jsx   ずかん
src/components/QuizMode.jsx   クイズ
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

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が
`npm run build` の結果を GitHub Pages に公開する。

`vite.config.js` の `base` は Pages のパス（`/Kids-Word-Card/`）に合わせてある。

## 方針

設計の原則・やること・保留にしている機能は [CLAUDE.md](./CLAUDE.md) にまとめてある。
