Page({
  data: {},

  agreePrivacy() {
    wx.setStorageSync('privacy_agreed', true)
    getApp().globalData.hasAgreedPrivacy = true
    wx.navigateBack()
  }
})