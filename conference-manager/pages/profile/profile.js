Page({
  data: {
    userInfo: {},
    roleText: '参会者',
    userStats: {
      meetings: 12,
      tasks: 5,
      messages: 3
    },
    unreadCount: 3
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  userInfo: res.userInfo
                })
              }
            })
          }
        }
      })
    }
  },

  viewAgenda() {
    wx.navigateTo({
      url: '/pages/agenda/agenda'
    })
  },

  viewHotel() {
    wx.navigateTo({
      url: '/pages/hotel/hotel'
    })
  },

  viewTraffic() {
    wx.navigateTo({
      url: '/pages/traffic/traffic'
    })
  },

  viewNotice() {
    wx.navigateTo({
      url: '/pages/notice/notice'
    })
  },

  switchRole() {
    wx.showActionSheet({
      itemList: ['参会者', '工作人员', '管理员', '总指挥'],
      success: res => {
        const roles = ['参会者', '工作人员', '管理员', '总指挥']
        const roleValues = ['attendee', 'staff', 'admin', 'commander']
        this.setData({
          roleText: roles[res.tapIndex]
        })
        getApp().globalData.userRole = roleValues[res.tapIndex]
      }
    })
  },

  setReminder() {
    wx.showToast({
      title: '提醒设置功能开发中',
      icon: 'none'
    })
  },

  viewPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  },

  contactSupport() {
    wx.makePhoneCall({
      phoneNumber: '400-888-8888'
    })
  },

  about() {
    wx.showModal({
      title: '关于大会管理系统',
      content: '版本: v1.0.0\n专为大型会议活动提供一站式管理服务',
      showCancel: false
    })
  },

  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorage()
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})