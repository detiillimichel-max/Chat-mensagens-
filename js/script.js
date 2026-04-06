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

// ================= SOM =================
const somPlim = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');

let primeiraVez = true;

// ================= RECEBER MENSAGENS =================
db.limitToLast(50).on("child_added", snap => {

    const m = snap.val();
    const chat = document.getElementById("chat");
    if (!chat) return;

    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";

    let avatar = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;

    let topo = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
            <img src="${avatar}" style="width:25px; height:25px; border-radius:50%;">
            <strong style="font-size:12px; color:#1a73e8;">${m.autor}</strong>
        </div>
    `;

    // ================= TIPOS =================
    if (m.tipo === 'foto') {

        div.innerHTML = topo + `
            <img src="${m.imagem}" style="width:100%; border-radius:10px;">
        `;

    } else if (m.tipo === 'audio') {

        div.innerHTML = topo + `
            <audio controls preload="auto" style="width:100%">
                <source src="${m.audio}" type="audio/webm">
            </audio>
        `;

    } else {

        div.innerHTML = topo + `<span>${m.texto}</span>`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    // SOM
    if (m.autor !== nick && !primeiraVez) {
        somPlim.play().catch(() => {});
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

// ================= ÁUDIO (CORRIGIDO) =================
let mediaRecorder;
let audioChunks = [];

const btnAudio = document.getElementById('btnAudio');

btnAudio.onclick = async () => {

    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });

        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {

            const blob = new Blob(audioChunks, {
                type: 'audio/webm'
            });

            const audioURL = URL.createObjectURL(blob);

            db.push({
                autor: nick,
                audio: audioURL,
                tipo: 'audio',
                data: Date.now()
            });

        };

        mediaRecorder.start();
        btnAudio.style.color = "red";

    } else {

        mediaRecorder.stop();
        btnAudio.style.color = "#1a73e8";

    }
};
