# 大会管理系统 - Web版

## 项目概述

大会管理系统的网页版本，无需微信审核，可直接部署到网站子域名使用。

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **UI框架**: Font Awesome 图标
- **部署**: 静态文件，支持任何Web服务器

## 功能模块

1. **首页** - 大会总览、快捷入口、今日议程、实时数据
2. **指挥** - 紧急广播、任务调度、实时数据、异常处理
3. **交通** - 机场接送、地铁线路、班车时刻、停车指引
4. **住宿** - 酒店列表、我的住宿、预订管理
5. **我的** - 个人信息、证件、日程、设置

## 文件结构

```
conference-web/
├── index.html          # 入口页面
├── css/
│   └── style.css       # 全局样式
├── js/
│   └── app.js          # 应用逻辑
└── README.md           # 项目说明
```

## 部署步骤

### 1. 上传到服务器

将 `conference-web` 文件夹上传到您的网站服务器，例如：
```
/var/www/conference.yourdomain.com/
```

### 2. 配置子域名

在域名管理后台添加子域名解析：
- **子域名**: `conference.yourdomain.com`
- **记录类型**: A 记录
- **指向**: 您的服务器IP

### 3. Web服务器配置

#### Nginx 示例
```nginx
server {
    listen 80;
    server_name conference.yourdomain.com;
    root /var/www/conference.yourdomain.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache 示例
```apache
<VirtualHost *:80>
    ServerName conference.yourdomain.com
    DocumentRoot /var/www/conference.yourdomain.com
    
    <Directory /var/www/conference.yourdomain.com>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 4. 访问

浏览器打开：`https://conference.yourdomain.com`

## 优势

✅ **无需审核** - 不需要微信审核，即时上线
✅ **跨平台** - 支持手机、平板、电脑访问
✅ **易于维护** - 纯静态文件，部署简单
✅ **可扩展** - 随时添加后端API实现动态功能

## 后续扩展

1. 添加后端API（Node.js + MongoDB）
2. 实现用户登录和权限管理
3. 添加实时数据推送（WebSocket）
4. 集成地图导航功能
5. 添加数据导出功能

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+
