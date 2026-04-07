// js/app.js - O MOTOR REAL DO OIO VIBE (SUPABASE INTEGRADO)

const SUPABASE_URL = 'https://uqdwtzlkqaosnweyoyit.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uafBQD1aJ3w8_eq4meOsNQ_wzk8TwhA';

const App = {
    user: JSON.parse(localStorage.getItem('oio_session')),

    async init() {
        console.log("OIO Vibe: Sistema Conectado ao Supabase.");
        if (!this.user) {
            this.runFirstLogin();
        } else {
            this.askPin();
        }
    },

    // 🔐 SEGURANÇA: LOGIN E PIN 4 DÍGITOS
    runFirstLogin() {
        const email = prompt("E-mail para cadastro:");
        const name = prompt("Seu nome de exibição:");
        const pin = prompt("Crie seu PIN de 4 dígitos:");

        if (email && name && pin?.length === 4) {
            this.user = { email, name, pin };
            localStorage.setItem('oio_session', JSON.stringify(this.user));
            this.registerUserInDB();
            this.loadScreen('contacts-list');
        } else {
            alert("Dados inválidos. Tente novamente.");
            this.runFirstLogin();
        }
    },

    async registerUserInDB() {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: this.user.email, username: this.user.name })
        });
    },

    askPin() {
        const entry = prompt(`Olá ${this.user.name}, digite seu PIN:`);
        if (entry === this.user.pin) {
            this.loadScreen('contacts-list');
        } else {
            alert("PIN Incorreto!");
            this.askPin();
        }
    },

    // 📱 NAVEGAÇÃO REAL (FIM DA CASCA)
    async loadScreen(screenName) {
        const main = document.getElementById('main-content');
        try {
            // Se for a lista de contatos, buscamos dados REAIS do seu Supabase
            if (screenName === 'contacts-list') {
                this.renderRealContacts();
                return;
            }

            const response = await fetch(`components/${screenName}.html`);
            main.innerHTML = await response.text();
            this.updateActiveNav(screenName);
        } catch (err) {
            console.error("Erro ao carregar componente:", err);
        }
    },

    async renderRealContacts() {
        const main = document.getElementById('main-content');
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const profiles = await res.json();

        let html = `<div class="contacts-page">
            <div class="search-bar"><input type="text" placeholder="Buscar no OIO Vibe..."></div>
            <div class="contacts-list-container">`;
        
        profiles.forEach(p => {
            if(p.username !== this.user.name) { // Não mostrar você mesmo
                html += `
                <div class="contact-item" onclick="App.openChat('${p.username}')">
                    <div class="avatar-circle">${p.username[0].toUpperCase()}</div>
                    <div class="contact-info">
                        <h4>${p.username}</h4>
                        <span>visto recentemente</span>
                    </div>
                    <i class="fas fa-comment-alt"></i>
                </div>`;
            }
        });

        html += `</div></div>`;
        main.innerHTML = html;
        this.updateActiveNav('chats');
    },

    // 📞 LIGAÇÕES E VÍDEO CONFERÊNCIA
    async startVideoCall() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const callHtml = await fetch('components/call-screen.html').then(r => r.text());
            document.body.insertAdjacentHTML('beforeend', callHtml);
            
            const videoElement = document.getElementById('localVideo');
            if(videoElement) videoElement.srcObject = stream;
        } catch (err) {
            alert("Erro ao acessar câmera: " + err);
        }
    },

    // 🎙️ ENVIO DE ÁUDIO REAL
    async startAudioRecord() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        let chunks = [];

        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/ogg' });
            console.log("Áudio gravado e pronto para envio via Supabase Storage.");
            alert("Áudio capturado com sucesso!");
        };

        recorder.start();
        setTimeout(() => recorder.stop(), 3000); // Teste de 3 segundos
    },

    updateActiveNav(screen) {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.dataset.screen === screen);
        });
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.fa-video')) this.startVideoCall();
            if (e.target.closest('.fa-microphone')) this.startAudioRecord();
            if (e.target.closest('.end-call')) document.querySelector('.call-overlay').remove();
            
            const nav = e.target.closest('.nav-item');
            if (nav) this.loadScreen(nav.dataset.screen);
        });
    }
};

App.init();
