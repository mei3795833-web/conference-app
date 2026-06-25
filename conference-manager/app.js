App({
  globalData: {
    userInfo: null,
    userRole: 'attendee', // attendee, staff, admin, commander
    hasAgreedPrivacy: false,
    currentConference: {
      id: 'conf-2026-001',
      name: '2026全球科技大会',
      location: '上海国际会议中心',
      startDate: '2026-07-15',
      endDate: '2026-07-16'
    }
  },

  onLaunch() {
    console.log('大会管理系统启动')
    this.checkPrivacyAgreement()
    this.loadUserInfo()
  },

  checkPrivacyAgreement() {
    const agreed = wx.getStorageSync('privacy_agreed')
    if (!agreed) {
      wx.navigateTo({
        url: '/pages/privacy/privacy'
      })
    } else {
      this.globalData.hasAgreedPrivacy = true
    }
  },

  loadUserInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },

  // 全局错误处理
  onError(msg) {
    console.error('应用错误:', msg)
    wx.showToast({
      title: '系统繁忙，请稍后重试',
      icon: 'none'
    })
  },

  // 全局未处理Promise拒绝
  onUnhandledRejection(res) {
    console.error('未处理的Promise拒绝:', res)
  }
})