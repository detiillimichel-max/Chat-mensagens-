"use client";
import React, { useState } from 'react';
import { Users, Video, Mic, Globe } from 'lucide-react';
// Importando os componentes que você criou nas pastas do GitHub
import HeaderElite from './components/HeaderElite'; 

export default function Home() {
  const [aba, setAba] = useState('chats');

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500">
      {/* O cabeçalho de luxo que você montou */}
      <HeaderElite />

      {/* Área de Conteúdo Dinâmico */}
      <div className="pt-24 pb-32 px-4 max-w-md mx-auto">
        {aba === 'chats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Mensagens Recentes</p>
            {/* Aqui entrará sua lista de contatos em breve */}
            <div className="h-40 border border-white/5 bg-white/[0.02] rounded-[30px] flex items-center justify-center text-zinc-600 italic">
              Carregando Vibe...
            </div>
          </div>
        )}
      </div>

      {/* Barra de Navegação Ultra-Glass */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[35px] flex justify-around items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button onClick={() => setAba('chats')} className={`p-4 transition-all ${aba === 'chats' ? 'text-cyan-400 scale-110' : 'text-zinc-500'}`}>
          <Users size={24} strokeWidth={1.5} />
        </button>
        <button onClick={() => setAba('videos')} className={`p-4 transition-all ${aba === 'videos' ? 'text-cyan-400 scale-110' : 'text-zinc-500'}`}>
          <Video size={24} strokeWidth={1.5} />
        </button>
        <button onClick={() => setAba('podcasts')} className={`p-4 transition-all ${aba === 'podcasts' ? 'text-cyan-400 scale-110' : 'text-zinc-500'}`}>
          <Mic size={24} strokeWidth={1.5} />
        </button>
      </nav>
    </main>
  );
}

