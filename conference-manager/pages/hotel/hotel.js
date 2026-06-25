Page({
  data: {
    myHotel: {
      name: '上海浦东香格里拉大酒店',
      address: '上海市浦东新区富城路33号',
      image: '/images/hotel1.jpg',
      tags: ['五星级', '含早餐', '免费WiFi'],
      roomType: '豪华大床房',
      roomNumber: '2808',
      checkIn: '2026-07-14',
      checkOut: '2026-07-16'
    },
    priceRanges: ['全部价格', '¥500以下', '¥500-1000', '¥1000-2000', '¥2000以上'],
    selectedPriceRange: '全部价格',
    distanceRanges: ['全部距离', '500米内', '1公里内', '2公里内', '5公里内'],
    selectedDistanceRange: '全部距离',
    hotelList: [
      {
        id: 1,
        name: '上海浦东香格里拉大酒店',
        image: '/images/hotel1.jpg',
        rating: 4.8,
        tags: ['五星级', '江景', '泳池'],
        distance: 500,
        price: 1288,
        roomStatus: 'available',
        roomStatusText: '房间充足'
      },
      {
        id: 2,
        name: '上海东方滨江大酒店',
        image: '/images/hotel2.jpg',
        rating: 4.6,
        tags: ['四星级', '商务', '会议'],
        distance: 200,
        price: 688,
        roomStatus: 'limited',
        roomStatusText: '仅剩5间'
      },
      {
        id: 3,
        name: '上海金茂君悦大酒店',
        image: '/images/hotel3.jpg',
        rating: 4.9,
        tags: ['五星级', '地标', '奢华'],
        distance: 800,
        price: 2188,
        roomStatus: 'available',
        roomStatusText: '房间充足'
      }
    ],
    stats: {
      totalRooms: 1200,
      occupiedRooms: 856,
      availableRooms: 344,
      checkInToday: 128
    },
    notices: [
      { id: 1, content: '入住时间: 14:00后，退房时间: 12:00前' },
      { id: 2, content: '请携带有效身份证件办理入住' },
      { id: 3, content: '早餐时间: 6:30-10:00，地点: 一楼西餐厅' },
      { id: 4, content: '如需延迟退房，请提前联系前台' },
      { id: 5, content: '酒店提供免费接送服务至会场，每小时一班' }
    ]
  },

  onLoad() {
    this.loadHotelData()
  },

  loadHotelData() {
    // 模拟加载数据
    wx.showLoading({ title: '加载中' })
    setTimeout(() => {
      wx.hideLoading()
    }, 500)
  },

  filterByPrice(e) {
    const index = e.detail.value
    this.setData({
      selectedPriceRange: this.data.priceRanges[index]
    })
    // 实际应用中这里会过滤酒店列表
  },

  filterByDistance(e) {
    const index = e.detail.value
    this.setData({
      selectedDistanceRange: this.data.distanceRanges[index]
    })
    // 实际应用中这里会过滤酒店列表
  },

  selectHotel(e) {
    const hotelId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/hotel-detail/hotel-detail?id=${hotelId}`
    })
  },

  viewHotelDetail() {
    wx.navigateTo({
      url: '/pages/hotel-detail/hotel-detail?mode=myHotel'
    })
  },

  navigateToHotel() {
    wx.openLocation({
      latitude: 31.2304,
      longitude: 121.4737,
      name: '上海浦东香格里拉大酒店',
      address: '上海市浦东新区富城路33号'
    })
  }
})