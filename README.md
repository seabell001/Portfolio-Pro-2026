# Portfolio-Pro 2026

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-blue.svg)](https://www.sqlite.org/)

**Portfolio-Pro 2026** - 高端轻奢极简风个人主页系统，面向开发者、设计师、自媒体、个人站长使用。

> 🎨 干净高级 · 💎 轻奢质感 · 🚀 商务简约 · 📱 三端自适应

---

## ✨ 项目特性

| 模块 | 功能描述 |
|------|----------|
| 🏠 **前台展示** | 个人头像展示、动态简介标语、个人信息介绍、技能标签展示、项目作品集展示、社交链接、联系方式（微信/邮箱/地址） |
| 📊 **交互体验** | 访客统计、明暗双主题、滚动动画、渐变高级 UI、平滑过渡效果 |
| 🎛 **后台管理** | 账号登录、主页信息一键修改、头像上传、简介编辑、技能标签增删改、作品集项目管理、社交链接配置、联系方式自定义 |
| 📈 **数据统计** | 访客数据统计、密码修改、数据缓存清理、全站内容可视化管理（零基础傻瓜式操作） |

---

## 🖥️ 技术栈

- **前端**：HTML5 + CSS3（渐变高级 UI）+ Vanilla JavaScript（无框架依赖）
- **后端**：Node.js + Express + SQLite（轻量无运维）
- **部署**：支持所有合规云服务器、VPS、学生机一键部署
- **兼容**：Linux / Windows 系统，运行超低资源占用，稳定不卡顿

---

## 📂 项目结构

```
Portfolio-Pro/
├── frontend/          # 前台展示页面
│   ├── index.html    # 主页面（自适应三端）
│   ├── css/
│   │   ├── style.css       # 主样式（渐变高级 UI）
│   │   ├── dark.css        # 暗黑主题
│   │   └── animations.css  # 滚动动画
│   ├── js/
│   │   ├── main.js         # 主逻辑
│   │   └── theme.js        # 主题切换
│   └── assets/
│       ├── avatars/        # 头像存储
│       └── projects/       # 作品图片
├── backend/           # 后台管理系统
│   ├── admin.html     # 管理登录页
│   ├── dashboard.html # 管理后台主页
│   ├── server.js       # 后端 API 服务
│   └── css/             # 后台样式
├── database/          # 数据库
│   ├── init.sql        # 初始化脚本
│   └── portfolio.db    # SQLite 数据库（初始化后生成）
├── uploads/           # 上传文件目录
│   ├── avatars/        # 用户头像
│   └── projects/       # 作品图片
├── .env.example       # 环境变量示例
├── package.json       # Node.js 依赖配置
└── README.md         # 完整文档
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm 或 yarn
- SQLite3

### 一键部署

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/Portfolio-Pro.git
cd Portfolio-Pro

# 2. 安装依赖
npm install

# 3. 初始化数据库（重要！）
sqlite3 database/portfolio.db < database/init.sql

# 4. 配置环境变量
cp .env.example .env
nano .env  # 修改 JWT_SECRET 为随机字符串

# 5. 启动服务
npm start
```

访问 `http://localhost:3000` 即可看到个人主页。

**默认管理员账号**：
- 用户名：`admin`
- 密码：`admin123`
- ⚠️ **首次登录后请立即修改密码！**

---

## 📖 详细部署教程

### CentOS 部署

#### 1. 安装 Node.js

```bash
# 使用 NVM 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node --version  # 验证安装成功
```

#### 2. 安装项目

```bash
# 克隆项目
git clone https://github.com/yourusername/Portfolio-Pro.git
cd Portfolio-Pro

# 安装依赖
npm install --production

# 初始化数据库
sqlite3 database/portfolio.db < database/init.sql

# 配置环境变量
cp .env.example .env
nano .env
```

修改 `.env` 文件：
```
PORT=3000
JWT_SECRET=your-random-secret-key-here  # 务必修改！
```

#### 3. 使用 PM2 守护进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start backend/server.js --name portfolio

# 设置开机自启
pm2 startup
pm2 save
```

#### 4. 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Ubuntu / Debian 部署

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 后续步骤与 CentOS 相同
```

### Windows Server 部署

```cmd
# 1. 安装 Node.js
# 访问 https://nodejs.org/ 下载安装包，安装完成后重启

# 2. 克隆或下载项目
git clone https://github.com/yourusername/Portfolio-Pro.git
cd Portfolio-Pro

# 3. 安装依赖
npm install

# 4. 初始化数据库
sqlite3 database/portfolio.db < database/init.sql

# 5. 配置环境变量
copy .env.example .env
notepad .env  # 修改 JWT_SECRET

# 6. 启动
npm start
```

#### Windows 注册为系统服务（可选）

```cmd
npm install -g node-windows
# 使用 node-windows 将应用注册为服务
```

---

## 🎨 使用教程

### 1. 修改个人资料

1. 访问 `http://yourdomain.com/backend/admin.html` 登录后台
2. 点击左侧「个人资料」
3. 修改姓名、职位、简介、联系方式
4. 上传头像
5. 点击「保存修改」

### 2. 管理技能标签

1. 进入「技能管理」
2. 点击「添加技能」输入技能名称和熟练度（0-100）
3. 可删除已有技能标签

### 3. 添加作品集

1. 进入「作品管理」
2. 点击「添加作品」
3. 填写标题、描述、上传封面图
4. 填写标签（JSON 格式，如 `["React", "Node.js"]`）
5. 保存

### 4. 配置社交链接

1. 进入「社交链接」
2. 点击「添加链接」
3. 填写平台名称、URL、Emoji 图标
4. 保存

### 5. 修改密码

1. 进入「系统设置」
2. 输入旧密码、新密码、确认新密码
3. 点击「修改密码」

---

## 📊 后台功能一览

| 功能模块 | 说明 |
|----------|------|
| 概览 | 访客总数、技能标签数、作品数量、社交链接数 |
| 个人资料 | 头像上传、姓名、职位、简介、所在地、邮箱、微信、地址 |
| 技能管理 | 添加技能、删除技能、熟练度设置 |
| 作品管理 | 添加作品、删除作品、图片上传、标签管理 |
| 社交链接 | 添加链接、删除链接、图标配置 |
| 系统设置 | 密码修改、缓存清理 |

---

## 🌐 云服务器推荐（合规自用分享）

部署个人主页，选择一台稳定靠谱的云服务器至关重要。以下是我个人搭建项目时用过、觉得性价比不错的云服务商，**仅供参考，请按实际需求选择**。

| 云服务商 | 推荐配置 | 适用场景 | 备注 |
|---------|----------|----------|------|
| **阿里云** | 轻量应用服务器 2核2G | 个人博客、小型项目 | 国内访问快，需备案 |
| **腾讯云** | 云服务器 S5 2核4G | 中小企业、高并发 | 学生机优惠多 |
| **华为云** | 通用计算型 2核4G | 企业级应用 | 国内合规 |

> 💡 **个人推荐**：新手建议选择**按量付费**或**包月套餐**，成本可控。国内服务器需**备案**，香港/海外服务器无需备案但延迟略高。

### 为什么需要云服务器？

Portfolio-Pro 需要运行在具有公网 IP 的服务器上，才能：
- 绑定域名，提供对外访问
- 使用 HTTPS 保障数据传输安全
- 确保 24 小时在线
- 支持头像和作品图片上传

---

## ❓ 常见问题

### Q1: 启动时报错 "Cannot find module 'express'"

**A**: 依赖未安装完整，执行：
```bash
rm -rf node_modules
npm install
```

### Q2: 数据库初始化失败

**A**: 确保已安装 SQLite3：
```bash
# CentOS
sudo yum install -y sqlite-devel

# Ubuntu/Debian
sudo apt-get install -y sqlite3 libsqlite3-dev
```

### Q3: 上传文件失败

**A**: 检查 `uploads/` 目录权限：
```bash
mkdir -p uploads/avatars uploads/projects
chmod 755 uploads
```

### Q4: 如何启用 HTTPS

**A**: 使用 Let's Encrypt 免费证书：
```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com
```

### Q5: 如何备份数据

**A**: 定期备份数据库文件：
```bash
# 每日备份脚本
cp database/portfolio.db /backup/portfolio_$(date +%Y%m%d).db
```

---

## 📝 更新日志

### v1.0.0 (2026-05-17)

- 🎉 初始版本发布
- ✨ 高端轻奢极简风格设计
- 📱 手机、平板、电脑三端完美自适应
- 🌗 明暗双主题支持
- 📊 完整的后台管理系统
- 📈 访客统计功能

---

## 📄 开源协议

本项目基于 [MIT 协议](LICENSE) 开源，欢迎大家 Star、Fork、提 Issue 和 PR！

---

## 📧 联系作者

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your@email.com

---

⭐️ **如果这个项目对你有帮助，欢迎点个 Star！**