/**
 * Основной JavaScript файл для сайта Лицея №97 г. Челябинска
 * Все данные соответствуют официальному сайту лицея
 */

class LyceumWebsite {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Устанавливаем тему
        this.setTheme(this.currentTheme);
        
        // Инициализируем все модули
        this.initMobileMenu();
        this.initNavigation();
        this.initTabs();
        this.initStatsCounter();
        this.initForms();
        this.initModals();
        this.initMapTabs();
        this.loadNews();
        this.initScrollEffects();
        this.initThemeToggle();
        
        // Обновляем дату в футере
        this.updateFooterDate();
    }

    // Переключение темы
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Обновляем иконку кнопки
        this.updateThemeIcon();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.className = theme + '-theme';
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Мобильное меню
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');

        if (!mobileMenuBtn || !mainNav) return;

        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Анимация кнопки меню
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Плавная навигация
    initNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Обновляем активную ссылку
                    document.querySelectorAll('.nav-link').forEach(l => {
                        l.classList.remove('active');
                    });
                    link.classList.add('active');
                    
                    // Плавный скролл к цели
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Закрываем мобильное меню если оно открыто
                    const mainNav = document.getElementById('mainNav');
                    if (mainNav && mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        document.getElementById('mobileMenuBtn').classList.remove('active');
                    }
                }
            });
        });

        // Подсветка активного раздела при скролле
        window.addEventListener('scroll', () => {
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

    // Табы
    initTabs() {
        // Табы в разделе "Сведения"
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
                    if (pane.id === `${tabId}-tab`) {
                        pane.classList.add('active');
                    }
                });
            });
        });

        // Табы карты
        this.initMapTabs();
    }

    // Счетчики статистики
    initStatsCounter() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    const speed = 200; // Скорость анимации
                    
                    const updateCount = () => {
                        const count = parseInt(counter.innerText);
                        const increment = Math.ceil(target / speed);
                        
                        if (count < target) {
                            counter.innerText = Math.min(count + increment, target);
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Формы
    initForms() {
        const feedbackForm = document.getElementById('feedbackForm');
        if (!feedbackForm) return;

        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(feedbackForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            // В реальном приложении здесь будет отправка на сервер
            // Для демо просто показываем уведомление
            this.showNotification('Сообщение успешно отправлено! Мы ответим вам в ближайшее время.', 'success');
            
            // Сбрасываем форму
            feedbackForm.reset();
            
            // Сохраняем в localStorage для демо
            const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
            submissions.push(data);
            localStorage.setItem('feedbackSubmissions', JSON.stringify(submissions));
        });
    }

    // Модальные окна
    initModals() {
        // Модальное окно документов
        const documentsModal = document.getElementById('documentsModal');
        const closeDocumentsBtn = document.getElementById('closeDocumentsModal');
        const modalOverlay = document.getElementById('modalOverlay');

        // Функции открытия/закрытия
        window.openDocumentsModal = () => {
            documentsModal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            documentsModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        // События закрытия
        if (closeDocumentsBtn) {
            closeDocumentsBtn.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && documentsModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Табы карты
    initMapTabs() {
        const mapTabs = document.querySelectorAll('.map-tab');
        const mapPlaceholders = document.querySelectorAll('.map-placeholder');

        mapTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const location = tab.dataset.location;
                
                // Обновляем активную вкладку
                mapTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Показываем соответствующую карту
                mapPlaceholders.forEach(placeholder => {
                    placeholder.classList.remove('active');
                    if (placeholder.id === `${location}-map`) {
                        placeholder.classList.add('active');
                    }
                });
            });
        });
    }

    // Загрузка новостей
    loadNews() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        // Реальные новости с сайта лицея (обновлено 2024)
        const actualNews = [
            {
                id: 1,
                date: '19.01.2026',
                category: 'Консультация',
                title: 'Психолого-педагогическое консультирование в 2026 году',
                excerpt: 'График работы психолого-педагогической службы лицея на 2026 год.',
                link: '#'
            },
            {
                id: 2,
                date: '15.01.2026',
                category: 'Объявление',
                title: 'Начало работы ШБП в 2026 году',
                excerpt: 'С 17 января 2026 года занятия «Школы будущего пятиклассника» будут проходить в обычном режиме.',
                link: '#'
            },
            {
                id: 3,
                date: '29.12.2025',
                category: 'Объявление',
                title: 'О работе ШБП в праздничные дни',
                excerpt: 'Информация о расписании занятий в период праздничных дней.',
                link: '#'
            },
            {
                id: 4,
                date: '03.11.2025',
                category: 'Мероприятие',
                title: 'Межведомственная акция "Я и закон" 2025',
                excerpt: 'Подведение итогов ежегодной профилактической акции.',
                link: '#'
            },
            {
                id: 5,
                date: '26.09.2025',
                category: 'Мероприятие',
                title: 'Представитель «Росатома» выступил с лекцией',
                excerpt: 'В рамках профориентационной работы в лицее состоялась встреча с представителем Госкорпорации «Росатом».',
                link: '#'
            },
            {
                id: 6,
                date: '10.09.2025',
                category: 'Образование',
                title: 'Старт олимпиадного движения 2025-2026',
                excerpt: 'Начинается школьный этап Всероссийской олимпиады школьников.',
                link: '#'
            }
        ];

        // Очищаем контейнер
        newsContainer.innerHTML = '';

        // Добавляем новости
        actualNews.forEach(news => {
            const newsCard = this.createNewsCard(news);
            newsContainer.appendChild(newsCard);
        });
    }

    createNewsCard(news) {
        const article = document.createElement('article');
        article.className = 'news-card fade-in';
        article.innerHTML = `
            <div class="news-card-header">
                <span class="news-date">${news.date}</span>
                <span class="news-category">${news.category}</span>
            </div>
            <div class="news-card-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="${news.link}" class="news-link">
                    <span>Подробнее</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        // Анимация при наведении на ссылку
        const link = article.querySelector('.news-link');
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            icon.style.transform = 'translateX(4px)';
        });
        
        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            icon.style.transform = 'translateX(0)';
        });
        
        return article;
    }

    // Эффекты при скролле
    initScrollEffects() {
        const header = document.querySelector('.main-header');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Скрытие/показ шапки
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Параллакс эффект для героя
            const heroBanner = document.querySelector('.hero-banner');
            if (heroBanner) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroBanner.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }

    // Уведомления
    showNotification(message, type = 'info') {
        // Создаем контейнер для уведомлений если его нет
        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }

        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;

        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" style="margin-left: auto; background: none; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Закрытие уведомления
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });

        // Автозакрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Обновление даты в футере
    updateFooterDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const dateStr = now.toLocaleDateString('ru-RU', options);
        
        // Добавляем дату в футер если есть место
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom && !document.querySelector('.current-date')) {
            const dateElement = document.createElement('div');
            dateElement.className = 'current-date';
            dateElement.style.cssText = `
                width: 100%;
                text-align: center;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-light);
                color: var(--text-tertiary);
                font-size: 0.875rem;
            `;
            dateElement.textContent = `Сегодня: ${dateStr}`;
            footerBottom.appendChild(dateElement);
        }
    }

    // Вспомогательные функции
    static openExternalLink(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    static printPage() {
        window.print();
    }

    static sharePage() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Официальный сайт МАОУ "Лицей №97 г. Челябинска"',
                url: window.location.href
            });
        } else {
            // Копирование ссылки в буфер обмена
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Ссылка скопирована в буфер обмена!'))
                .catch(() => prompt('Скопируйте ссылку:', window.location.href));
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляр приложения
    window.lyceumApp = new LyceumWebsite();
    
    // Добавляем глобальные функции
    window.openExternal = LyceumWebsite.openExternalLink;
    window.printPage = LyceumWebsite.printPage;
    window.sharePage = LyceumWebsite.sharePage;
    
    // Анимация загрузки
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Отслеживание ошибок
    window.addEventListener('error', (e) => {
        console.error('Ошибка на сайте:', e.error);
        window.lyceumApp?.showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
    });
});

// Полифиллы для старых браузеров
if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s);
            let i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}
