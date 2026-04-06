const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const sounds = {
    sent: 'sounds-engine/assets/sent.mp3',
    received: 'sounds-engine/assets/received.mp3'
};

// Função para tocar o som de luxo
async function playSystemSound(type) {
    const response = await fetch(sounds[type]);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    
    // Feedback tátil (Vibração curta no celular)
    if (navigator.vibrate) {
        navigator.vibrate(10); // 10ms de vibração quase imperceptível (Premium)
    }
}

// Exemplo de uso:
// playSystemSound('sent'); 

