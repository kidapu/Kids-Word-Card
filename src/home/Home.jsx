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
    path: "trace/",
    art: "✏️",
    name: "なぞりカード",
    sub: "もじを ゆびで なぞる",
    tint: "var(--color-green)",
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
    <div className="mx-auto flex min-h-svh max-w-[52rem] flex-col justify-center px-4 py-6">
      {/* iPad mini の縦（744px）で 3 列 2 段。開いた画面にぜんぶ収まる大きさにしてある */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6">
        {APPS.map(app => (
          <a
            key={app.path}
            href={import.meta.env.BASE_URL + app.path}
            style={{ "--tint": app.tint }}
            className="pressable flex flex-col items-center gap-1.5 rounded-[26px] bg-paper-soft
                       px-3 pt-6 pb-5 font-round text-ink no-underline"
          >
            <span className="text-[clamp(52px,13vw,84px)] leading-none
                             [filter:drop-shadow(0_4px_6px_rgba(0,0,0,.14))]">
              {app.art}
            </span>
            <span className="mt-0.5 text-base font-extrabold sm:text-lg md:text-xl">{app.name}</span>
            <span className="text-xs font-bold text-ink-soft sm:text-sm">{app.sub}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
