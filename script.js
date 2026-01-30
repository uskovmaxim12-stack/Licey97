// Главный JavaScript файл для сайта лицея

class LyceumWebsite {
    constructor() {
        this.currentTab = 'structure';
        this.newsLoaded = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupTabs();
        this.setupForms();
        this.setupModals();
        this.setupScroll();
        this.setupSchedule();
        this.updateDateTime();
    }

    // Мобильное меню
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('.navigation');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navigation.classList.toggle('active');
                menuToggle.innerHTML = navigation.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Плавная навигация
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Обновляем активную ссылку
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Плавный скролл
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Табы в разделе "Сведения"
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Обновляем активную кнопку
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Показываем активную вкладку
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === tabId) {
                        pane.classList.add('active');
                    }
                });
                
                this.currentTab = tabId;
            });
        });

        // Табы расписания
        const scheduleTabs = document.querySelectorAll('.schedule-tab');
        scheduleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const grade = tab.dataset.grade;
                
                // Обновляем активную вкладку
                scheduleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Здесь можно загружать расписание для выбранного класса
                console.log(`Загружаем расписание для ${grade} классов`);
            });
        });
    }

    // Формы
    setupForms() {
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(feedbackForm);
                const data = Object.fromEntries(formData);
                
                // Здесь будет отправка на сервер
                // Временно показываем уведомление
                this.showNotification('Сообщение отправлено! Мы ответим вам в ближайшее время.', 'success');
                feedbackForm.reset();
            });
        }
    }

    // Модальные окна
    setupModals() {
        const modal = document.getElementById('documentsModal');
        const closeBtn = document.querySelector('.modal-close');
        
        // Закрытие модального окна
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        // Закрытие по клику на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    // Показать документы
    showDocuments() {
        const modal = document.getElementById('documentsModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Загрузка новостей
    async loadMoreNews() {
        if (this.newsLoaded) return;
        
        const newsContainer = document.querySelector('.news-grid');
        if (!newsContainer) return;
        
        // Здесь будет загрузка с сервера
        // Временно добавляем демо-новости
        const demoNews = [
            {
                date: '15.10.2023',
                category: 'Олимпиада',
                title: 'Всероссийская олимпиада школьников',
                excerpt: 'Стартует школьный этап всероссийской олимпиады по всем предметам.',
                link: '#'
            },
            {
                date: '12.10.2023',
                category: 'Искусство',
                title: 'Конкурс художественного творчества',
                excerpt: 'Приглашаем учащихся принять участие в городском конкурсе рисунков.',
                link: '#'
            },
            {
                date: '10.10.2023',
                category: 'Наука',
                title: 'Экскурсия в университет',
                excerpt: 'Ученики 10-11 классов посетили лаборатории ЧелГУ.',
                link: '#'
            }
        ];
        
        demoNews.forEach(news => {
            const newsCard = document.createElement('article');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `
                <div class="news-date">${news.date}</div>
                <div class="news-category">${news.category}</div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="${news.link}" class="news-link">Подробнее <i class="fas fa-arrow-right"></i></a>
            `;
            newsContainer.appendChild(newsCard);
        });
        
        this.newsLoaded = true;
        this.showNotification('Загружены дополнительные новости', 'info');
    }

    // Плавный скролл
    setupScroll() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Скрытие/показ шапки
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Подсветка активного раздела
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Расписание
    setupSchedule() {
        // Можно добавить динамическую загрузку расписания по классам
        console.log('Модуль расписания инициализирован');
    }

    // Уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Закрытие
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Автозакрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
        
        // Стили для уведомлений
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    padding: 16px 24px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    max-width: 400px;
                    transform: translateX(150%);
                    transition: transform 0.3s ease;
                    z-index: 3000;
                    border-left: 4px solid #2563eb;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left-color: #10b981;
                }
                
                .notification-info {
                    border-left-color: #3b82f6;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .notification-content i {
                    font-size: 20px;
                    color: inherit;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                }
                
                .notification-close:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Дата и время
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
        dateElement.textContent = `Сегодня: ${dateTimeStr}`;
        dateElement.style.cssText = `
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            footerBottom.appendChild(dateElement);
        }
    }

    // Внешние ссылки
    static openExternalLink(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Печать страницы
    static printPage() {
        window.print();
    }

    // Поделиться
    static sharePage() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Официальный сайт Лицея №97 г. Челябинска',
                url: window.location.href
            });
        } else {
            // Альтернатива для браузеров без поддержки Web Share API
            prompt('Скопируйте ссылку:', window.location.href);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.lyceumSite = new LyceumWebsite();
    
    // Глобальные функции для кнопок
    window.openSchedule = () => LyceumWebsite.openExternalLink('https://dnevnik.ru');
    window.openMap = () => LyceumWebsite.openExternalLink('https://yandex.ru/maps/56/chelyabinsk/?text=ул. Чичерина, 27А');
    window.shareSite = () => LyceumWebsite.sharePage();
    window.printSite = () => LyceumWebsite.printPage();
    
    // Анимация при загрузке
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Отслеживание ошибок
    window.addEventListener('error', (e) => {
        console.error('Ошибка на сайте:', e.error);
    });
});

// Полифиллы для старых браузеров
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
