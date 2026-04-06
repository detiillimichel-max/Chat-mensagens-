firebase.initializeApp({
 apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
 authDomain: "vibe-app-bbba2.firebaseapp.com",
 databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com",
 storageBucket: "vibe-app-bbba2.appspot.com"
});

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

let user;

// LOGIN CHECK
auth.onAuthStateChanged(u=>{
 if(!u) location.href="login.html";
 user = u;
 carregarUsuarios();
});

// 👥 LISTA DE USUÁRIOS
function carregarUsuarios(){
 db.ref("users").once("value", snap=>{
  lista.innerHTML="";
  snap.forEach(s=>{
    const u = s.val();

    const div = document.createElement("div");
    div.innerText = u.email;
    div.onclick = ()=>abrirChat(s.key);

    lista.appendChild(div);
  });
 });
}

// 💬 CHAT
let chatId;

function abrirChat(uid){
 chatId = [user.uid, uid].sort().join("_");

 chat.innerHTML="";

 db.ref("mensagens/"+chatId)
 .limitToLast(50)
 .on("child_added", snap=>{
  const m = snap.val();

  const div = document.createElement("div");
  div.className = m.uid === user.uid ? "me" : "other";

  if(m.tipo==="foto"){
    div.innerHTML = `<img src="${m.url}">`;
  }else if(m.tipo==="audio"){
    div.innerHTML = `<audio controls src="${m.url}"></audio>`;
  }else{
    div.innerText = m.texto;
  }

  chat.appendChild(div);
 });
}

// ✉️ TEXTO
function enviar(){
 db.ref("mensagens/"+chatId).push({
  uid:user.uid,
  texto:msg.value,
  tipo:"texto"
 });
 msg.value="";
}

// 📷 FOTO
async function enviarFoto(file){
 const ref = storage.ref("fotos/"+Date.now());
 await ref.put(file);
 const url = await ref.getDownloadURL();

 db.ref("mensagens/"+chatId).push({
  uid:user.uid,
  url:url,
  tipo:"foto"
 });
}
