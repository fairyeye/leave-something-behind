紧急遗嘱信息系统（Emergency Legacy）

该项目用于在突发意外无法登录系统后，预先维护需要通知家人的重要信息，包括但不限于：资产信息、账号信息、以及想说却来不及说的话。

项目采用前后端分离架构：
- 后端：Java Spring Boot + Spring Security + JWT + MySQL
- 前端：Vite + React + shadcn/ui 风格组件（TailwindCSS）
- 鉴权：基于 JWT 的通用鉴权（BCrypt 加密）

目录结构
- backend/  Spring Boot 后端服务
- frontend/ Vite + React 前端工程

一、后端功能概述（backend）
1) 用户认证模块
- 注册接口：POST /api/auth/register
  - 入参：username, email, password（>=8 且包含字母和数字）
  - 校验：邮箱格式、密码强度、用户名/邮箱唯一性
  - 返回：{"success": true, "message": "Registered successfully"}
- 登录接口：POST /api/auth/login
  - 入参：identifier(邮箱或用户名), password
  - 返回：{ token: JWT, user: { id, username, email, createdAt } }
- 安全：
  - 密码使用 BCrypt 加密存储
  - JWT 认证（Bearer Token）
  - 端点权限控制：/api/auth/** 公开，其它均需要认证

2) 用户信息模块
- 查询个人信息：GET /api/user/me（需认证）
  - 返回：id, username, email, createdAt
- 更新个人信息：PUT /api/user/update（需认证）
  - 入参：username, email（均唯一性校验）

3) 核心功能：信息维护（Legacy）
- 用于记录资产、账号、消息等个人希望在紧急情况后通知给家人的信息
- 数据结构：LegacyItem { id, category(ASSET/ACCOUNT/MESSAGE/OTHER), title, content, createdAt, updatedAt }
- API：
  - GET /api/legacy 列表（当前用户）
  - POST /api/legacy 新增
  - GET /api/legacy/{id} 查询
  - PUT /api/legacy/{id} 更新
  - DELETE /api/legacy/{id} 删除

4) 统一错误处理
- 返回格式：{ timestamp, status, error, message, path }

5) 输入验证
- 使用 Hibernate Validator 注解（@Email、@Size、@Pattern 等）

6) 数据库设计
- users
  - id (PK), username (UNIQUE), email (UNIQUE), password, roles, created_at, updated_at
- legacy_items
  - id (PK), user_id (FK->users.id), category, title, content, created_at, updated_at
- JPA 自动建表（spring.jpa.hibernate.ddl-auto=update）

7) 运行后端
- 准备 MySQL：
  - Docker 方式：
    docker run --name legacy-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=legacydb -p 3306:3306 -d mysql:8
- 配置环境变量（可选）：
  - DB_URL（默认 jdbc:mysql://localhost:3306/legacydb?useSSL=false&serverTimezone=UTC）
  - DB_USERNAME（默认 root）
  - DB_PASSWORD（默认 password）
  - JWT_SECRET（默认 change-this-secret-please-change-to-a-long-random-string）
  - CORS_ALLOWED_ORIGINS（默认 http://localhost:5173）
- 启动：
  cd backend && mvn spring-boot:run
- Swagger UI：
  http://localhost:8080/swagger-ui/index.html

二、前端功能概述（frontend）
1) 页面
- 登录页：邮箱/用户名、密码、登录按钮、注册链接
- 注册页：用户名、邮箱、密码、确认密码、注册按钮
- 主页：欢迎信息、导航（Legacy/个人信息）、用户状态
- 个人信息页：显示 id/用户名/邮箱/注册时间，可编辑用户名/邮箱
- 信息维护页（Legacy）：
  - 表单：类别(ASSET/ACCOUNT/MESSAGE/OTHER)、标题、内容
  - 列表：显示当前用户所有信息，支持编辑/删除

2) 运行前端
- 配置环境：
  cp frontend/.env.example frontend/.env  # 如需要修改 API 地址
- 安装依赖并启动：
  cd frontend
  npm install
  npm run dev
- 浏览器访问：
  http://localhost:5173

三、API 文档（摘要）
- POST /api/auth/register
  - body: { username, email, password }
  - 200: { success, message }
- POST /api/auth/login
  - body: { identifier, password }
  - 200: { token, user }
- GET /api/user/me (Authorization: Bearer <token>)
  - 200: { id, username, email, createdAt }
- PUT /api/user/update (Authorization: Bearer <token>)
  - body: { username, email }
  - 200: { id, username, email, createdAt }
- GET /api/legacy (auth)
- POST /api/legacy (auth)
- GET /api/legacy/{id} (auth)
- PUT /api/legacy/{id} (auth)
- DELETE /api/legacy/{id} (auth)

四、部署与运行说明（简要）
- 生产部署建议：
  - 后端：打包 jar（mvn clean package），以环境变量配置数据库与 JWT_SECRET；使用 Nginx/LB 暴露 8080
  - 数据库：MySQL 高可用（备份、权限最小化）
  - 前端：构建产物（npm run build）部署到任意静态资源服务器（Nginx/S3+CDN）
  - 跨域：Nginx 反向代理同域，或配置后端 CORS_ALLOWED_ORIGINS
  - HTTPS：前后端均建议启用

五、项目结构说明
backend/
  ├─ pom.xml
  ├─ README.md
  └─ src
     ├─ main
     │  ├─ java/com/example/legacy
     │  │  ├─ EmergencyLegacyApplication.java
     │  │  ├─ config/ (Security/OpenAPI)
     │  │  ├─ controller/ (Auth, User, Legacy)
     │  │  ├─ dto/ (请求/响应 DTO)
     │  │  ├─ exception/ (统一异常处理)
     │  │  ├─ model/ (User, LegacyItem, LegacyCategory)
     │  │  ├─ repository/ (JPA 接口)
     │  │  ├─ security/ (JWT 工具/过滤器)
     │  │  └─ service/ (业务逻辑)
     │  └─ resources/application.yml

frontend/
  ├─ package.json, tsconfig.json, vite.config.ts
  ├─ tailwind.config.js, postcss.config.js, .env.example
  ├─ index.html
  └─ src/
     ├─ App.tsx, main.tsx, styles.css
     ├─ api.ts, auth.tsx
     ├─ pages/ (Login, Register, Home, Profile, Legacy)
     └─ components/ui/ (shadcn 风格基础组件 Button/Input/Label/Card/Select/Textarea)

备注
- 该项目提供了关键代码实现与最小可用功能，便于快速启动与二次开发。
- 可在此基础上扩展：多因子登录、数据加密、数据分享策略（如触发条件/可信联系人）、审计日志等。
