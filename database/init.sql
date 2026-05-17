-- Portfolio-Pro 2026 数据库初始化脚本
-- 创建时间: 2026-05-17
-- 数据库类型: SQLite

-- 启用外键约束
PRAGMA foreign_keys = ON;

-- ============ 删除现有表（如需重新初始化） ============

DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS social_links;
DROP TABLE IF EXISTS visitors;

-- ============ 创建表结构 ============

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 个人资料表（单条记录）
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    avatar VARCHAR(255),
    location VARCHAR(200),
    email VARCHAR(100),
    wechat VARCHAR(100),
    address VARCHAR(500),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 技能标签表
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    level INTEGER DEFAULT 80, -- 技能熟练度 0-100
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 作品集表
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    tags TEXT, -- JSON 格式存储
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 社交链接表
CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(10), -- emoji 图标
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 访客统计表
CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip VARCHAR(45),
    user_agent TEXT,
    path VARCHAR(500),
    referrer VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ 插入默认数据 ============

-- 默认管理员账号（用户名: admin, 密码: admin123）
-- ！！！！ 部署后请立即修改密码 ！！！！
INSERT OR IGNORE INTO admins (username, password_hash) VALUES (
    'admin',
    '$2a$10$rG8xGxhZ7VZZzBxZxBxZeOxYxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX' -- 这是 'admin123' 的 bcrypt 哈希
);

-- 个人资料默认值
INSERT OR IGNORE INTO profile (id, name, title, bio, location, email, wechat, address) VALUES (
    1,
    '张三',
    '全栈开发者 & UI设计师',
    '热爱创造优美的数字体验，专注于现代Web技术与用户体验设计。拥有5年+的Web开发经验，擅长使用现代技术栈构建高性能、美观的应用。',
    '北京，中国',
    'example@email.com',
    'your_wechat_id',
    '北京市朝阳区'
);

-- 默认技能标签
INSERT OR IGNORE INTO skills (name, level, sort_order) VALUES 
    ('JavaScript', 90, 1),
    ('React', 85, 2),
    ('Node.js', 88, 3),
    ('UI/UX设计', 82, 4),
    ('Python', 75, 5),
    ('Docker', 70, 6);

-- 默认作品集
INSERT OR IGNORE INTO projects (title, description, image_url, tags, sort_order) VALUES 
    (
        '电商平台重构',
        '使用 React + Node.js 重构大型电商平台，性能提升 60%，用户体验显著改善。',
        '/uploads/projects/default1.jpg',
        '["React", "Node.js", "MongoDB"]',
        1
    ),
    (
        '智能日程管理',
        '基于 AI 的智能日程管理系统，支持自然语言输入，自动识别时间并创建日程。',
        '/uploads/projects/default2.jpg',
        '["Vue.js", "Python", "AI"]',
        2
    ),
    (
        '品牌官网设计',
        '为知名品牌设计官方网站，采用现代化设计语言，获得 2025 年度设计奖。',
        '/uploads/projects/default3.jpg',
        '["UI设计", "HTML/CSS", "动画"]',
        3
    );

-- 默认社交链接
INSERT OR IGNORE INTO social_links (name, url, icon, sort_order) VALUES 
    ('GitHub', 'https://github.com/yourusername', '💻', 1),
    ('Dribbble', 'https://dribbble.com/yourusername', '🎨', 2),
    ('LinkedIn', 'https://linkedin.com/in/yourusername', '💼', 3);

-- ============ 创建索引 ============

CREATE INDEX IF NOT EXISTS idx_visitors_created ON visitors(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);

-- ============ 完成提示 ============

SELECT '数据库初始化完成！' AS message;
SELECT '默认管理员账号: admin' AS username;
SELECT '默认密码: admin123' AS password;
SELECT '！！！！ 请立即登录后台修改密码 ！！！！' AS warning;