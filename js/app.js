const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("chat_vibe");
let nick = localStorage.getItem("vibe_user") || "Michel";

// Função para carregar as telas da pasta components
async function loadScreen(name) {
    const res = await fetch(`components/${name}.html`);
    document.getElementById('main-content').innerHTML = await res.text();
    if(name === 'chat-screen') initChat();
}

function initChat() {
    db.limitToLast(20).on("child_added", snap => {
        const m = snap.val();
        const chat = document.getElementById("chat");
        if(!chat) return;
        const div = document.createElement("div");
        div.className = m.autor === nick ? "balao eu" : "balao outro";
        
        let conteudo = m.tipo === 'foto' ? `<img src="${m.imagem}" style="width:100%;border-radius:10px">` :
                       m.tipo === 'audio' ? `<audio controls src="${m.audio}"></audio>` : `<span>${m.texto}</span>`;
        
        div.innerHTML = `<small>${m.autor}</small><br>${conteudo}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    });
}

// Funções globais para os botões do HTML
window.enviar = () => {
    const input = document.getElementById('msgInput');
    if(input.value.trim()) {
        db.push({ autor: nick, texto: input.value, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
};

window.abrirGaleria = () => document.getElementById('fotoInput').click();
window.enviarFoto = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => db.push({ autor: nick, imagem: ev.target.result, tipo: 'foto', data: Date.now() });
    reader.readAsDataURL(e.target.files[0]);
};

let recorder;
window.toggleAudio = async () => {
    if (!recorder || recorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(stream);
        let chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
            const reader = new FileReader();
            reader.onload = (ev) => db.push({ autor: nick, audio: ev.target.result, tipo: 'audio', data: Date.now() });
            reader.readAsDataURL(new Blob(chunks, { type: 'audio/webm' }));
        };
        recorder.start();
        document.getElementById('btnAudio').style.color = "red";
    } else {
        recorder.stop();
        document.getElementById('btnAudio').style.color = "#1a73e8";
    }
};

loadScreen('chat-screen');
