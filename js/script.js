let nick = localStorage.getItem("vibe_user");

if (!nick) location.href = "login.html";

const firebaseConfig = {
 apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
 databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database().ref("chat_vibe");

document.getElementById("userName").innerText = nick;

document.getElementById("userAvatar").src =
`https://ui-avatars.com/api/?name=${nick}&background=00a884&color=fff`;

db.limitToLast(20).on("child_added", snap => {

const m = snap.val();

const div = document.createElement("div");
div.className = "balao";

div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";

div.innerHTML = m.texto || 
(m.tipo === 'foto' ? `<img src="${m.imagem}">` : 
`<audio controls src="${m.audio}"></audio>`);

chat.appendChild(div);

});

document.getElementById("btnEnviar").onclick = () => {

const txt = msgInput.value;

if (!txt) return;

db.push({
autor: nick,
texto: txt
});

msgInput.value = "";
};
