import { Users, Video, Mic, Globe } from 'lucide-react';

export default function Navbar({ abaAtiva, setAbaAtiva }: any) {
  const icones = [
    { id: 'amigos', icon: Users },
    { id: 'videos', icon: Video },
    { id: 'podcast', icon: Mic },
    { id: 'explorer', icon: Globe },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-20 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[30px] flex justify-around items-center z-50">
      {icones.map((item) => (
        <button 
          key={item.id}
          onClick={() => setAbaAtiva(item.id)}
          className={`p-4 rounded-2xl transition-all ${abaAtiva === item.id ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}
        >
          <item.icon size={24} />
        </button>
      ))}
    </nav>
  );
}

