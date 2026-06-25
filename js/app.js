// 大会管理系统 - Web版
const App = {
    // 全局数据
    data: {
        userInfo: null,
        userRole: 'attendee',
        currentConference: {
            id: 'conf-2026-001',
            name: '2026全球科技大会',
            location: '上海国际会议中心',
            address: '上海市浦东新区滨江大道2727号',
            startDate: '2026-07-15',
            endDate: '2026-07-16',
            status: 'upcoming'
        },
        stats: {
            attendeeCount: 856,
            checkInCount: 423,
            hotelCount: 312,
            onlineCount: 156
        }
    },

    // 初始化
    init() {
        this.bindEvents();
        this.loadPage('home');
    },

    // 绑定事件
    bindEvents() {
        // TabBar切换
        document.getElementById('tabBar').addEventListener('click', (e) => {
            const tabItem = e.target.closest('.tab-item');
            if (tabItem) {
                e.preventDefault();
                const page = tabItem.dataset.page;
                this.switchTab(page);
            }
        });
    },

    // 切换Tab
    switchTab(page) {
        // 更新TabBar状态
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // 加载页面
        this.loadPage(page);
    },

    // 加载页面内容
    loadPage(page) {
        const app = document.getElementById('app');
        app.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        // 模拟页面加载
        setTimeout(() => {
            switch(page) {
                case 'home':
                    app.innerHTML = this.renderHome();
                    this.bindHomeEvents();
                    break;
                case 'command':
                    app.innerHTML = this.renderCommand();
                    break;
                case 'traffic':
                    app.innerHTML = this.renderTraffic();
                    break;
                case 'hotel':
                    app.innerHTML = this.renderHotel();
                    break;
                case 'profile':
                    app.innerHTML = this.renderProfile();
                    break;
                default:
                    app.innerHTML = this.renderHome();
            }
        }, 300);
    },

    // 渲染首页
    renderHome() {
        const conf = this.data.currentConference;
        const statusMap = {
            'upcoming': '即将开始',
            'ongoing': '进行中',
            'completed': '已结束'
        };

        return `
            <div class="page">
                <!-- 大会信息卡片 -->
                <div class="card conference-card">
                    <div class="conference-header">
                        <div class="conference-overlay">
                            <div class="conference-name">${conf.name}</div>
                            <div class="conference-date">${conf.startDate} - ${conf.endDate}</div>
                            <span class="status-tag ${conf.status}">${statusMap[conf.status]}</span>
                        </div>
                    </div>
                    <div class="conference-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt detail-icon"></i>
                            <span class="detail-text">${conf.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-location-arrow detail-icon"></i>
                            <span class="detail-text">${conf.address}</span>
                        </div>
                    </div>
                </div>

                <!-- 快捷入口 -->
                <div class="card">
                    <div class="card-title">快捷入口</div>
                    <div class="grid">
                        <div class="grid-item" onclick="App.navigateTo('agenda')">
                            <div class="grid-icon"><i class="fas fa-calendar-alt"></i></div>
                            <div class="grid-text">会议议程</div>
                        </div>
                        <div class="grid-item" onclick="App.navigateTo('attendee')">
                            <div class="grid-icon"><i class="fas fa-users"></i></div>
                            <div class="grid-text">参会人员</div>
                        </div>
                        <div class="grid-item" onclick="App.navigateTo('notice')">
                            <div class="grid-icon"><i class="fas fa-bell"></i></div>
                            <div class="grid-text">通知公告</div>
                        </div>
                        <div class="grid-item" onclick="App.makePhoneCall()">
                            <div class="grid-icon"><i class="fas fa-phone-alt"></i></div>
                            <div class="grid-text">紧急联系</div>
                        </div>
                    </div>
                </div>

                <!-- 今日议程 -->
                <div class="card">
                    <div class="card-title">
                        <span>今日议程</span>
                        <span style="color: #667eea; font-size: 14px; cursor: pointer;" onclick="App.navigateTo('agenda')">查看全部 ></span>
                    </div>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">08:30</div>
                                <div class="title">签到入场</div>
                                <div class="location">大厅</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">09:00</div>
                                <div class="title">开幕式</div>
                                <div class="location">主会场</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">10:30</div>
                                <div class="title">主题演讲</div>
                                <div class="location">主会场</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot completed"></div>
                            <div class="timeline-content">
                                <div class="time">12:00</div>
                                <div class="title">午餐</div>
                                <div class="location">餐厅</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 实时数据 -->
                <div class="card">
                    <div class="card-title">实时数据</div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${this.data.stats.attendeeCount}</div>
                            <div class="stat-label">参会人数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.data.stats.checkInCount}</div>
                            <div class="stat-label">已签到</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.data.stats.hotelCount}</div>
                            <div class="stat-label">已入住</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.data.stats.onlineCount}</div>
                            <div class="stat-label">在线人数</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染指挥页面
    renderCommand() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">大会指挥中心</div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-broadcast-tower"></i></div>
                        <div class="list-content">
                            <div class="list-title">紧急广播</div>
                            <div class="list-desc">向所有参会人员发送紧急通知</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-tasks"></i></div>
                        <div class="list-content">
                            <div class="list-title">任务调度</div>
                            <div class="list-desc">分配和跟踪工作人员任务</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="list-content">
                            <div class="list-title">实时数据</div>
                            <div class="list-desc">查看大会实时统计数据</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="list-content">
                            <div class="list-title">异常处理</div>
                            <div class="list-desc">处理突发事件和异常情况</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">快速操作</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button class="btn btn-primary" onclick="alert('发送通知功能')">
                            <i class="fas fa-paper-plane"></i> 发送通知
                        </button>
                        <button class="btn btn-success" onclick="alert('签到统计功能')">
                            <i class="fas fa-clipboard-check"></i> 签到统计
                        </button>
                        <button class="btn btn-warning" onclick="alert('紧急疏散功能')">
                            <i class="fas fa-running"></i> 紧急疏散
                        </button>
                        <button class="btn btn-primary" onclick="alert('人员调度功能')">
                            <i class="fas fa-user-plus"></i> 人员调度
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染交通页面
    renderTraffic() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">交通指引</div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-plane"></i></div>
                        <div class="list-content">
                            <div class="list-title">机场接送</div>
                            <div class="list-desc">浦东机场/虹桥机场接驳车安排</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-subway"></i></div>
                        <div class="list-content">
                            <div class="list-title">地铁线路</div>
                            <div class="list-desc">2号线/4号线/6号线换乘指南</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-bus"></i></div>
                        <div class="list-content">
                            <div class="list-title">班车时刻</div>
                            <div class="list-desc">酒店-会场往返班车时间表</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-parking"></i></div>
                        <div class="list-content">
                            <div class="list-title">停车指引</div>
                            <div class="list-desc">会场周边停车场位置及收费</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">地图导航</div>
                    <div style="height: 200px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                        <i class="fas fa-map" style="font-size: 48px; margin-right: 12px;"></i>
                        <span>地图组件加载中...</span>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染住宿页面
    renderHotel() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">住宿安排</div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-hotel"></i></div>
                        <div class="list-content">
                            <div class="list-title">主会场酒店</div>
                            <div class="list-desc">上海国际会议中心酒店</div>
                        </div>
                        <span class="tag tag-success">推荐</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-bed"></i></div>
                        <div class="list-content">
                            <div class="list-title">备选酒店A</div>
                            <div class="list-desc">距离会场500米，步行5分钟</div>
                        </div>
                        <span class="tag tag-primary">备选</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-bed"></i></div>
                        <div class="list-content">
                            <div class="list-title">备选酒店B</div>
                            <div class="list-desc">距离会场1公里，班车接送</div>
                        </div>
                        <span class="tag tag-primary">备选</span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">我的住宿</div>
                    <div style="text-align: center; padding: 40px 20px;">
                        <i class="fas fa-key" style="font-size: 48px; color: #ddd; margin-bottom: 16px;"></i>
                        <div style="color: #999; font-size: 14px;">您尚未预订住宿</div>
                        <button class="btn btn-primary" style="margin-top: 16px;" onclick="alert('预订功能')">
                            立即预订
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染个人中心
    renderProfile() {
        return `
            <div class="page">
                <div class="card" style="text-align: center; padding: 30px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #fff; font-size: 32px;">
                        <i class="fas fa-user"></i>
                    </div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">参会嘉宾</div>
                    <div style="font-size: 14px; color: #999;">VIP会员</div>
                </div>

                <div class="card">
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-id-card"></i></div>
                        <div class="list-content">
                            <div class="list-title">我的证件</div>
                            <div class="list-desc">查看电子参会证件</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="list-content">
                            <div class="list-title">我的日程</div>
                            <div class="list-desc">已收藏的会议议程</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-hotel"></i></div>
                        <div class="list-content">
                            <div class="list-title">我的住宿</div>
                            <div class="list-desc">酒店预订信息</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-cog"></i></div>
                        <div class="list-content">
                            <div class="list-title">设置</div>
                            <div class="list-desc">账号设置和隐私管理</div>
                        </div>
                        <i class="fas fa-chevron-right list-arrow"></i>
                    </div>
                </div>
            </div>
        `;
    },

    // 绑定首页事件
    bindHomeEvents() {
        // 可以添加首页特定的交互逻辑
    },

    // 页面跳转
    navigateTo(page) {
        alert(`跳转到 ${page} 页面`);
    },

    // 拨打电话
    makePhoneCall() {
        window.location.href = 'tel:400-888-8888';
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
