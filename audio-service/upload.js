function enviarMidia(arquivo, tipo) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target.result;
        const dados = {
            autor: localStorage.getItem("vibe_user") || "Michel",
            data: Date.now(),
            tipo: tipo
        };
        
        if (tipo === 'audio') dados.audio = base64;
        if (tipo === 'foto') dados.imagem = base64;

        firebase.database().ref("chat_vibe").push(dados);
    };
    reader.readAsDataURL(arquivo);
}
