const mainContent = document.getElementById('main-content');
const viewTitle = document.getElementById('view-title');
const btnPlus = document.getElementById('btn-plus-social');

function changeTab(tabName) {
    // Remove classe ativa de todos
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // Esconde o botão + por padrão
    btnPlus.style.display = "none";

    switch(tabName) {
        case 'chats':
            viewTitle.innerText = "Chats";
            mainContent.innerHTML = "";
            break;
            
        case 'explore':
            viewTitle.innerText = "Explorar";
            mainContent.innerHTML = "";
            btnPlus.style.display = "flex"; // Aparece no Explorar
            break;
            
        case 'podcasts':
            viewTitle.innerText = "Podcasts";
            mainContent.innerHTML = "";
            btnPlus.style.display = "flex"; // Aparece no Podcasts
            break;
            
        case 'profile':
            viewTitle.innerText = "Meu Perfil";
            mainContent.innerHTML = "";
            break;
    }
}

// Inicia na aba Chats
changeTab('chats');

