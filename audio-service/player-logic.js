function setupAudioPlayer(audioUrl, canvasId) {
    const audio = new Audio(audioUrl);
    
    // Lógica para as ondas de áudio (Visualizer)
    audio.onplay = () => {
        document.getElementById(canvasId).classList.add('animating-waves');
        console.log("Iniciando streaming econômico...");
    };

    audio.onpause = () => {
        document.getElementById(canvasId).classList.remove('animating-waves');
    };

    return audio;
}

