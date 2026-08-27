/**
 * クイズ画面の枠。スコアと 3 択の並びは全アプリ共通なので、ここにまとめている。
 *
 * - above    3 択の上に出すもの（かずカードの、数える絵など）
 * - onReplay 渡すと「もういちど きく」ボタンが出る。要らないアプリは省く
 * - wide     カードが大きいアプリ（おしゃべりカード）で幅を広げる
 */
export function QuizScreen({ score, above, onReplay, talking, wide = false, children }) {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p className="text-[13px] font-bold tracking-[.1em] text-ink-soft">
        {score.hit} / {score.tries}
      </p>

      {above}

      {onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className={
            "mt-1.5 mb-6 cursor-pointer rounded-full border-0 bg-ink px-8 py-4 font-round " +
            "text-lg font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,.25)] " +
            "transition-[transform,box-shadow] duration-100 " +
            "active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,.25)] " +
            (talking ? "animate-wobble" : "")
          }
        >
          🔊 もういちど きく
        </button>
      )}

      <div
        className={
          "grid w-full grid-cols-3 gap-4 md:gap-6 " + (wide ? "max-w-[54rem]" : "max-w-[36rem]")
        }
      >
        {children}
      </div>
    </div>
  );
}
