import { Heart, Share2, Play } from 'lucide-react';

export default function VideoFeed() {
  return (
    <div className="relative aspect-[9/16] w-full bg-zinc-900 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
      <Play size={48} className="text-white/20" />
      <div className="absolute bottom-8 left-6">
        <p className="font-bold">@michel_dev</p>
        <p className="text-xs text-zinc-400">Desenvolvendo 16 projetos pelo mobile...</p>
      </div>
      <div className="absolute right-4 bottom-20 flex flex-col gap-6">
        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full">❤️</button>
        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full"><Share2 size={20}/></button>
      </div>
    </div>
  );
}

