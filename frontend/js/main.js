// main.js - 主逻辑
(function() {
    'use strict';
    
    // ============ 配置 ============
    const CONFIG = {
        apiBase: window.location.origin + '/api',
        animateThreshold: 0.15,
        staggerDelay: 100
    };
    
    // ============ 数据模型 ============
    const PortfolioData = {
        profile: {
            name: '张三',
            title: '全栈开发者 & UI设计师',
            bio: '热爱创造优美的数字体验，专注于现代Web技术与用户体验设计',
            location: '北京，中国',
            email: 'example@email.com',
            wechat: 'your_wechat_id',
            address: '北京市朝阳区'
        },
        skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 88 },
            { name: 'UI/UX设计', level: 82 },
            { name: 'Python', level: 75 },
            { name: 'Docker', level: 70 }
        ],
        projects: [
            {
                id: 1,
                title: '电商平台重构',
                description: '使用 React + Node.js 重构大型电商平台，性能提升 60%',
                image: 'assets/projects/project1.jpg',
                tags: ['React', 'Node.js', 'MongoDB']
            },
            {
                id: 2,
                title: '智能日程管理',
                description: '基于 AI 的智能日程管理系统，支持自然语言输入',
                image: 'assets/projects/project2.jpg',
                tags: ['Vue.js', 'Python', 'AI']
            },
            {
                id: 3,
                title: '品牌官网设计',
                description: '为知名品牌设计官方网站，获得 2025 设计奖',
                image: 'assets/projects/project3.jpg',
                tags: ['UI设计', 'HTML/CSS', '动画']
            }
        ],
        socialLinks: [
            { name: 'GitHub', url: 'https://github.com/yourusername', icon: '💻' },
            { name: 'Dribbble', url: 'https://dribbble.com/yourusername', icon: '🎨' },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: '💼' }
        ],
        stats: {
            projects: 50,
            experience: 5,
            clients: 30
        }
    };
    
    // ============ 工具函数 ============
    function $(selector) {
        return document.querySelector(selector);
    }
    
    function $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    function createElement(tag, className, innerHTML) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }
    
    // ============ 动画观察器 ============
    function initScrollAnimations() {
        const animatables = $$('[data-animate]');
        
        if (!('IntersectionObserver' in window)) {
            // 降级处理：直接显示
            animatables.forEach(el => el.classList.add('animated'));
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, delay);
                    
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: CONFIG.animateThreshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatables.forEach(el => observer.observe(el));
    }
    
    // ============ 移动端菜单 ============
    function initMobileMenu() {
        const menuBtn = $('#mobile-menu-btn');
        const mobileMenu = $('#mobile-menu');
        
        if (!menuBtn || !mobileMenu) return;
        
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // 点击菜单项后关闭
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
    
    // ============ 导航栏滚动效果 ============
    function initNavbarScroll() {
        const navbar = $('#navbar');
        if (!navbar) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            } else {
                navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============ 加载个人资料 ============
    function loadProfile() {
        const profile = PortfolioData.profile;
        
        const heroName = $('#hero-name');
        const heroTagline = $('#hero-tagline');
        const heroBio = $('#hero-bio');
        
        const infoName = $('#info-name');
        const infoTitle = $('#info-title');
        const infoLocation = $('#info-location');
        const infoEmail = $('#info-email');
        
        const aboutText = $('#about-text');
        
        const contactEmail = $('#contact-email');
        const contactWechat = $('#contact-wechat');
        const contactAddress = $('#contact-address');
        
        if (heroName) heroName.textContent = profile.name;
        if (heroTagline) heroTagline.textContent = profile.title;
        if (heroBio) heroBio.textContent = profile.bio;
        
        if (infoName) infoName.textContent = profile.name;
        if (infoTitle) infoTitle.textContent = profile.title;
        if (infoLocation) infoLocation.textContent = profile.location;
        if (infoEmail) infoEmail.textContent = profile.email;
        
        if (aboutText) aboutText.textContent = profile.bio;
        
        if (contactEmail) contactEmail.textContent = profile.email;
        if (contactWechat) contactWechat.textContent = profile.wechat;
        if (contactAddress) contactAddress.textContent = profile.address;
    }
    
    // ============ 加载技能标签 ============
    function loadSkills() {
        const container = $('#skills-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        PortfolioData.skills.forEach((skill, index) => {
            const tag = createElement('div', 'skill-tag', skill.name);
            tag.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(tag);
        });
    }
    
    // ============ 加载作品集 ============
    function loadProjects() {
        const container = $('#projects-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        PortfolioData.projects.forEach((project, index) => {
            const card = createElement('div', 'project-card');
            card.setAttribute('data-animate', 'fade-up');
            card.setAttribute('data-delay', `${index * 100}`);
            
            const tagsHTML = project.tags.map(tag => 
                `<span class="project-tag">${tag}</span>`
            ).join('');
            
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-tags">${tagsHTML}</div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
    
    // ============ 加载社交链接 ============
    function loadSocialLinks() {
        const container = $('#social-links');
        if (!container) return;
        
        container.innerHTML = '';
        
        PortfolioData.socialLinks.forEach(link => {
            const a = createElement('a', 'social-link', `
                <span class="social-icon">${link.icon}</span>
                <span class="social-name">${link.name}</span>
            `);
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            container.appendChild(a);
        });
    }
    
    // ============ 加载统计数据 ============
    function loadStats() {
        const stats = PortfolioData.stats;
        
        const statProjects = $('#stat-projects');
        const statExperience = $('#stat-experience');
        const statClients = $('#stat-clients');
        
        if (statProjects) animateNumber(statProjects, 0, stats.projects, 2000);
        if (statExperience) animateNumber(statExperience, 0, stats.experience, 2000);
        if (statClients) animateNumber(statClients, 0, stats.clients, 2000);
    }
    
    // ============ 数字动画 ============
    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用 easeOutExpo 缓动函数
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(start + (end - start) * eased);
            
            element.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // ============ 记录访客 ============
    async function logVisitor() {
        try {
            await fetch(`${CONFIG.apiBase}/visitors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: window.location.pathname,
                    referrer: document.referrer
                })
            });
        } catch (error) {
            console.error('记录访客失败:', error);
        }
    }
    
    // ============ 加载访客数 ============
    async function loadVisitorCount() {
        const visitorCount = $('#visitor-count');
        if (!visitorCount) return;
        
        try {
            const response = await fetch(`${CONFIG.apiBase}/visitors/count`);
            const data = await response.json();
            visitorCount.textContent = data.count || 0;
        } catch (error) {
            console.error('加载访客数失败:', error);
            visitorCount.textContent = '--';
        }
    }
    
    // ============ 平滑滚动 ============
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = $(targetId);
                if (target) {
                    const navHeight = $('#navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============ 初始化 ============
    function init() {
        // 加载数据
        loadProfile();
        loadSkills();
        loadProjects();
        loadSocialLinks();
        loadStats();
        
        // 初始化交互
        initScrollAnimations();
        initMobileMenu();
        initNavbarScroll();
        initSmoothScroll();
        
        // 记录访客
        logVisitor();
        
        // 加载访客数
        loadVisitorCount();
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
