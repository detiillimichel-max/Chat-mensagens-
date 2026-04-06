async function uploadPodcast(audioBlob, userId) {
    const fileName = `podcast_${userId}_${Date.now()}.opus`;
    
    console.log("Enviando pílula de voz para a nuvem...");
    
    // Exemplo de envio (Supabase/Firebase logic)
    // const { data, error } = await supabase.storage.from('podcasts').upload(fileName, audioBlob);
    
    if (audioBlob.size > 2000000) { // Alerta se passar de 2MB
        console.warn("Áudio um pouco pesado, mas enviado!");
    }
}

