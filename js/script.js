// LOGIN
var nick = localStorage.getItem("vibe_user");
if (!nick) {
    window.location.href = "login.html";
}

// FIREBASE
var firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var db = firebase.database().ref("chat_vibe");

// SOM
var somMsg = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");

document.addEventListener("click", function() {
    somMsg.play().then(function(){
        somMsg.pause();
        somMsg.currentTime = 0;
    }).catch(function(){});
}, { once: true });

var primeiraVez = true;

// RECEBER
db.limitToLast(50).on("child_added", function(snap){

    var m = snap.val();
    var chat = document.getElementById("chat");
    if (!chat) return;

    var div = document.createElement("div");
    div.className = "balao";

    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";

    if (m.tipo === "foto") {
        div.innerHTML = "<img src='"+m.imagem+"' style='width:100%;border-radius:10px'>";
    }
    else if (m.tipo === "audio") {
        div.innerHTML = "<audio controls src='"+m.audio+"' style='width:100%'></audio>";
    }
    else {
        div.innerText = m.texto || "";
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    // SOM
    if (m.autor !== nick && !primeiraVez) {
        somMsg.currentTime = 0;
        somMsg.play().catch(function(){});
        if (navigator.vibrate) navigator.vibrate(100);
    }
});

// evita som inicial
setTimeout(function(){
    primeiraVez = false;
}, 2000);

// ENVIAR TEXTO
document.getElementById("btnEnviar").onclick = function(){

    var txt = document.getElementById("msgInput").value;

    if (!txt) return;

    db.push({
        autor: nick,
        texto: txt,
        tipo: "texto",
        data: Date.now()
    });

    document.getElementById("msgInput").value = "";
};

// FOTO
var btnFoto = document.getElementById("btnFoto");
var fotoInput = document.getElementById("fotoInput");

btnFoto.onclick = function(){
    fotoInput.click();
};

fotoInput.onchange = function(e){

    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.onload = function(event){
        db.push({
            autor: nick,
            imagem: event.target.result,
            tipo: "foto",
            data: Date.now()
        });
    };

    reader.readAsDataURL(file);
};

// AUDIO
var mediaRecorder;
var chunks = [];

var btnAudio = document.getElementById("btnAudio");

btnAudio.onclick = async function(){

    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        var stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        chunks = [];

        mediaRecorder.ondataavailable = function(e){
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function(){

            var blob = new Blob(chunks, { type: "audio/webm" });

            var reader = new FileReader();

            reader.onloadend = function(){
                db.push({
                    autor: nick,
                    audio: reader.result,
                    tipo: "audio",
                    data: Date.now()
                });
            };

            reader.readAsDataURL(blob);
        };

        mediaRecorder.start();
        btnAudio.style.color = "red";

    } else {

        mediaRecorder.stop();
        btnAudio.style.color = "#25d366";
    }
};
