export default function HeaderElite() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
      <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
        OIO VIBE ELITE
      </h1>
      <div className="flex gap-4 text-zinc-400">
        <span>📸</span>
        <span>🔔</span>
      </div>
    </header>
  );
}
