# おしゃべりカード（Kids Word Card）

未就学児向けの、絵カードをタップすると英語と日本語の発音が鳴るアプリ。
市販の「音の出る英語カード」玩具のデジタル版。

**公開先**: https://kidapu.github.io/Kids-Word-Card/

iPad / iPhone の Safari で開き、ホーム画面に追加して使うことを想定している。

## 現状

`index.html` が単一ファイルの試作版。

- **ずかんモード**: カード一覧 → タップで拡大表示、英語が自動再生。
  英語 / にほんご のボタンで聞き分け。聞いたカードには ⭐ が付く。
- **クイズモード**: 英語の音声が流れ、3枚から選ぶ。正解で紙吹雪。
- 音声は Web Speech API（`speechSynthesis`）。試作用で、事前生成 mp3 に差し替え予定。
- カードデータは `CARDS` 配列にベタ書き。絵柄は絵文字のプレースホルダ。

## 開発

ビルド不要。`index.html` をブラウザで開くだけで動く。

実機確認するときは LAN に公開する:

```sh
python3 -m http.server 8000
# → http://<開発機のIP>:8000/ を iPad の Safari で開く
```

音まわりを触ったら必ず実機で鳴らすこと。

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が
リポジトリルートをそのまま GitHub Pages に公開する。

Vite 化したあとは、workflow に `npm ci && npm run build` を足して
`path: ./dist` に切り替える。

## 方針

設計の原則・やること・保留にしている機能は [CLAUDE.md](./CLAUDE.md) にまとめてある。
