import { db } from './database.js';

const usuarioAtivo = localStorage.getItem("vibe_user");
if (!usuarioAtivo) { window.location.href = "login.html"; }

// MOTOR: Inicializa a lista de contatos
async function iniciarApp() {
    const palco = document.getElementById('chat-container'); 
    try {
        const resp = await fetch('components/contacts-list.html');
        palco.innerHTML = await resp.text();
    } catch (e) { console.error(e); }
}

// MOTOR: Configura os botões quando o chat abre
function configurarChat() {
    const btnEnviar = document.getElementById('btnEnviar');
    const inputMsg = document.getElementById('inputVibe');
    const btnGaleria = document.getElementById('triggerGaleria');
    const inputOculto = document.getElementById('inputOcultoGaleria');

    if (btnEnviar) {
        btnEnviar.onclick = () => {
            const texto = inputMsg.value;
            if (texto.trim()) {
                enviarParaFirebase({ tipo: 'texto', conteudo: texto });
                inputMsg.value = "";
            }
        };
    }
    if (btnGaleria) {
        btnGaleria.onclick = () => inputOculto.click();
        inputOculto.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => enviarParaFirebase({ tipo: 'foto', conteudo: reader.result });
            reader.readAsDataURL(file);
        };
    }
}

// MOTOR: Envia e recebe do Firebase
function enviarParaFirebase(dados) {
    db.ref("chat_vibe").push({
        autor: usuarioAtivo,
        tipo: dados.tipo,
        msg: dados.conteudo,
        timestamp: Date.now()
    });
}

function escutarMensagens() {
    const feed = document.getElementById('mensagens-feed');
    if (!feed) return;
    db.ref("chat_vibe").limitToLast(20).on("child_added", (snap) => {
        const m = snap.val();
        const bolha = document.createElement('div');
        bolha.className = m.autor === usuarioAtivo ? 'message-sent' : 'message-received';
        bolha.innerHTML = `<div class="bubble">${m.msg}</div>`;
        feed.appendChild(bolha);
        feed.scrollTop = feed.scrollHeight;
    });
}

// A COSTURA: Ponte entre a lista e o chat
window.abrirConversa = async function(nomeContato) {
    const palco = document.getElementById('chat-container');
    try {
        const resp = await fetch('components/chat-screen.html');
        palco.innerHTML = await resp.text();
        document.getElementById('chat-nome-contato').innerText = nomeContato;
        configurarChat();
        escutarMensagens();
    } catch (e) { console.error("Erro:", e); }
};

window.onload = iniciarApp;
