// js/app.js - O MOTOR REAL OIO VIBE
const App = {
    user: null,
    currentScreen: 'contacts-list',

    async init() {
        console.log("Sistema OIO Vibe Operacional");
        this.checkAuth();
        this.bindEvents();
    },

    // 🔐 SEGURANÇA: LOGIN E PIN 4 DÍGITOS
    checkAuth() {
        const saved = localStorage.getItem('oio_session');
        if (!saved) {
            this.runFirstLogin();
        } else {
            this.user = JSON.parse(saved);
            this.askPin();
        }
    },

    runFirstLogin() {
        const email = prompt("E-mail para cadastro:");
        const name = prompt("Seu nome de exibição:");
        const pin = prompt("Crie sua senha de 4 dígitos (PIN):");

        if (email && name && pin?.length === 4) {
            this.user = { email, name, pin };
            localStorage.setItem('oio_session', JSON.stringify(this.user));
            this.loadScreen('contacts-list');
        } else {
            alert("Dados inválidos. Tente novamente.");
            this.runFirstLogin();
        }
    },

    askPin() {
        const entry = prompt(`Olá ${this.user.name}, digite seu PIN de 4 dígitos:`);
        if (entry === this.user.pin) {
            this.loadScreen('contacts-list');
        } else {
            alert("PIN Incorreto!");
            this.askPin();
        }
    },

    // 📱 NAVEGAÇÃO REAL (BUSCA OS ARQUIVOS QUE VOCÊ CRIOU)
    async loadScreen(screenName) {
        const main = document.getElementById('main-content');
        const title = document.getElementById('view-title');
        
        try {
            const response = await fetch(`components/${screenName}.html`);
            if (!response.ok) throw new Error();
            const html = await response.text();
            
            main.innerHTML = html;
            this.currentScreen = screenName;
            
            // Atualiza o título no topo conforme a tela
            const labels = {
                'contacts-list': 'Conversas',
                'explore-grid': 'Explorar',
                'podcast-card': 'Podcasts',
                'profile-screen': 'Meu Perfil'
            };
            if(title) title.innerText = labels[screenName] || 'OIO Vibe';
            
            this.updateUI(screenName);
        } catch (err) {
            console.error("Erro ao carregar componente:", screenName);
        }
    },

    updateUI(screenName) {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.getAttribute('data-screen') === screenName);
        });
    },

    // 🎙️ FUNÇÃO DE ÁUDIO (GRAVAÇÃO REAL)
    async startAudio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            alert("Microfone ativado! Gravando...");
            
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
                alert("Áudio de 3s capturado para teste!");
            }, 3000);
        } catch (err) {
            alert("Erro ao acessar microfone: " + err);
        }
    },

    // 📞 FUNÇÃO DE CHAMADA (ABRE O VÍDEO)
    async startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // Busca a peça de chamada que você criou
            const callPage = await fetch('components/call-screen.html');
            const html = await callPage.text();
            document.body.insertAdjacentHTML('beforeend', html);
            
            const localVideo = document.getElementById('localVideo');
            if (localVideo) {
                localVideo.srcObject = stream;
                document.getElementById('remoteVideoContainer').classList.remove('hidden');
            }
        } catch (err) {
            alert("Erro na câmera: " + err);
        }
    },

    bindEvents() {
        // Cliques na barra inferior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = () => this.loadScreen(item.getAttribute('data-screen'));
        });

        // Delegação de eventos para botões que entram dinamicamente
        document.addEventListener('click', (e) => {
            if (e.target.closest('.fa-microphone')) this.startAudio();
            if (e.target.closest('.fa-video')) this.startVideo();
            if (e.target.closest('.end-call')) {
                const overlay = document.querySelector('.call-overlay');
                if (overlay) overlay.remove();
            }
        });
    }
};

// Inicia tudo
document.addEventListener('DOMContentLoaded', () => App.init());
