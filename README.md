# 番茄阅读 - 小说阅读平台

移动端优先的小说阅读平台，类似"番茄小说"。Vue 3 + Vant UI + Express + SQLite。

## 快速启动

```bash
# 1. 安装依赖 + 生成数据 + 构建前端
npm run setup

# 2. 启动服务（访问 http://localhost:3001）
npm start
```

## 演示账号

- 用户名: `testuser`  密码: `123456`

## 开发模式

```bash
npm install
npm run seed          # 生成测试数据

# 终端1：启动后端（端口3001）
npm run dev:server

# 终端2：启动前端（端口3000，热更新）
npm run dev:client
```

## 部署到服务器

### Railway / Render（推荐）

1. 上传代码到 GitHub
2. 在 Railway/Render 中关联仓库
3. 启动命令设为：`npm run setup && npm start`
4. 设置环境变量 `JWT_SECRET=你的随机密钥`

### VPS 自部署

```bash
git clone https://github.com/你的用户名/novel-reader.git
cd novel-reader
npm run setup
npm start
```

配合 PM2 守护进程：

```bash
npm install -g pm2
pm2 start "npm start" --name novel-reader
pm2 save
pm2 startup
```

### Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 + Vite + Vant 4 + Pinia + Vue Router |
| 后端 | Express 5 + TypeScript (tsx) |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT + bcrypt |

## 功能

- 首页推荐（Banner、热门、新书、分类精选）
- 分类浏览（10个分类、无限滚动）
- 小说搜索（关键词搜索 + 热搜标签）
- 沉浸式阅读器（滚动/翻页双模式、日夜间主题、字号调节）
- 书架 + 阅读历史
- 用户注册/登录
- 15本预置小说，每本30-80章
