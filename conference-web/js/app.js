// 大会管理系统 - Web版
const App = {
    // 全局数据
    data: {
        userInfo: null,
        userRole: 'attendee',
        currentConference: {
            id: 'conf-2026-001',
            name: '第三届北美广府人联谊恳亲大会',
            location: '洛杉矶 · 圣盖博希尔顿酒店',
            address: 'Hilton San Gabriel, Los Angeles, CA',
            startDate: '2026-10-21',
            endDate: '2026-10-23',
            status: 'upcoming'
        },
        stats: {
            attendeeCount: 856,
            checkInCount: 423,
            hotelCount: 312,
            onlineCount: 156
        }
    },

    // 管理员密码（默认密码，建议部署后修改）
    adminPassword: 'admin123',
    isAdminLoggedIn: false,

    // 多用户配置
    users: {
        'admin123': { role: 'admin', name: '管理员' },
        'staff123': { role: 'staff', name: '工作人员' },
        'view123': { role: 'viewer', name: '查看员' }
    },
    currentUser: null,

    // 初始化
    init() {
        this.loadLocalData();
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
                    this.updateStats();
                    break;
                case 'command':
                    app.innerHTML = this.renderCommand();
                    break;
                case 'traffic':
                    app.innerHTML = this.renderTraffic();
                    break;
                case 'hotel':
                    app.innerHTML = this.renderHotel();
                    this.updateHotelBookingList();
                    break;
                case 'nightTour':
                    app.innerHTML = this.renderNightTour();
                    break;
                case 'dayTour':
                    app.innerHTML = this.renderDayTour();
                    break;
                case 'profile':
                    app.innerHTML = this.renderProfile();
                    break;
                case 'admin':
                    app.innerHTML = this.renderAdmin();
                    break;
                default:
                    app.innerHTML = this.renderHome();
            }
        }, 300);
    },

    // 计算统计数据
    updateStats() {
        const hotelBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        const nightTourSignups = JSON.parse(localStorage.getItem('nightTourSignups') || '[]');
        const dayTourSignups = JSON.parse(localStorage.getItem('dayTourSignups') || '[]');
        
        // 订房人数（只计算选择酒店的，不包括自理）
        const bookingCount = hotelBookings.filter(b => b.hotel === 'main').length;
        
        // 参加人数 = 所有酒店预订 + 所有游览报名
        const attendeeCount = hotelBookings.length + nightTourSignups.length + dayTourSignups.length;
        
        // 更新显示
        const totalAttendeesEl = document.getElementById('totalAttendees');
        const totalBookingsEl = document.getElementById('totalBookings');
        if (totalAttendeesEl) totalAttendeesEl.textContent = attendeeCount;
        if (totalBookingsEl) totalBookingsEl.textContent = bookingCount;
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

                <!-- 报名统计 -->
                <div class="card">
                    <div class="card-title">报名统计</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                        <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: #fff;">
                            <div style="font-size: 28px; font-weight: 600;" id="totalAttendees">0</div>
                            <div style="font-size: 12px; margin-top: 4px;">参加人数</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); border-radius: 8px; color: #fff;">
                            <div style="font-size: 28px; font-weight: 600;" id="totalBookings">0</div>
                            <div style="font-size: 12px; margin-top: 4px;">订房人数</div>
                        </div>
                    </div>
                    <div style="font-size: 13px; color: #999; text-align: center;">
                        参加人数 = 订房 + 自理 + 本地游报名
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
                            <div class="list-title">主会场</div>
                            <div class="list-desc">圣盖博希尔顿</div>
                        </div>
                        <span class="tag tag-success">推荐</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-bed"></i></div>
                        <div class="list-content">
                            <div class="list-title">其他选择</div>
                            <div class="list-desc">自理</div>
                        </div>
                        <span class="tag tag-primary">备选</span>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">酒店预订</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">请填写预订信息，提交后工作人员会联系您确认</div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">参会单位</label>
                        <input type="text" id="hotelCompany" placeholder="请输入参会单位名称" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">姓名</label>
                        <input type="text" id="hotelName" placeholder="请输入姓名" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">手机号</label>
                        <input type="tel" id="hotelPhone" placeholder="请输入手机号" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">选择酒店</label>
                        <select id="hotelSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                            <option value="">请选择</option>
                            <option value="main">主会场 - 圣盖博希尔顿</option>
                            <option value="self">自理</option>
                        </select>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div>
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">入住日期</label>
                            <input type="date" id="hotelCheckIn" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">退房日期</label>
                            <input type="date" id="hotelCheckOut" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">房型选择</label>
                        <select id="hotelRoomType" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                            <option value="">请选择房型</option>
                            <option value="single">单人间</option>
                            <option value="double">双人间</option>
                            <option value="suite">套房</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">备注</label>
                        <textarea id="hotelRemark" placeholder="特殊需求请在此说明" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 80px; resize: vertical;"></textarea>
                    </div>
                    
                    <button class="btn btn-success" style="width: 100%;" onclick="App.submitHotelBooking()">
                        <i class="fas fa-paper-plane"></i> 提交预订
                    </button>
                    <div id="hotelSubmitSuccess" style="color: #27ae60; font-size: 14px; margin-top: 12px; display: none; text-align: center;">
                        <i class="fas fa-check-circle"></i> 提交成功！工作人员会尽快联系您确认
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">我的预订记录</div>
                    <div id="hotelBookingList" style="font-size: 14px; color: #999; text-align: center; padding: 20px;">
                        暂无预订记录
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染夜游页面
    renderNightTour() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">登高观星·打卡好莱坞</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">
                        <i class="fas fa-calendar"></i> 10月21日（周三）晚 20:00-22:30
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 16px; color: #fff; margin-bottom: 16px;">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;"><i class="fas fa-route"></i> 游览路线</div>
                        <div style="font-size: 13px; line-height: 1.8;">
                            <div>1. 格里菲斯天文台 - 免费望远镜、特斯拉线圈、好莱坞标志</div>
                            <div>2. 好莱坞星光大道 - 感受星光璀璨</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;"><i class="fas fa-info-circle"></i> 行程说明</div>
                        <div style="font-size: 13px; color: #666; line-height: 1.6;">
                            <div>• 费用已含在报名费中</div>
                            <div>• 专业中文导游全程陪同</div>
                            <div>• 空调大巴接送</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">夜游报名</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">请填写报名信息</div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">参会单位</label>
                        <input type="text" id="nightTourCompany" placeholder="请输入参会单位名称" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">姓名</label>
                        <input type="text" id="nightTourName" placeholder="请输入姓名" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">手机号</label>
                        <input type="tel" id="nightTourPhone" placeholder="请输入手机号" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">参加人数</label>
                        <input type="number" id="nightTourCount" placeholder="请输入参加人数" min="1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">备注</label>
                        <textarea id="nightTourRemark" placeholder="特殊需求请在此说明" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 80px; resize: vertical;"></textarea>
                    </div>
                    
                    <button class="btn btn-success" style="width: 100%;" onclick="App.submitNightTour()">
                        <i class="fas fa-paper-plane"></i> 提交报名
                    </button>
                    <div id="nightTourSubmitSuccess" style="color: #27ae60; font-size: 14px; margin-top: 12px; display: none; text-align: center;">
                        <i class="fas fa-check-circle"></i> 报名成功！
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染日游页面
    renderDayTour() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">寻根唐人街·帕萨迪纳典雅之旅</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">
                        <i class="fas fa-calendar"></i> 10月22日（周四）白天 09:00-16:00
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; padding: 16px; color: #fff; margin-bottom: 16px;">
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;"><i class="fas fa-route"></i> 游览路线</div>
                        <div style="font-size: 13px; line-height: 1.8;">
                            <div>1. 圣盖博希尔顿酒店集合出发</div>
                            <div>2. 圣塔莫尼卡海滩 - 感受加州阳光</div>
                            <div>3. 比弗利山庄 - 探访明星豪宅区</div>
                            <div>4. 罗迪欧大道 - 顶级购物街</div>
                            <div>5. 盖蒂中心 - 世界级艺术博物馆</div>
                            <div>6. 返回酒店</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px;"><i class="fas fa-info-circle"></i> 行程说明</div>
                        <div style="font-size: 13px; color: #666; line-height: 1.6;">
                            <div>• 费用已含在报名费中</div>
                            <div>• 专业中文导游全程陪同</div>
                            <div>• 空调大巴接送</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">日游报名</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">请填写报名信息</div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">参会单位</label>
                        <input type="text" id="dayTourCompany" placeholder="请输入参会单位名称" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">姓名</label>
                        <input type="text" id="dayTourName" placeholder="请输入姓名" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">手机号</label>
                        <input type="tel" id="dayTourPhone" placeholder="请输入手机号" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">参加人数</label>
                        <input type="number" id="dayTourCount" placeholder="请输入参加人数" min="1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">备注</label>
                        <textarea id="dayTourRemark" placeholder="特殊需求请在此说明" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; height: 80px; resize: vertical;"></textarea>
                    </div>
                    
                    <button class="btn btn-success" style="width: 100%;" onclick="App.submitDayTour()">
                        <i class="fas fa-paper-plane"></i> 提交报名
                    </button>
                    <div id="dayTourSubmitSuccess" style="color: #27ae60; font-size: 14px; margin-top: 12px; display: none; text-align: center;">
                        <i class="fas fa-check-circle"></i> 报名成功！
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
        // 定义页面路由
        const routes = {
            'agenda': this.renderAgenda.bind(this),
            'attendee': this.renderAttendee.bind(this),
            'notice': this.renderNotice.bind(this),
            'admin': this.renderAdmin.bind(this)
        };
        
        if (routes[page]) {
            const app = document.getElementById('app');
            app.innerHTML = routes[page]();
        } else {
            alert(`页面 ${page} 正在开发中`);
        }
    },

    // 渲染会议议程页面
    renderAgenda() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">会议议程</div>
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
                                <div class="title">主题演讲：科技创新</div>
                                <div class="location">主会场</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">12:00</div>
                                <div class="title">午餐</div>
                                <div class="location">餐厅</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">14:00</div>
                                <div class="title">分论坛：人工智能</div>
                                <div class="location">A厅</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="time">16:00</div>
                                <div class="title">圆桌讨论</div>
                                <div class="location">B厅</div>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot completed"></div>
                            <div class="timeline-content">
                                <div class="time">18:00</div>
                                <div class="title">晚宴</div>
                                <div class="location">宴会厅</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.loadPage('home')">返回首页</button>
            </div>
        `;
    },

    // 渲染参会人员页面
    renderAttendee() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">参会人员</div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="list-content">
                            <div class="list-title">张三</div>
                            <div class="list-desc">技术总监 - ABC公司</div>
                        </div>
                        <span class="tag tag-primary">VIP</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="list-content">
                            <div class="list-title">李四</div>
                            <div class="list-desc">产品经理 - XYZ科技</div>
                        </div>
                        <span class="tag tag-success">嘉宾</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="list-content">
                            <div class="list-title">王五</div>
                            <div class="list-desc">工程师 - 123科技</div>
                        </div>
                        <span class="tag tag-primary">参会</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.loadPage('home')">返回首页</button>
            </div>
        `;
    },

    // 渲染通知公告页面
    renderNotice() {
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">通知公告</div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-bullhorn"></i></div>
                        <div class="list-content">
                            <div class="list-title">大会即将开始</div>
                            <div class="list-desc">请各位嘉宾准时入场</div>
                        </div>
                        <span class="tag tag-warning">重要</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-info-circle"></i></div>
                        <div class="list-content">
                            <div class="list-title">WiFi密码更新</div>
                            <div class="list-desc">会场WiFi密码已更新为：Conference2026</div>
                        </div>
                        <span class="tag tag-primary">通知</span>
                    </div>
                    <div class="list-item">
                        <div class="list-icon"><i class="fas fa-utensils"></i></div>
                        <div class="list-content">
                            <div class="list-title">午餐安排</div>
                            <div class="list-desc">午餐时间：12:00-13:30，地点：餐厅</div>
                        </div>
                        <span class="tag tag-success">提醒</span>
                    </div>
                </div>
                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.loadPage('home')">返回首页</button>
            </div>
        `;
    },

    // 渲染管理页面
    renderAdmin() {
        if (!this.currentUser) {
            return this.renderAdminLogin();
        }
        return this.renderAdminPanel();
    },

    // 渲染登录页面
    renderAdminLogin() {
        return `
            <div class="page">
                <div class="card" style="text-align: center; padding: 40px 20px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #fff; font-size: 24px;">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">管理员登录</div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 24px;">请输入管理密码进入后台</div>
                    <input type="password" id="adminPassword" placeholder="请输入密码" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; margin-bottom: 16px; box-sizing: border-box;">
                    <button class="btn btn-primary" style="width: 100%;" onclick="App.adminLogin()">
                        <i class="fas fa-sign-in-alt"></i> 登录
                    </button>
                    <div id="loginError" style="color: #e74c3c; font-size: 14px; margin-top: 12px; display: none;">密码错误，请重试</div>
                </div>
                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.loadPage('home')">返回首页</button>
            </div>
        `;
    },

    // 管理员登录
    adminLogin() {
        const password = document.getElementById('adminPassword').value;
        const user = this.users[password];
        
        if (user) {
            this.currentUser = user;
            this.loadPage('admin');
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    },

    // 检查权限
    hasPermission(permission) {
        if (!this.currentUser) return false;
        const permissions = {
            'admin': ['edit', 'view', 'stats'],
            'staff': ['view', 'stats'],
            'viewer': ['view']
        };
        return permissions[this.currentUser.role]?.includes(permission) || false;
    },

    // 渲染管理面板
    renderAdminPanel() {
        const conf = this.data.currentConference;
        const user = this.currentUser;
        const canEdit = this.hasPermission('edit');
        const canViewStats = this.hasPermission('stats');
        
        return `
            <div class="page">
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-cog"></i> 后台管理
                        <span style="float: right; font-size: 12px; color: #667eea;">${user.name} (${user.role})</span>
                    </div>
                    <div style="font-size: 14px; color: #999; margin-bottom: 16px;">
                        ${canEdit ? '修改大会信息后点击保存即可更新' : '您只有查看权限'}
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">大会名称</label>
                        <input type="text" id="editConfName" value="${conf.name}" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">举办地点</label>
                        <input type="text" id="editConfLocation" value="${conf.location}" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">详细地址</label>
                        <input type="text" id="editConfAddress" value="${conf.address}" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">开始日期</label>
                            <input type="date" id="editConfStartDate" value="${conf.startDate}" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                        </div>
                        <div>
                            <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">结束日期</label>
                            <input type="date" id="editConfEndDate" value="${conf.endDate}" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #666; margin-bottom: 6px;">大会状态</label>
                        <select id="editConfStatus" ${!canEdit ? 'disabled' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; ${!canEdit ? 'background: #f5f5f5;' : ''}">
                            <option value="upcoming" ${conf.status === 'upcoming' ? 'selected' : ''}>即将开始</option>
                            <option value="ongoing" ${conf.status === 'ongoing' ? 'selected' : ''}>进行中</option>
                            <option value="completed" ${conf.status === 'completed' ? 'selected' : ''}>已结束</option>
                        </select>
                    </div>
                    
                    ${canEdit ? `
                    <button class="btn btn-success" style="width: 100%;" onclick="App.saveConferenceData()">
                        <i class="fas fa-save"></i> 保存修改
                    </button>
                    <div id="saveSuccess" style="color: #27ae60; font-size: 14px; margin-top: 12px; display: none; text-align: center;">
                        <i class="fas fa-check-circle"></i> 保存成功！
                    </div>
                    ` : '<div style="color: #999; font-size: 14px; text-align: center; padding: 12px;">您没有编辑权限</div>'}
                </div>

                ${canViewStats ? `
                <div class="card">
                    <div class="card-title">数据统计</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                            <div style="font-size: 24px; font-weight: 600; color: #667eea;">${this.data.stats.attendeeCount}</div>
                            <div style="font-size: 12px; color: #999; margin-top: 4px;">参会人数</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                            <div style="font-size: 24px; font-weight: 600; color: #27ae60;">${this.data.stats.checkInCount}</div>
                            <div style="font-size: 12px; color: #999; margin-top: 4px;">已签到</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.adminLogout()">退出登录</button>
                <button class="btn btn-primary" style="margin: 12px; width: calc(100% - 24px);" onclick="App.loadPage('home')">返回首页</button>
            </div>
        `;
    },

    // 保存大会数据
    saveConferenceData() {
        const name = document.getElementById('editConfName').value;
        const location = document.getElementById('editConfLocation').value;
        const address = document.getElementById('editConfAddress').value;
        const startDate = document.getElementById('editConfStartDate').value;
        const endDate = document.getElementById('editConfEndDate').value;
        const status = document.getElementById('editConfStatus').value;
        
        if (name && location && startDate && endDate) {
            this.data.currentConference = {
                ...this.data.currentConference,
                name,
                location,
                address,
                startDate,
                endDate,
                status
            };
            
            // 保存到本地存储
            localStorage.setItem('conferenceData', JSON.stringify(this.data.currentConference));
            
            document.getElementById('saveSuccess').style.display = 'block';
            setTimeout(() => {
                document.getElementById('saveSuccess').style.display = 'none';
            }, 3000);
        } else {
            alert('请填写完整信息');
        }
    },

    // 管理员退出
    adminLogout() {
        this.currentUser = null;
        this.loadPage('home');
    },

    // 提交酒店预订（简化版 - 无验证）
    submitHotelBooking() {
        const company = document.getElementById('hotelCompany').value.trim();
        const name = document.getElementById('hotelName').value.trim();
        const phone = document.getElementById('hotelPhone').value.trim();
        const hotel = document.getElementById('hotelSelect').value;
        const checkIn = document.getElementById('hotelCheckIn').value;
        const checkOut = document.getElementById('hotelCheckOut').value;
        const roomType = document.getElementById('hotelRoomType').value;
        const remark = document.getElementById('hotelRemark').value.trim();
        
        const booking = {
            id: Date.now().toString(),
            company,
            name,
            phone,
            hotel,
            checkIn,
            checkOut,
            roomType,
            remark,
            status: 'pending',
            submitTime: new Date().toLocaleString('zh-CN')
        };
        
        // 保存到本地存储
        let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        
        // 显示成功提示
        document.getElementById('hotelSubmitSuccess').style.display = 'block';
        
        // 更新预订列表
        this.updateHotelBookingList();
        
        // 清空表单
        document.getElementById('hotelCompany').value = '';
        document.getElementById('hotelName').value = '';
        document.getElementById('hotelPhone').value = '';
        document.getElementById('hotelSelect').value = '';
        document.getElementById('hotelCheckIn').value = '';
        document.getElementById('hotelCheckOut').value = '';
        document.getElementById('hotelRoomType').value = '';
        document.getElementById('hotelRemark').value = '';
        
        setTimeout(() => {
            document.getElementById('hotelSubmitSuccess').style.display = 'none';
        }, 3000);
    },

    // 更新预订列表显示
    updateHotelBookingList() {
        const bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        const listEl = document.getElementById('hotelBookingList');
        
        if (bookings.length === 0) {
            listEl.innerHTML = '<div style="font-size: 14px; color: #999; text-align: center; padding: 20px;">暂无预订记录</div>';
            return;
        }
        
        const hotelNames = {
            'main': '主会场酒店',
            'self': '自理'
        };
        
        const roomTypeNames = {
            'single': '单人间',
            'double': '双人间',
            'suite': '套房'
        };
        
        const statusMap = {
            'pending': { text: '待确认', color: '#f39c12' },
            'confirmed': { text: '已确认', color: '#27ae60' },
            'cancelled': { text: '已取消', color: '#e74c3c' }
        };
        
        listEl.innerHTML = bookings.map(b => {
            const status = statusMap[b.status] || statusMap['pending'];
            return `
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 8px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #333;">${hotelNames[b.hotel] || b.hotel}</span>
                        <span style="font-size: 12px; color: ${status.color}; background: ${status.color}15; padding: 2px 8px; border-radius: 4px;">${status.text}</span>
                    </div>
                    <div style="font-size: 13px; color: #666; line-height: 1.6;">
                        <div>单位：${b.company || '-'}</div>
                        <div>姓名：${b.name}</div>
                        <div>房型：${roomTypeNames[b.roomType] || b.roomType}</div>
                        <div>入住：${b.checkIn} 至 ${b.checkOut}</div>
                        <div>提交时间：${b.submitTime}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // 提交夜游报名
    submitNightTour() {
        const company = document.getElementById('nightTourCompany').value.trim();
        const name = document.getElementById('nightTourName').value.trim();
        const phone = document.getElementById('nightTourPhone').value.trim();
        const count = document.getElementById('nightTourCount').value;
        const remark = document.getElementById('nightTourRemark').value.trim();
        
        const signup = {
            id: Date.now().toString(),
            company,
            name,
            phone,
            count: parseInt(count) || 1,
            remark,
            submitTime: new Date().toLocaleString('zh-CN')
        };
        
        let signups = JSON.parse(localStorage.getItem('nightTourSignups') || '[]');
        signups.push(signup);
        localStorage.setItem('nightTourSignups', JSON.stringify(signups));
        
        document.getElementById('nightTourSubmitSuccess').style.display = 'block';
        
        document.getElementById('nightTourCompany').value = '';
        document.getElementById('nightTourName').value = '';
        document.getElementById('nightTourPhone').value = '';
        document.getElementById('nightTourCount').value = '';
        document.getElementById('nightTourRemark').value = '';
        
        setTimeout(() => {
            document.getElementById('nightTourSubmitSuccess').style.display = 'none';
        }, 3000);
    },

    // 提交日游报名
    submitDayTour() {
        const company = document.getElementById('dayTourCompany').value.trim();
        const name = document.getElementById('dayTourName').value.trim();
        const phone = document.getElementById('dayTourPhone').value.trim();
        const count = document.getElementById('dayTourCount').value;
        const remark = document.getElementById('dayTourRemark').value.trim();
        
        const signup = {
            id: Date.now().toString(),
            company,
            name,
            phone,
            count: parseInt(count) || 1,
            remark,
            submitTime: new Date().toLocaleString('zh-CN')
        };
        
        let signups = JSON.parse(localStorage.getItem('dayTourSignups') || '[]');
        signups.push(signup);
        localStorage.setItem('dayTourSignups', JSON.stringify(signups));
        
        document.getElementById('dayTourSubmitSuccess').style.display = 'block';
        
        document.getElementById('dayTourCompany').value = '';
        document.getElementById('dayTourName').value = '';
        document.getElementById('dayTourPhone').value = '';
        document.getElementById('dayTourCount').value = '';
        document.getElementById('dayTourRemark').value = '';
        
        setTimeout(() => {
            document.getElementById('dayTourSubmitSuccess').style.display = 'none';
        }, 3000);
    },

    // 加载本地数据
    loadLocalData() {
        const saved = localStorage.getItem('conferenceData');
        if (saved) {
            try {
                this.data.currentConference = JSON.parse(saved);
            } catch (e) {
                console.log('本地数据加载失败');
            }
        }
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