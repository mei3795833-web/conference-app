Page({
  data: {
    noticeList: [
      {
        id: 1,
        title: '大会即将开始',
        summary: '请各位参会者前往主会场就座，开幕式将于5分钟后开始。',
        time: '5分钟前',
        type: 'urgent',
        typeText: '紧急',
        isRead: false
      },
      {
        id: 2,
        title: '午餐安排',
        summary: '午餐时间为12:00-13:30，地点在一楼餐厅。',
        time: '30分钟前',
        type: 'normal',
        typeText: '普通',
        isRead: true
      },
      {
        id: 3,
        title: '系统维护通知',
        summary: '系统将于今晚22:00-23:00进行维护，期间部分功能可能不可用。',
        time: '1小时前',
        type: 'system',
        typeText: '系统',
        isRead: true
      }
    ]
  },

  onLoad() {
    this.loadNotices()
  },

  loadNotices() {
    wx.showLoading({ title: '加载中' })
    setTimeout(() => {
      wx.hideLoading()
    }, 300)
  },

  viewNoticeDetail(e) {
    const id = e.currentTarget.dataset.id
    const noticeList = this.data.noticeList.map(item => {
      if (item.id === id) {
        return { ...item, isRead: true }
      }
      return item
    })
    this.setData({ noticeList })
    
    wx.navigateTo({
      url: `/pages/notice-detail/notice-detail?id=${id}`
    })
  }
})