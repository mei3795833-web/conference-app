Page({
  data: {
    selectedDate: 'day1',
    agendaList: [
      { id: 1, startTime: '08:30', endTime: '09:00', title: '签到入场', location: '大厅', speaker: '', tags: ['签到'], status: 'completed', isFavorite: false },
      { id: 2, startTime: '09:00', endTime: '09:30', title: '开幕式', location: '主会场', speaker: '主持人', tags: ['重要'], status: 'ongoing', isFavorite: true },
      { id: 3, startTime: '09:30', endTime: '10:30', title: '主题演讲：AI的未来', location: '主会场', speaker: '张三', tags: ['AI', '热门'], status: 'pending', isFavorite: false },
      { id: 4, startTime: '10:30', endTime: '10:45', title: '茶歇', location: '休息区', speaker: '', tags: ['休息'], status: 'pending', isFavorite: false },
      { id: 5, startTime: '10:45', endTime: '12:00', title: '技术分会场', location: '分会场A', speaker: '李四', tags: ['技术'], status: 'pending', isFavorite: false }
    ]
  },

  onLoad() {
    this.loadAgenda()
  },

  switchDate(e) {
    const date = e.currentTarget.dataset.date
    this.setData({ selectedDate: date })
    this.loadAgenda()
  },

  loadAgenda() {
    // 根据日期加载不同议程
    wx.showLoading({ title: '加载中' })
    setTimeout(() => {
      wx.hideLoading()
    }, 300)
  },

  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id
    const agendaList = this.data.agendaList.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite }
      }
      return item
    })
    this.setData({ agendaList })
    wx.showToast({
      title: agendaList.find(a => a.id === id).isFavorite ? '已收藏' : '取消收藏',
      icon: 'success'
    })
  }
})