// js/app.js - O Maestro da Navegação Premium
const mainContent = document.getElementById('main-content');
const viewTitle = document.getElementById('view-title');
const btnPlus = document.getElementById('btn-plus-social');

function changeTab(tabName, element) {
    // Atualiza o estado visual dos botões da nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    // Efeito de Transição (Fade)
    mainContent.style.opacity = 0;

    setTimeout(() => {
        switch(tabName) {
            case 'chats':
                viewTitle.innerText = "Conversas";
                btnPlus.classList.add('hidden');
                mainContent.innerHTML = `
                    <div class="glass-card" style="margin: 15px; padding: 20px;">
                        <p style="color: var(--text-secondary);">Nenhuma conversa ativa ainda...</p>
                    </div>`;
                break;
                
            case 'explore':
                viewTitle.innerText = "Descobrir";
                btnPlus.classList.remove('hidden');
                mainContent.innerHTML = `<div class="explore-grid" id="explore-view"></div>`;
                // Aqui depois chamaremos o grid de fotos
                break;
                
            case 'podcasts':
                viewTitle.innerText = "Pílulas de Voz";
                btnPlus.classList.remove('hidden');
                mainContent.innerHTML = `<div id="podcast-feed"></div>`;
                break;
                
            case 'profile':
                viewTitle.innerText = "Meu Perfil";
                btnPlus.classList.add('hidden');
                mainContent.innerHTML = `
                    <div class="glass-card" style="margin: 15px; text-align: center;">
                        <div class="profile-header">
                            <h3>Michel Dev</h3>
                            <p>Mobile Software Architect</p>
                        </div>
                        <button onclick="document.getElementById('bg-upload').click()" class="btn-twitter-plus" style="position:relative; width:auto; height:auto; padding:10px; font-size:14px; margin-top:15px;">Trocar Fundo da Galeria</button>
                        <input type="file" id="bg-upload" style="display:none" onchange="handleBackgroundUpload(event)">
                    </div>`;
                break;
        }
        mainContent.style.opacity = 1;
    }, 200);
}

// Inicia o app na aba de Chats
window.onload = () => {
    const firstTab = document.querySelector('.nav-item');
    changeTab('chats', firstTab);
};
