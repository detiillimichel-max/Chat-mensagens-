"use client";
import React, { useState } from 'react';
import { Users, Video, Mic, Globe, Search, Camera, FolderOpen, Phone, VideoIcon, MoreVertical, Share2, Play } from 'lucide-react';

export default function OIOVibeElite() {
  const [abaAtiva, setAbaAtiva] = useState('amigos');

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500">
      
      {/* HEADER LUXURY COM SEU PERFIL */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent">
          OIO VIBE <span className="text-cyan-500 text-[10px] px-1 border border-cyan-500/50 rounded ml-1">PRO</span>
        </h1>
        <div className="flex items-center gap-5">
          <Search size={20} className="text-zinc-400" />
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 p-[1px]">
            <div className="w-full h-full rounded-full bg-black border border-black/50 overflow-hidden">
                <img src="https://github.com/detiillimichel-max.png" alt="Perfil" />
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO DINÂMICO POR ABAS */}
      <div className="pt-24 pb-32 px-4">
        
        {/* ABA AMIGOS (ESTILO TELEGRAM PREMIUM) */}
        {abaAtiva === 'amigos' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Agenda de Contatos</h2>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">6 ONLINE</span>
            </div>
            
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10 shadow-lg relative">
                    <Users size={20} className="text-cyan-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Contato {i}</p>
                    <p className="text-[10px] text-zinc-500 italic">Visto por último às 14:3{i}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-cyan-400 transition-colors"><Mic size={18} /></button>
                  <button className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-cyan-400 transition-colors"><Phone size={18} /></button>
                  <button className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-cyan-400 transition-colors"><VideoIcon size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA VÍDEOS (ESTILO TIKTOK) */}
        {abaAtiva === 'videos' && (
          <div className="space-y-4 animate-in zoom-in-95 duration-500">
            <div className="relative aspect-[9/16] w-full bg-zinc-900 rounded-[40px] border border-white/10 overflow-hidden group shadow-2xl flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
               <Play size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
               <div className="absolute bottom-8 left-6 right-6">
                  <p className="font-bold mb-1">@michel_dev</p>
                  <p className="text-xs text-zinc-400 line-clamp-2">Testando a integração de câmera e galeria...</p>
               </div>
               <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">❤️</div>
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"><Share2 size={20}/></div>
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"><MoreVertical size={20}/></div>
               </div>
            </div>
            <div className="flex gap-2">
                <button className="flex-1 bg-white text-black h-14 rounded-2xl font-bold flex items-center justify-center gap-2 tracking-tighter active:scale-95 transition">
                    <Camera size={20} /> USAR CÂMERA
                </button>
                <button className="w-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center active:scale-95 transition">
                    <FolderOpen size={20} />
                </button>
            </div>
          </div>
        )}

        {/* ABA PODCAST (ÁUDIOS DA GALERIA) */}
        {abaAtiva === 'podcast' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-8 bg-gradient-to-br from-indigo-900/40 via-black to-black rounded-[40px] border border-indigo-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Mic size={80}/></div>
              <h3 className="font-bold text-xl mb-2">Podcast Hub</h3>
              <p className="text-sm text-zinc-400 mb-8">Selecione áudios da sua galeria e compartilhe com sua rede.</p>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 p-5 rounded-3xl font-black transition-all flex items-center justify-center gap-3">
                <FolderOpen size={20}/> SELECIONAR ÁUDIO
              </button>
            </div>
          </div>
        )}

        {/* ABA EXPLORER (OUTRAS REDES) */}
        {abaAtiva === 'explorer' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 text-center">
            <div className="bg-white/5 border border-white/5 p-10 rounded-[40px] border-dashed">
              <Globe size={40} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-sm font-bold text-zinc-400">Importador de Conteúdo</p>
              <p className="text-[10px] text-zinc-600 mt-2 italic">Traga vídeos do Instagram, TikTok ou YouTube para o Vibe</p>
            </div>
          </div>
        )}

      </div>

      {/* BARRA DE NAVEGAÇÃO PREMIUM (GLASS) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-20 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[30px] flex justify-around items-center px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <button onClick={() => setAbaAtiva('amigos')} className={`p-4 rounded-2xl transition-all duration-300 ${abaAtiva === 'amigos' ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}>
          <Users size={24} strokeWidth={abaAtiva === 'amigos' ? 2.5 : 1.5} />
        </button>
        <button onClick={() => setAbaAtiva('videos')} className={`p-4 rounded-2xl transition-all duration-300 ${abaAtiva === 'videos' ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}>
          <Video size={24} strokeWidth={abaAtiva === 'videos' ? 2.5 : 1.5} />
        </button>
        <button onClick={() => setAbaAtiva('podcast')} className={`p-4 rounded-2xl transition-all duration-300 ${abaAtiva === 'podcast' ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}>
          <Mic size={24} strokeWidth={abaAtiva === 'podcast' ? 2.5 : 1.5} />
        </button>
        <button onClick={() => setAbaAtiva('explorer')} className={`p-4 rounded-2xl transition-all duration-300 ${abaAtiva === 'explorer' ? 'bg-white/10 text-cyan-400' : 'text-zinc-500'}`}>
          <Globe size={24} strokeWidth={abaAtiva === 'explorer' ? 2.5 : 1.5} />
        </button>
      </nav>
    </main>
  );
}
