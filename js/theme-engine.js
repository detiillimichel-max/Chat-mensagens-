/**
 * OIO ONE - MOTOR DE TEMA E PAPEL DE PAREDE
 * Este arquivo garante que o fundo e o efeito 'Glass' funcionem juntos.
 */

const bgContainer = document.getElementById('chat-container'); // O container principal do seu app

// 1. Aplica o fundo e ajusta o contraste dos componentes
function applyUserBackground(imageUrl) {
    if (imageUrl) {
        // Aplica a imagem com ajuste de brilho para não ofuscar as mensagens
        bgContainer.style.background = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imageUrl})`;
        bgContainer.style.backgroundSize = "cover";
        bgContainer.style.backgroundPosition = "center";
        bgContainer.style.backgroundAttachment = "fixed";
        
        localStorage.setItem('user_custom_bg', imageUrl);
        
        // Ativa o modo 'Glass' nos componentes se houver imagem
        document.body.classList.add('glass-mode');
    }
}

// 2. Carregamento Inteligente
window.addEventListener('load', () => {
    const savedBg = localStorage.getItem('user_custom_bg');
    
    if (savedBg) {
        applyUserBackground(savedBg);
    } else {
        // Fundo padrão Luxury (Preto Profundo do OIO ONE)
        bgContainer.style.background = "#000";
        document.body.classList.remove('glass-mode');
    }
});

// 3. Upload de Fundo via Perfil/Configurações
function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        applyUserBackground(reader.result);
        // Vibração tátil ao confirmar a mudança (Premium feel)
        if (navigator.vibrate) navigator.vibrate(50);
    };
    reader.readAsDataURL(file);
}

/**
 * 4. Ajuste de Opacidade Dinâmico
 * Permite que o usuário controle o quão 'transparente' o chat fica
 */
function setGlassOpacity(level) {
    // level deve ser entre 0.1 e 0.9
    document.documentElement.style.setProperty('--glass-opacity', level);
    localStorage.setItem('vibe_glass_level', level);
}

console.log("💎 Motor de Tema Vibe: Pronto");
