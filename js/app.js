const SUPABASE_URL = 'https://uqdwtzlkqaosnweyoyit.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uafBQD1aJ3w8_eq4meOsNQ_wzk8TwhA';

const App = {
    user: JSON.parse(localStorage.getItem('oio_session')),

    async init() {
        if (!this.user) return this.runFirstLogin();
        this.loadScreen('contacts-list'); // Começa carregando os contatos reais
        this.bindEvents();
    },

    // 📱 NAVEGAÇÃO E CARREGAMENTO REAL DE COMPONENTES
    async loadScreen(name) {
        const main = document.getElementById('main-content');
        const viewTitle = document.getElementById('view-title');
        
        try {
            // 1. Busca o HTML do componente na pasta
            const response = await fetch(`components/${name}.html`);
            let html = await response.text();
            
            // 2. Se for a lista de contatos, injeta os dados do Supabase dentro dela
            if (name === 'contacts-list') {
                main.innerHTML = html; // Primeiro carrega a "casca" da lista
                await this.renderRealContacts(); 
            } else {
                main.innerHTML = html;
            }

            if(viewTitle) viewTitle.innerText = name.replace('-screen', '').toUpperCase();
            this.updateActiveNav(name);
        } catch (err) {
            console.error("Erro ao carregar:", name, err);
        }
    },

    async renderRealContacts() {
        const listContainer = document.querySelector('.contacts-list-container') || document.getElementById('main-content');
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const profiles = await res.json();

        let html = '';
        profiles.forEach(p => {
            html += `
            <div class="contact-item" onclick="App.loadScreen('chat-screen')">
                <div class="avatar-circle">${p.username[0].toUpperCase()}</div>
                <div class="contact-info">
                    <h4>${p.username}</h4>
                    <p>visto recentemente</p>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>`;
        });
        listContainer.innerHTML = html;
    },

    // 📞 FUNÇÕES DE HARDWARE (ÁUDIO E VÍDEO)
    async startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const callHtml = await fetch('components/call-screen.html').then(r => r.text());
            document.body.insertAdjacentHTML('beforeend', callHtml);
            document.getElementById('localVideo').srcObject = stream;
        } catch (e) { alert("Câmera ocupada ou negada."); }
    },

    async startAudio() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            alert("Microfone ativado. Gravando...");
        } catch (e) { alert("Microfone não disponível."); }
    },

    // 🖼️ GALERIA E PAPEL DE PAREDE
    openGallery() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            alert("Imagem selecionada: " + file.name + ". Enviando...");
        };
        input.click();
    },

    updateActiveNav(screen) {
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.toggle('active', nav.dataset.screen === screen);
        });
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Botões de navegação inferior
            const nav = target.closest('.nav-item');
            if (nav) this.loadScreen(nav.dataset.screen);

            // Botão flutuante "+"
            if (target.id === 'btn-plus-social') this.openGallery();

            // Ícones dentro do Chat (Câmera e Mic)
            if (target.closest('.fa-video')) this.startVideo();
            if (target.closest('.fa-microphone')) this.startAudio();
            if (target.closest('.fa-paperclip')) this.openGallery();
            
            // Fechar chamada
            if (target.closest('.end-call')) {
                const overlay = document.querySelector('.call-overlay');
                if(overlay) overlay.remove();
            }
        });
    },

    runFirstLogin() {
        const name = prompt("Seu Nome:");
        const pin = prompt("PIN de 4 dígitos:");
        if(name && pin) {
            this.user = { name, pin };
            localStorage.setItem('oio_session', JSON.stringify(this.user));
            this.init();
        }
    }
};

App.init();
