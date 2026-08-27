/** アプリをえらぶ画面。増えたらここに1行足す。 */
const APPS = [
  {
    path: "cards/",
    art: "🍎",
    name: "おしゃべりカード",
    sub: "ことばを きく",
    tint: "var(--color-red)",
  },
  {
    path: "counting/",
    art: "🔢",
    name: "かずカード",
    sub: "いくつ？ を あてる",
    tint: "var(--color-green)",
  },
  {
    path: "colors/",
    art: "🎨",
    name: "いろカード",
    sub: "いろの なまえ",
    tint: "var(--color-purple)",
  },
  {
    path: "maze/",
    art: "🐰",
    name: "めいろ",
    sub: "ゆびで ゴールまで",
    tint: "var(--color-yellow)",
  },
  {
    path: "letters/",
    art: "🔤",
    name: "もじカード",
    sub: "ABC と あいうえお",
    tint: "var(--color-blue)",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-[56rem] flex-col justify-center px-5 py-10">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-7">
        {APPS.map(app => (
          <a
            key={app.path}
            href={import.meta.env.BASE_URL + app.path}
            style={{ "--tint": app.tint }}
            className="pressable flex flex-col items-center gap-2 rounded-[26px] bg-paper-soft
                       px-5 pt-9 pb-7 font-round text-ink no-underline"
          >
            <span className="text-[clamp(64px,18vw,104px)] leading-none
                             [filter:drop-shadow(0_4px_6px_rgba(0,0,0,.14))]">
              {app.art}
            </span>
            <span className="mt-1 text-xl font-extrabold md:text-2xl">{app.name}</span>
            <span className="text-sm font-bold text-ink-soft">{app.sub}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
