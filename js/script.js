// ================= FIREBASE =================
firebase.initializeApp({
  apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
  databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
  storageBucket: "vibe-app-bbba2.appspot.com"
});

const db = firebase.database().ref("chat_vibe");
const storage = firebase.storage();

// ================= USUÁRIO =================
let nick = localStorage.getItem("vibe_user");

if (!nick) {
  nick = prompt("Digite seu nome:");
  localStorage.setItem("vibe_user", nick);
}

// ================= SOM (WHATSAPP STYLE) =================
const som = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");

// destrava áudio no celular
document.body.addEventListener("click", () => {
  som.play().then(() => {
    som.pause();
    som.currentTime = 0;
  }).catch(()=>{});
}, { once: true });

// ================= CHAT =================
const chat = document.getElementById("chat");

db.limitToLast(50).on("child_added", snap => {

  const m = snap.val();

  const div = document.createElement("div");
  div.className = "msg " + (m.autor === nick ? "me" : "other");

  // TIPOS
  if (m.tipo === "foto") {
    div.innerHTML = `<img src="${m.url}" style="width:100%; border-radius:10px;">`;

  } else if (m.tipo === "audio" || m.tipo === "musica") {
    div.innerHTML = `
      <audio controls style="width:100%">
        <source src="${m.url}">
      </audio>
    `;

  } else {
    div.innerText = m.autor + ": " + m.texto;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  // SOM AO RECEBER
  if (m.autor !== nick) {
    som.play().catch(()=>{});
  }
});

// ================= ENVIAR TEXTO =================
function enviar() {
  const input = document.getElementById("msg");

  if (!input.value.trim()) return;

  db.push({
    autor: nick,
    texto: input.value,
    tipo: "texto",
    data: Date.now()
  });

  input.value = "";
}

// ================= FOTO =================
function abrirGaleria() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const ref = storage.ref("fotos/" + Date.now());
  await ref.put(file);

  const url = await ref.getDownloadURL();

  db.push({
    autor: nick,
    url: url,
    tipo: "foto"
  });
};

// ================= MÚSICA =================
function abrirMusica() {
  document.getElementById("musicInput").click();
}

document.getElementById("musicInput").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const ref = storage.ref("musicas/" + Date.now());
  await ref.put(file);

  const url = await ref.getDownloadURL();

  db.push({
    autor: nick,
    url: url,
    tipo: "musica"
  });
};

// ================= ÁUDIO (CORRIGIDO) =================
let mediaRecorder;
let chunks = [];

document.getElementById("btnAudio").onclick = async () => {

  if (!mediaRecorder || mediaRecorder.state === "inactive") {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {

      const blob = new Blob(chunks, { type: "audio/webm" });

      const ref = storage.ref("audios/" + Date.now());
      await ref.put(blob);

      const url = await ref.getDownloadURL();

      db.push({
        autor: nick,
        url: url,
        tipo: "audio"
      });
    };

    mediaRecorder.start();
    btnAudio.style.color = "red";

  } else {

    mediaRecorder.stop();
    btnAudio.style.color = "#8696a0";

  }
};
