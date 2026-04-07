import { Search, MoreVertical, MessageSquare, Phone, Video } from 'lucide-react';

export default function ContactList() {
  const contatos = [
    { nome: "Gabriela Detilli", status: "visto recentemente", inicial: "G" },
    { nome: "Michel Detilli", status: "online", inicial: "M" },
    { nome: "Maria Gabriela", status: "visto recentemente", inicial: "M" }
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4 animate-in fade-in duration-700">
      {/* HEADER DA LISTA */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Contatos de Elite</h2>
        <Search size={18} className="text-zinc-500 hover:text-cyan-400 cursor-pointer transition" />
      </div>

      {contatos.map((contato, i) => (
        <div key={i} className="group relative overflow-hidden rounded-[24px] bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] hover:border-cyan-500/30 transition-all duration-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* AVATAR COM GRADIENTE */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10 shadow-2xl text-cyan-400 font-bold">
                {contato.inicial}
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-400 transition">{contato.nome}</h3>
                <p className="text-[10px] text-zinc-500 font-medium">{contato.status}</p>
              </div>
            </div>
            
            {/* AÇÕES MINIMALISTAS */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-2 text-zinc-400 hover:text-white"><Phone size={16} /></button>
              <button className="p-2 text-zinc-400 hover:text-white"><Video size={16} /></button>
            </div>
          </div>
        </div>
      ))}

      {/* BOTÃO FLUTUANTE CUSTOMIZADO (NÃO PARECE SALA DE AULA) */}
      <button className="fixed bottom-28 right-8 w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:scale-110 active:scale-95 transition-all">
        <MessageSquare size={24} className="text-white" />
      </button>
    </div>
  );
}

