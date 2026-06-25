Page({
  data: {
    searchKey: '',
    stats: {
      total: 856,
      checkedIn: 423,
      online: 156
    },
    attendeeList: [
      {
        id: 1,
        name: '张三',
        avatar: '/images/avatar1.png',
        company: '阿里巴巴',
        title: '技术总监',
        status: 'checked',
        statusText: '已签到',
        tags: ['VIP', '演讲嘉宾']
      },
      {
        id: 2,
        name: '李四',
        avatar: '/images/avatar2.png',
        company: '腾讯',
        title: '高级工程师',
        status: 'checked',
        statusText: '已签到',
        tags: ['技术']
      },
      {
        id: 3,
        name: '王五',
        avatar: '/images/avatar3.png',
        company: '字节跳动',
        title: '产品经理',
        status: 'pending',
        statusText: '未签到',
        tags: ['产品']
      }
    ]
  },

  onLoad() {
    this.loadAttendees()
  },

  onSearch(e) {
    const key = e.detail.value
    this.setData({ searchKey: key })
    // 实际应用中这里会调用搜索接口
  },

  loadAttendees() {
    wx.showLoading({ title: '加载中' })
    setTimeout(() => {
      wx.hideLoading()
    }, 500)
  },

  viewAttendeeDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/attendee-detail/attendee-detail?id=${id}`
    })
  }
})
