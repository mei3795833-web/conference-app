User: 微信小程序太多限制和审核，我们干脆写个网页挂在我们网站的子域名上

Decision: 完全同意！网页版确实更灵活，无需审核，跨平台兼容。将微信小程序代码转换为Web版本，部署到子域名。

Key reasoning:
- 微信小程序需要审核，更新迭代慢
- 网页版无需审核，即时上线
- 纯静态文件，部署简单，任何Web服务器都支持
- 跨平台：手机、平板、电脑都能访问
- 可随时添加后端API实现动态功能

Actions taken:
1. Created conference-web/ directory with complete Web version
2. Converted all 5 pages (home, command, traffic, hotel, profile) to HTML/CSS/JS
3. Replaced WeChat-specific APIs with standard Web equivalents
4. Used Font Awesome icons instead of WeChat image resources
5. Added responsive design for mobile-first experience
6. Created deployment guide (README.md) with Nginx/Apache configs

Files created:
- conference-web/index.html (entry point with tab navigation)
- conference-web/css/style.css (global styles, responsive design)
- conference-web/js/app.js (app logic, page routing, all 5 pages)
- conference-web/README.md (deployment guide)

Next steps:
1. Upload conference-web folder to server
2. Configure subdomain (e.g., conference.yourdomain.com)
3. Optional: Add backend API (Node.js + MongoDB) for dynamic features