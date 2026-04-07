// OIO ONE - Conexão Centralizada com Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};

// Inicializa o Firebase apenas uma vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Exporta as referências para o app.js
const db = firebase.database();
const storageRef = db.ref("chat_vibe_compartilhado");

console.log("🚀 Banco de Dados Vibe Conectado");
