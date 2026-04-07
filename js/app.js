import { db } from './database.js';

// Identificação do Usuário e Proteção de Rota
const usuarioAtivo = localStorage.getItem("vibe_user") || "detiillimichel"; // Padrão baseado no seu GitHub
if (!usuarioAtivo && !window.location.href.includes("login.html")) { 
    window.location.href = "login.html"; 
}

/**
 * MOTOR: Inicializa a lista de contatos (contacts-list.html)
 */
async function iniciarApp() {
    const palco = document.getElementById('chat-container'); 
    try {
        const resp = await fetch('components/contacts-list.html');
        palco.innerHTML = await resp.text();
    } catch (e) { console.error("Erro ao carregar contatos:", e); }
}

/**
 * MOTOR: Configura os botões da tela de chat (chat-screen.html)
 */
function configurarChat() {
    const btnEnviar = document.getElementById('btnEnviar'); // Ícone da seta azul
    const inputMsg = document.getElementById('inputVibe');  // Campo "Sua vibe..."
    const btnGaleria = document.getElementById('triggerGaleria'); // Ícone da câmera
    const inputOculto = document.getElementById('inputOcultoGaleria');
    const btnAudio = document.getElementById('btnAudio'); // Ícone do microfone

    // Envio de Texto
    if (btnEnviar) {
        btnEnviar.onclick = () => {
            const texto = inputMsg.value.trim();
            if (texto) {
                enviarParaFirebase({ tipo: 'texto', conteudo: texto });
                inputMsg.value = "";
            }
        };
    }

    // Envio de Foto (Câmera/Galeria)
    if (btnGaleria && inputOculto) {
        btnGaleria.onclick = () => inputOculto.click();
        inputOculto.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                enviarParaFirebase({ tipo: 'foto', conteudo: reader.result });
            };
            if (file) reader.readAsDataURL(file);
        };
    }

    // Lógica para Áudio (Integração com audio-service/recorder.js)
    if (btnAudio) {
        // Aqui você chamará a função do seu arquivo recorder.js no futuro
        btnAudio.onclick = () => console.log("Iniciando gravação de áudio...");
    }
}

/**
 * MOTOR: Envia dados para o Firebase Realtime Database
 */
function enviarParaFirebase(dados) {
    db.ref("chat_vibe_compartilhado/mensagens").push({
        autor: usuarioAtivo,
        tipo: dados.tipo,
        msg: dados.conteudo,
        timestamp: Date.now()
    });
}

/**
 * MOTOR: Escuta mensagens em tempo real e aplica o visual "Glass"
 */
function escutarMensagens() {
    const feed = document.getElementById('mensagens-feed');
    if (!feed) return;

    // Limpa o feed para não duplicar ao reabrir a conversa
    feed.innerHTML = "";

    db.ref("chat_vibe_compartilhado/mensagens").limitToLast(20).on("child_added", (snap) => {
        const m = snap.val();
        const bolhaContainer = document.createElement('div');
        
        // Define se a mensagem vai para a direita (você) ou esquerda (Bibibi)
        const isMe = m.autor === usuarioAtivo;
        bolhaContainer.className = isMe ? 'message-sent' : 'message-received';

        // Renderização baseada no tipo de conteúdo
        let conteudoHTML = "";
        if (m.tipo === 'foto') {
            conteudoHTML = `<img src="${m.msg}" class="vibe-image-msg" onclick="window.open(this.src)">`;
        } else if (m.tipo === 'audio') {
            conteudoHTML = `<audio controls src="${m.msg}" class="vibe-audio-player"></audio>`;
        } else {
            conteudoHTML = `<p>${m.msg}</p>`;
        }

        // Aplica a classe 'glass' que você definiu no seu CSS de luxo
        bolhaContainer.innerHTML = `
            <div class="bubble glass">
                ${conteudoHTML}
                <span class="vibe-time">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;

        feed.appendChild(bolhaContainer);
        feed.scrollTop = feed.scrollHeight; // Auto-scroll para o final
    });
}

/**
 * A COSTURA: Abre a conversa específica e carrega os componentes de UI
 */
window.abrirConversa = async function(nomeContato) {
    const palco = document.getElementById('chat-container');
    try {
        const resp = await fetch('components/chat-screen.html');
        palco.innerHTML = await resp.text();
        
        // Atualiza o nome no topo do chat (como visto na Imagem 1)
        const nomeTopo = document.getElementById('chat-nome-contato');
        if (nomeTopo) nomeTopo.innerText = nomeContato;

        configurarChat();
        escutarMensagens();
    } catch (e) { 
        console.error("Erro ao abrir conversa:", e); 
    }
};

window.onload = iniciarApp;
