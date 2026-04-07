// js/app.js - O Maestro do OIO VIBE

// Função para carregar os componentes .html da pasta components/
async function loadComponent(name) {
    try {
        const response = await fetch(`components/${name}.html`);
        if (!response.ok) throw new Error('Erro ao carregar componente');
        const html = await response.text();
        document.getElementById('main-content').innerHTML = html;
    } catch (err) {
        console.error(err);
        document.getElementById('main-content').innerHTML = '<p style="padding:20px; color:gray;">Erro ao carregar visual...</p>';
    }
}

// Lógica de Troca de Abas de Luxo
function changeTab(tabName, element) {
    // 1. Muda o título no topo
    const viewTitle = document.getElementById('view-title');
    const btnPlus = document.getElementById('btn-plus-social');
    
    // 2. Atualiza qual ícone está azul (ativo) na barra de baixo
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // 3. Carrega o conteúdo certo
    switch(tabName) {
        case 'chats':
            viewTitle.innerText = "Conversas";
            btnPlus.classList.add('hidden'); // Esconde o "+" no chat
            loadComponent('chat-bubble');
            break;
            
        case 'explore':
            viewTitle.innerText = "Descobrir";
            btnPlus.classList.remove('hidden'); // Mostra o "+" para postar foto
            loadComponent('explore-grid');
            break;
            
        case 'podcasts':
            viewTitle.innerText = "Pílulas de Voz";
            btnPlus.classList.remove('hidden'); // Mostra o "+" para gravar áudio
            loadComponent('podcast-card');
            break;
            
        case 'profile':
            viewTitle.innerText = "Meu Perfil";
            btnPlus.classList.add('hidden');
            // Como perfil é fixo, podemos injetar direto
            document.getElementById('main-content').innerHTML = `
                <div class="glass-card" style="margin:20px; text-align:center;">
                    <h3>Michel Dev</h3>
                    <p style="color:var(--text-secondary)">Mobile Architect</p>
                </div>`;
            break;
    }
}

// Inicia o App nos Chats por padrão
window.onload = () => {
    const defaultTab = document.querySelector('.nav-item');
    changeTab('chats', defaultTab);
};
