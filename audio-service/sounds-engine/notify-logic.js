// Cria o motor de áudio do navegador
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Onde estão os seus arquivos que você subiu na pasta assets
const soundFiles = {
    sent: 'sounds-engine/assets/sent.mp3',
    received: 'sounds-engine/assets/received.mp3'
};

async function playSystemSound(type) {
    try {
        // 1. Busca o arquivo na pasta assets
        const response = await fetch(soundFiles[type]);
        const arrayBuffer = await response.arrayBuffer();
        
        // 2. Decodifica o áudio para o navegador entender
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // 3. Cria a fonte de som
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        // --- O PULO DO GATO (O CORTE) ---
        // start(tempo_de_inicio, momento_do_arquivo, duracao)
        // Começa agora (0), no início do arquivo (0) e dura só 0.8 segundos
        source.start(0, 0, 0.8); 
        
        // 4. Vibração de luxo (curtinha)
        if (navigator.vibrate) {
            navigator.vibrate(15); 
        }

        console.log(`Som de ${type} tocado com corte de 0.8s`);

    } catch (error) {
        console.error("Erro ao tocar som: ", error);
    }
}
