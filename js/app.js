// js/app.js - O Coração do OIO Vibe

const App = {
    user: {
        email: '',
        name: '',
        pin: '',
        isLoggedIn: false
    },

    init() {
        console.log("OIO Vibe Iniciado");
        this.checkAuth();
        this.bindEvents();
    },

    // 🔐 SISTEMA DE SEGURANÇA E LOGIN
    checkAuth() {
        const savedUser = localStorage.getItem('oio_user');
        if (!savedUser) {
            this.showLoginFlow();
        } else {
            this.user = JSON.parse(savedUser);
            this.showPinEntry();
        }
    },

    async showLoginFlow() {
        const email = prompt("Bem-vindo! Digite seu e-mail para começar:");
        if (email) {
            this.user.email = email;
            const name = prompt("Como você quer ser chamado no app?");
            this.user.name = name || "Usuário Vibe";
            
            const pin = prompt("Crie sua senha de segurança (4 dígitos):");
            if (pin && pin.length === 4) {
                this.user.pin = pin;
                this.user.isLoggedIn = true;
                localStorage.setItem('oio_user', JSON.stringify(this.user));
                this.loadComponent('chats');
            } else {
                alert("Senha inválida. Tente novamente.");
                this.showLoginFlow();
            }
        }
    },

    showPinEntry() {
        const entry = prompt(`Olá ${this.user.name}, digite seu PIN de 4 dígitos:`);
        if (entry === this.user.pin) {
            this.loadComponent('chats');
        } else {
            alert("PIN Incorreto!");
            this.showPinEntry();
        }
    },

    // 📱 NAVEGAÇÃO ENTRE COMPONENTES
    async loadComponent(name) {
        const container = document.getElementById('main-content');
        try {
            const response = await fetch(`components/${name}-screen.html`);
            if (name === 'chats') { // Se for a lista de chats, usamos o contacts-list
                 const respList = await fetch(`components/contacts-list.html`);
                 container.innerHTML = await respList.text();
            } else {
                container.innerHTML = await response.text();
            }
            this.updateActiveTab(name);
        } catch (err) {
            console.error("Erro ao carregar componente:", err);
        }
    },

    updateActiveTab(name) {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.dataset.screen === name);
        });
    },

    // 📞 ENGENHARIA DE COMUNICAÇÃO (VOZ E VÍDEO)
    async startCall(type) {
        alert(`Iniciando chamada de ${type} via Wi-Fi...`);
        // Aqui entra a lógica de WebRTC
        const callScreen = await fetch('components/call-screen.html');
        document.body.insertAdjacentHTML('beforeend', await callScreen.text());
        
        if (type === 'video') {
            document.getElementById('remoteVideoContainer').classList.remove('hidden');
        }
    },

    // 🎙️ GRAVAÇÃO DE ÁUDIO
    startAudioRecord() {
        console.log("Gravando áudio...");
        const micBtn = document.getElementById('mainActionBtn');
        micBtn.style.background = '#ff3b30'; // Vermelho gravando
        // Lógica de MediaRecorder aqui
    },

    bindEvents() {
        // Eventos de clique na navegação inferior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.loadComponent(item.dataset.screen);
            });
        });
    }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());

// Funções globais para os botões do HTML
window.startVoiceCall = () => App.startCall('voz');
window.startVideoCall = () => App.startCall('video');
window.closeCall = () => document.querySelector('.call-overlay').remove();
