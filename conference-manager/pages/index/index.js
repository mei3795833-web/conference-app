Page({
  data: {
    conferenceInfo: {
      name: '2026年度技术大会',
      date: '2026-07-15',
      location: '上海国际会议中心',
      address: '上海市浦东新区滨江大道2727号',
      status: 'upcoming'
    },
    statusText: '即将开始',
    todayAgenda: [
      { id: 1, time: '08:30', title: '签到入场', location: '大厅', status: 'pending' },
      { id: 2, time: '09:00', title: '开幕式', location: '主会场', status: 'pending' },
      { id: 3, time: '10:30', title: '主题演讲', location: '主会场', status: 'pending' },
      { id: 4, time: '12:00', title: '午餐', location: '餐厅', status: 'pending' }
    ],
    stats: {
      attendeeCount: 856,
      checkInCount: 423,
      hotelCount: 312,
      onlineCount: 156
    }
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    // 模拟数据加载
    wx.showLoading({ title: '加载中' })
    
    setTimeout(() => {
      this.setData({
        stats: {
          attendeeCount: 856,
          checkInCount: 423 + Math.floor(Math.random() * 10),
          hotelCount: 312,
          onlineCount: 156 + Math.floor(Math.random() * 20)
        }
      })
      wx.hideLoading()
    }, 500)
  },

  navigateTo(e) {
    const page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: `/pages/${page}/${page}`
    })
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '400-888-8888'
    })
  }
})