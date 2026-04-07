// OIO ONE - LÓGICA CENTRAL (js/app.js)
import { db } from './database.js';

// PEGA O USUÁRIO REAL LOGADO. SE NÃO TIVER NINGUÉM, MANDA PARA O LOGIN.
const usuarioAtivo = localStorage.getItem("vibe_user");

if (!usuarioAtivo) {
    window.location.href = "login.html"; // Segurança: impede uso sem nome
}

// 1. CARREGAR MÓDULO DE CHAT
async function iniciarApp() {
    const palco = document.getElementById('chat-container'); 
    try {
        const resp = await fetch('components/chat-screen.html');
        if (!resp.ok) throw new Error("Erro ao carregar chat-screen.html");
        
        palco.innerHTML = await resp.text();
        
        // Atualiza o nome no topo do chat dinamicamente
        const nomeTopo = document.getElementById('chat-nome-contato');
        if (nomeTopo) nomeTopo.innerText = "Conversa"; 

        configurarChat();
        escutarMensagens();
    } catch (e) {
        console.error("Erro na inicialização:", e);
    }
}

// 2. CONFIGURAR EVENTOS DO CHAT
function configurarChat() {
    const btnEnviar = document.getElementById('btnEnviar');
    const inputMsg = document.getElementById('inputVibe');
    const btnGaleria = document.getElementById('triggerGaleria');
    const inputOculto = document.getElementById('inputOcultoGaleria');

    if (btnEnviar && inputMsg) {
        btnEnviar.onclick = () => {
            const texto = inputMsg.value;
            if (texto.trim()) {
                enviarParaFirebase({ tipo: 'texto', conteudo: texto });
                inputMsg.value = "";
            }
        };
    }

    if (btnGaleria && inputOculto) {
        btnGaleria.onclick = () => inputOculto.click();
        inputOculto.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => enviarParaFirebase({ tipo: 'foto', conteudo: reader.result });
            reader.readAsDataURL(file);
        };
    }
}

// 3. FUNÇÃO DE ENVIO (USA O USUÁRIO DO LOCALSTORAGE)
function enviarParaFirebase(dados) {
    db.ref("chat_vibe").push({
        autor: usuarioAtivo, 
        tipo: dados.tipo,
        msg: dados.conteudo,
        timestamp: Date.now()
    });
}

// 4. ESCUTAR MENSAGENS EM TEMPO REAL
function escutarMensagens() {
    const feed = document.getElementById('mensagens-feed');
    if (!feed) return;

    db.ref("chat_vibe").limitToLast(20).on("child_added", (snap) => {
        const m = snap.val();
        const bolha = document.createElement('div');
        
        // Define se a bolha é de quem envia ou recebe
        bolha.className = m.autor === usuarioAtivo ? 'message-sent' : 'message-received';
        
        bolha.innerHTML = `
            <div class="bubble">
                ${m.tipo === 'foto' ? `<img src="${m.msg}" style="max-width:200px; border-radius:10px;">` : m.msg}
                <span class="time">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        feed.appendChild(bolha);
        feed.scrollTop = feed.scrollHeight;
    });
}

// 5. LÓGICA DE CHAMADAS
window.iniciarChamada = function(tipo) {
    db.ref("chamadas_ativas").set({
        de: usuarioAtivo,
        tipo: tipo,
        status: 'chamando',
        timestamp: Date.now()
    });
    window.location.href = "components/call-screen.html";
};

window.onload = iniciarApp;
