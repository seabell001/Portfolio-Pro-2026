// theme.js - 主题切换逻辑
(function() {
    'use strict';
    
    // 获取DOM元素
    const themeToggle = document.getElementById('theme-toggle');
    const darkStyle = document.getElementById('dark-style');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');
    
    // 检查本地存储的主题偏好
    function getStoredTheme() {
        const stored = localStorage.getItem('portfolio-theme');
        if (stored) {
            return stored;
        }
        // 如果没有存储的偏好，检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // 应用主题
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkStyle.removeAttribute('disabled');
            if (iconSun && iconMoon) {
                iconSun.style.display = 'none';
                iconMoon.style.display = 'inline';
            }
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            darkStyle.setAttribute('disabled', '');
            if (iconSun && iconMoon) {
                iconSun.style.display = 'inline';
                iconMoon.style.display = 'none';
            }
            localStorage.setItem('portfolio-theme', 'light');
        }
    }
    
    // 切换主题
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    // 初始化主题
    function initTheme() {
        const theme = getStoredTheme();
        applyTheme(theme);
    }
    
    // 监听系统主题变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // 只有当用户没有手动设置过主题时，才跟随系统
            if (!localStorage.getItem('portfolio-theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // 绑定切换按钮事件
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // 导出供全局使用
    window.ThemeManager = {
        toggle: toggleTheme,
        apply: applyTheme,
        getCurrent: () => document.documentElement.getAttribute('data-theme') || 'light'
    };
})();
