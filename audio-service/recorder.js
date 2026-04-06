let mediaRecorder;
let audioChunks = [];
const MAX_TIME = 300000; // 5 minutos em milisegundos

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Configuração para economia: Mono e Bitrate baixo
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // Formato ultra leve
        audioBitsPerSecond: 64000 // 64kbps (Qualidade de voz perfeita e leve)
    });

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/opus' });
        console.log("Áudio finalizado e comprimido. Tamanho: " + (audioBlob.size / 1024).toFixed(2) + " KB");
        // Aqui chamamos o upload.js
    };

    mediaRecorder.start();
    
    // Trava de segurança: para sozinho em 5 minutos
    setTimeout(() => {
        if(mediaRecorder.state === "recording") stopRecording();
    }, MAX_TIME);
}

function stopRecording() {
    mediaRecorder.stop();
    audioChunks = [];
}
