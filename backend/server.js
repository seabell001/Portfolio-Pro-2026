// backend/server.js - 后端 API 主服务
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-pro-2026-secret-key';

// 中间件
app.use(helmet({
    contentSecurityPolicy: false // 简化 CSP，方便部署
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/backend', express.static(__dirname));

// 数据库连接
const db = new sqlite3.Database(
    path.join(__dirname, '../database/portfolio.db'),
    (err) => {
        if (err) {
            console.error('数据库连接失败:', err);
        } else {
            console.log('数据库连接成功');
        }
    }
);

// ============ 工具函数 ============

// JWT 生成
function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// 认证中间件
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: '未授权' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token 无效' });
    }
}

// 文件上传配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = file.fieldname === 'avatar' ? 'uploads/avatars' : 'uploads/projects';
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/i;
        const ext = allowed.test(path.extname(file.originalname));
        const mime = allowed.test(file.mimetype);
        
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('仅支持图片格式!'));
        }
    }
});

// ============ 认证路由 ============

// 管理员登录
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: '请输入用户名和密码' });
    }
    
    db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
        if (err) {
            return res.status(500).json({ error: '服务器错误' });
        }
        
        if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        const token = generateToken(admin);
        res.json({
            token,
            user: { id: admin.id, username: admin.username }
        });
    });
});

// ============ 前台 API ============

// 获取个人资料
app.get('/api/profile', (req, res) => {
    db.get('SELECT * FROM profile WHERE id = 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row || {});
    });
});

// 获取技能列表
app.get('/api/skills', (req, res) => {
    db.all('SELECT * FROM skills ORDER BY sort_order ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 获取作品列表
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 获取社交链接
app.get('/api/social', (req, res) => {
    db.all('SELECT * FROM social_links ORDER BY sort_order ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 记录访客
app.post('/api/visitors', (req, res) => {
    const { path: pagePath, referrer } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    db.run(
        'INSERT INTO visitors (ip, path, referrer) VALUES (?, ?, ?)',
        [ip, pagePath || '/', referrer || ''],
        function(err) {
            if (err) {
                console.error('记录访客失败:', err);
            }
            res.json({ success: true });
        }
    );
});

// 获取访客数
app.get('/api/visitors/count', (req, res) => {
    db.get('SELECT COUNT(*) as count FROM visitors', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ count: row.count });
    });
});

// ============ 后台管理 API (需认证) ============

// 获取统计数据
app.get('/api/admin/stats', authMiddleware, (req, res) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM visitors', [], (err, row) => {
        stats.visitors = row.count;
        
        db.get('SELECT COUNT(*) as count FROM skills', [], (err, row) => {
            stats.skills = row.count;
            
            db.get('SELECT COUNT(*) as count FROM projects', [], (err, row) => {
                stats.projects = row.count;
                
                db.get('SELECT COUNT(*) as count FROM social_links', [], (err, row) => {
                    stats.social = row.count;
                    res.json(stats);
                });
            });
        });
    });
});

// 更新个人资料
app.put('/api/admin/profile', authMiddleware, (req, res) => {
    const { name, title, bio, location, email, wechat, address } = req.body;
    
    db.run(`
        UPDATE profile 
        SET name = ?, title = ?, bio = ?, location = ?, email = ?, wechat = ?, address = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
    `, [name, title, bio, location, email, wechat, address], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, changes: this.changes });
    });
});

// 技能管理
app.post('/api/admin/skills', authMiddleware, (req, res) => {
    const { name, level } = req.body;
    
    db.run(
        'INSERT INTO skills (name, level) VALUES (?, ?)',
        [name, level || 80],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/admin/skills/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM skills WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// 作品管理
app.post('/api/admin/projects', authMiddleware, upload.single('image'), (req, res) => {
    const { title, description, tags } = req.body;
    const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : '';
    
    db.run(
        'INSERT INTO projects (title, description, image_url, tags) VALUES (?, ?, ?, ?)',
        [title, description, imageUrl, tags || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/admin/projects/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    
    // 先获取图片路径
    db.get('SELECT image_url FROM projects WHERE id = ?', [id], (err, row) => {
        if (row && row.image_url) {
            const filePath = path.join(__dirname, '..', row.image_url);
            fs.unlink(filePath, () => {}); // 删除文件，忽略错误
        }
        
        db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        });
    });
});

// 社交链接管理
app.post('/api/admin/social', authMiddleware, (req, res) => {
    const { name, url, icon } = req.body;
    
    db.run(
        'INSERT INTO social_links (name, url, icon) VALUES (?, ?, ?)',
        [name, url, icon || '🔗'],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/admin/social/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM social_links WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
    });
});

// 修改密码
app.put('/api/admin/password', authMiddleware, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    db.get('SELECT * FROM admins WHERE id = ?', [req.user.id], (err, admin) => {
        if (err || !admin) {
            return res.status(500).json({ error: '用户不存在' });
        }
        
        if (!bcrypt.compareSync(oldPassword, admin.password_hash)) {
            return res.status(400).json({ error: '旧密码错误' });
        }
        
        const newHash = bcrypt.hashSync(newPassword, 10);
        
        db.run(
            'UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newHash, req.user.id],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true });
            }
        );
    });
});

// 清理缓存
app.post('/api/admin/clear-cache', authMiddleware, (req, res) => {
    // 清理访客日志（保留最近 1000 条）
    db.run(`
        DELETE FROM visitors 
        WHERE id NOT IN (
            SELECT id FROM visitors 
            ORDER BY created_at DESC 
            LIMIT 1000
        )
    `, [], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Portfolio-Pro 2026 服务器运行在 http://localhost:${PORT}`);
    console.log(`前台地址: <ADDRESS_REMOVED>`);
    console.log(`后台地址: <ADDRESS_REMOVED>
});

module.exports = app;