let mediaRecorder;
let audioChunks = [];

async function iniciarGravacao() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
    
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        enviarMidia(audioBlob, 'audio'); // Chama a função do upload.js
    };
    
    mediaRecorder.start();
    console.log("🎤 Gravando...");
}

function pararGravacao() {
    if (mediaRecorder) mediaRecorder.stop();
}
