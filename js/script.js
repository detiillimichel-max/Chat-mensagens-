// ================= LOGIN =================
let nick = localStorage.getItem("vibe_user");
if (!nick) {
    window.location.href = "login.html";
}

// ================= FIREBASE =================
const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database().ref("chat_vibe");

// ================= SOM WHATSAPP STYLE =================
const somMsg = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");
somMsg.preload = "auto";

// 🔓 libera áudio no celular (OBRIGATÓRIO)
document.addEventListener("click", () => {
    somMsg.play().then(() => {
        somMsg.pause();
        somMsg.currentTime = 0;
    }).catch(() => {});
}, { once: true });

// Vibração + som
function notificar() {
    somMsg.currentTime = 0;
    somMsg.play().catch(() => {});

    if (navigator.vibrate) {
        navigator.vibrate([120, 60, 120]);
    }
}

let primeiraVez = true;

// ================= RECEBER =================
db.limitToLast(50).on("child_added", snap => {

    const m = snap.val();
    const chat = document.getElementById("chat");
    if (!chat) return;

    const div = document.createElement("div");
    div.className = "balao";

    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";

    let avatar = `https://ui-avatars.com/api/?name=${m.autor}&background=00a884&color=fff&rounded=true`;

    let topo = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
            <img src="${avatar}" style="width:28px; height:28px; border-radius:50%;">
            <strong style="font-size:12px; color:#00a884;">${m.autor}</strong>
        </div>
    `;

    if (m.tipo === 'foto') {

        div.innerHTML = topo + `
            <img src="${m.imagem}" style="width:100%; border-radius:12px;">
        `;

    } else if (m.tipo === 'audio') {

        div.innerHTML = topo + `
            <audio controls style="width:100%">
                <source src="${m.audio}" type="audio/webm">
            </audio>
        `;

    } else {

        div.innerHTML = topo + `
            <span>${m.texto}</span>
        `;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    // 🔔 NOTIFICAÇÃO REAL
    if (m.autor !== nick && !primeiraVez) {
        notificar();
    }
});

setTimeout(() => { primeiraVez = false; }, 2000);

// ================= ENVIAR TEXTO =================
function enviar() {
    const input = document.getElementById('msgInput');

    if (input.value.trim() !== "") {
        db.push({
            autor: nick,
            texto: input.value,
            tipo: 'texto',
            data: Date.now()
        });

        input.value = "";
    }
}

document.getElementById('btnEnviar').onclick = enviar;

// ================= FOTO =================
const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');

btnFoto.onclick = () => fotoInput.click();

fotoInput.onchange = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        db.push({
            autor: nick,
            imagem: event.target.result,
            tipo: 'foto',
            data: Date.now()
        });
    };

    reader.readAsDataURL(file);
};

// ================= AUDIO =================
let mediaRecorder;
let audioChunks = [];

const btnAudio = document.getElementById('btnAudio');

btnAudio.onclick = async () => {

    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {

            const blob = new Blob(audioChunks, { type: 'audio/webm' });

            const reader = new FileReader();

            reader.onloadend = () => {
                db.push({
                    autor: nick,
                    audio: reader.result,
                    tipo: 'audio',
                    data: Date.now()
                });
            };

            reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        btnAudio.style.color = "red";

    } else {

        mediaRecorder.stop();
        btnAudio.style.color = "#00a884";

    }
};
