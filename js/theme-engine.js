const bgContainer = document.getElementById('dynamic-background');

// Função para aplicar a imagem escolhida pelo usuário
function applyUserBackground(imageUrl) {
    if (imageUrl) {
        bgContainer.style.backgroundImage = `url(${imageUrl})`;
        localStorage.setItem('user_custom_bg', imageUrl);
    }
}

// Carrega o fundo salvo ao iniciar
window.addEventListener('load', () => {
    const savedBg = localStorage.getItem('user_custom_bg');
    if (savedBg) {
        applyUserBackground(savedBg);
    } else {
        // Fundo padrão (Telegram Dark) caso não tenha foto
        bgContainer.style.backgroundColor = "#0e1621";
    }
});

// Exemplo de como o usuário escolhe a foto (será chamado no Perfil)
function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
        applyUserBackground(reader.result);
    }
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

