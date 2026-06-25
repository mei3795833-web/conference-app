Page({
  data: {
    currentPhase: 'preparation',
    currentPhaseName: '会前准备',
    phaseTime: '距离大会开始还有 2天',
    filterType: 'all',
    tasks: [
      { id: 1, title: '会场布置检查', description: '主会场灯光音响设备最后检查', priority: 'urgent', priorityText: '紧急', status: 'pending', statusText: '待处理', createTime: '10:30' },
      { id: 2, title: '嘉宾接待安排', description: 'VIP嘉宾接机车辆调度', priority: 'high', priorityText: '重要', status: 'pending', statusText: '进行中', createTime: '09:15' },
      { id: 3, title: '资料袋装填', description: '会议资料分装至资料袋', priority: 'normal', priorityText: '普通', status: 'completed', statusText: '已完成', createTime: '08:00' },
      { id: 4, title: '餐饮确认', description: '确认午餐人数及特殊饮食需求', priority: 'normal', priorityText: '普通', status: 'pending', statusText: '待处理', createTime: '11:00' }
    ],
    filteredTasks: [],
    personnelStats: [
      { area: '主会场', count: 45, percentage: 35 },
      { area: '分会场A', count: 28, percentage: 22 },
      { area: '分会场B', count: 22, percentage: 17 },
      { area: '签到处', count: 18, percentage: 14 },
      { area: '餐厅', count: 16, percentage: 12 }
    ],
    messages: [
      { id: 1, name: '张指挥', avatar: '/images/avatar1.png', content: '主会场音响已调试完成', time: '2分钟前' },
      { id: 2, name: '李调度', avatar: '/images/avatar2.png', content: 'VIP嘉宾已到达酒店', time: '5分钟前' },
      { id: 3, name: '王后勤', avatar: '/images/avatar3.png', content: '午餐准备就绪', time: '10分钟前' }
    ]
  },

  onLoad() {
    this.filterTasks({ currentTarget: { dataset: { type: 'all' } } })
  },

  filterTasks(e) {
    const type = e.currentTarget.dataset.type
    const { tasks } = this.data
    let filtered = tasks
    
    if (type !== 'all') {
      filtered = tasks.filter(t => t.priority === type || (type === 'pending' && t.status === 'pending'))
    }
    
    this.setData({
      filterType: type,
      filteredTasks: filtered
    })
  },

  handleTask(e) {
    const id = e.currentTarget.dataset.id
    wx.showActionSheet({
      itemList: ['查看详情', '标记完成', '转交他人', '取消任务'],
      success: res => {
        switch(res.tapIndex) {
          case 0: this.viewTaskDetail(id); break;
          case 1: this.markTaskComplete(id); break;
          case 2: this.transferTask(id); break;
        }
      }
    })
  },

  viewTaskDetail(id) {
    wx.navigateTo({
      url: `/pages/task-detail/task-detail?id=${id}`
    })
  },

  markTaskComplete(id) {
    const tasks = this.data.tasks.map(t => 
      t.id === id ? { ...t, status: 'completed', statusText: '已完成' } : t
    )
    this.setData({ tasks })
    this.filterTasks({ currentTarget: { dataset: { type: this.data.filterType } } })
    wx.showToast({ title: '已标记完成', icon: 'success' })
  },

  transferTask(id) {
    wx.showToast({ title: '转交功能开发中', icon: 'none' })
  },

  sendNotice() {
    wx.navigateTo({
      url: '/pages/notice/notice?type=send'
    })
  },

  emergencyHandle() {
    wx.showModal({
      title: '紧急处理',
      content: '确认发起紧急处理流程？',
      confirmColor: '#ff4d4f',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '已通知相关人员', icon: 'success' })
        }
      }
    })
  },

  personnelDispatch() {
    wx.navigateTo({
      url: '/pages/attendee/attendee?mode=dispatch'
    })
  },

  viewReport() {
    wx.showToast({ title: '报表功能开发中', icon: 'none' })
  }
})