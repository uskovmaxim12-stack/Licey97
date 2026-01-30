// Основной JavaScript файл для сайта

class LyceumWebsite {
    constructor() {
        this.currentTab = 'main';
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNews();
        this.loadDocuments();
        this.setupAdminPanel();
        this.updateDateTime();
    }

    setupEventListeners() {
        // Навигация по табам
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Навигация по меню
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Обновляем активную ссылку
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Обработка вкладок сведений
        document.querySelectorAll('.about-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.about;
                this.switchAboutTab(tabId);
            });
        });

        // Кнопка открытия админ-панели (Alt+A)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                this.toggleAdminPanel();
            }
        });
    }

    switchTab(tabId) {
        // Обновляем активную кнопку таба
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Показываем соответствующий контент
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelector(`#${tabId}-tab`).classList.add('active');
        
        this.currentTab = tabId;
    }

    switchAboutTab(tabId) {
        // Обновляем активную кнопку вкладки сведений
        document.querySelectorAll('.about-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-about="${tabId}"]`).classList.add('active');
        
        // Показываем соответствующий контент
        // Здесь можно добавить загрузку данных для каждой вкладки
    }

    async loadNews() {
        try {
            const response = await fetch(`${this.apiBase}/news`);
            const news = await response.json();
            this.renderNews(news);
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            // Используем данные по умолчанию
            this.renderNews([
                {
                    id: 1,
                    date: '25.10.2023',
                    title: 'Всероссийская олимпиада школьников',
                    content: 'Стартует школьный этап Всероссийской олимпиады школьников.',
                    category: 'Объявление'
                }
            ]);
        }
    }

    renderNews(news) {
        const container = document.getElementById('newsContainer');
        if (!container) return;

        container.innerHTML = news.map(item => `
            <div class="news-card">
                <div class="news-date">${item.date} <span class="news-category">${item.category}</span></div>
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        `).join('');
    }

    async loadDocuments() {
        try {
            const response = await fetch(`${this.apiBase}/documents`);
            const documents = await response.json();
            this.renderDocuments(documents);
        } catch (error) {
            console.error('Ошибка загрузки документов:', error);
        }
    }

    renderDocuments(documents) {
        const container = document.getElementById('documentsContainer');
        if (!container) return;

        container.innerHTML = documents.map(doc => `
            <div class="document-item">
                <div class="document-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="document-info">
                    <h4>${doc.name}</h4>
                    <div class="document-meta">
                        <span>${doc.type}</span>
                        <span>${doc.date}</span>
                        <span>${doc.size}</span>
                    </div>
                </div>
                <button class="download-btn" onclick="window.open('${doc.url}', '_blank')">
                    <i class="fas fa-download"></i> Скачать
                </button>
            </div>
        `).join('');
    }

    setupAdminPanel() {
        // Проверяем, залогинен ли администратор
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.showAdminContent();
        }
    }

    toggleAdminPanel() {
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    async loginAdmin() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        try {
            const response = await fetch(`${this.apiBase}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                this.showAdminContent();
            } else {
                alert('Неверные учетные данные');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            alert('Ошибка соединения с сервером');
        }
    }

    showAdminContent() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
    }

    showAddNews() {
        document.getElementById('addNewsModal').style.display = 'block';
    }

    async saveNews() {
        const title = document.getElementById('newsTitle').value;
        const content = document.getElementById('newsContent').value;
        const category = document.getElementById('newsCategory').value;

        if (!title || !content) {
            alert('Заполните все обязательные поля');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, category })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Новость успешно добавлена');
                this.closeModal('addNewsModal');
                this.loadNews(); // Обновляем список новостей
            }
        } catch (error) {
            console.error('Ошибка сохранения новости:', error);
            alert('Ошибка сохранения новости');
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(`${sectionId}-section`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const dateTimeStr = now.toLocaleDateString('ru-RU', options);
        
        // Добавляем дату в футер
        const dateElement = document.createElement('div');
        dateElement.className = 'current-date';
        dateElement.textContent = `Текущая дата: ${dateTimeStr}`;
        
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            footerBottom.prepend(dateElement);
        }
    }

    // Вспомогательные функции для внешних ссылок
    static openExternalLink(url) {
        window.open(url, '_blank');
    }

    static printPage() {
        window.print();
    }

    static sharePage() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Официальный сайт Лицея №97 г. Челябинска',
                url: window.location.href
            });
        } else {
            alert('Поделиться можно через кнопки социальных сетей');
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.lyceumSite = new LyceumWebsite();
    
    // Добавляем глобальные функции для кнопок
    window.openSchedule = () => {
        window.open('https://dnevnik.ru', '_blank');
    };
    
    window.openContacts = () => {
        document.querySelector('[href="#contacts"]').click();
    };
    
    window.searchSite = () => {
        const query = prompt('Введите поисковый запрос:');
        if (query) {
            alert(`Поиск по запросу: ${query}\n\nВ реальном сайте здесь будет поисковая система.`);
        }
    };
});
