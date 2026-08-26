/** アプリ共通の見た目。ヘッダのボタン類と、全体の外枠。 */

/** 画面の外枠。ヘッダは中身を渡すと sticky で出しっぱなしになる。 */
export function Shell({ header, children }) {
  return (
    <div className="mx-auto max-w-[68rem] px-4 pb-14 md:px-6">
      {/* スクロールしても出しっぱなしにする。中身が透けて見えるよう半透明 + ぼかし */}
      <header
        className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-paper/80 px-4 py-3
                   backdrop-blur-md shadow-[0_2px_14px_rgba(20,40,50,.07)]
                   md:-mx-6 md:gap-3 md:px-6 md:py-4"
      >
        {header}
      </header>
      <main>{children}</main>
    </div>
  );
}

/** アプリ一覧へ戻る */
export function HomeButton({ onClick }) {
  return (
    <a
      href={import.meta.env.BASE_URL}
      onClick={onClick}
      aria-label="アプリをえらぶ"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink
                 bg-white/70 text-xl no-underline shadow-[0_3px_0_rgba(20,40,50,.12)]
                 transition-[transform,box-shadow] duration-100
                 active:translate-y-0.5 active:shadow-none"
    >
      🏠
    </a>
  );
}

/** 単発のボタン（シャッフルなど）。狭い画面では絵文字だけになるので label は必ず渡す。 */
export function Tool({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="shrink-0 cursor-pointer rounded-full border-0 bg-white/70 px-4 py-2.5 font-round
                 text-sm font-extrabold text-ink shadow-[0_3px_0_rgba(20,40,50,.12)]
                 transition-[transform,box-shadow] duration-100
                 active:translate-y-0.5 active:shadow-none md:px-5 md:text-base"
    >
      {children}
    </button>
  );
}

/** 2択のトグルの入れもの */
export function Pills({ className = "", children }) {
  return (
    <div className={"flex shrink-0 gap-0.5 rounded-full border border-ink bg-white/70 p-1 " + className}>
      {children}
    </div>
  );
}

export function Pill({ on, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={
        "cursor-pointer rounded-full border-0 px-4 py-2.5 font-round text-sm font-extrabold " +
        "md:px-5 md:text-base " +
        (on ? "bg-ink text-white" : "bg-transparent text-ink-soft")
      }
    >
      {children}
    </button>
  );
}
