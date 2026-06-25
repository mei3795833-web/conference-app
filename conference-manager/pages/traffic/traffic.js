Page({
  data: {
    currentLocation: {
      latitude: 31.2304,
      longitude: 121.4737
    },
    transportType: 'public',
    markers: [
      {
        id: 1,
        latitude: 31.2304,
        longitude: 121.4737,
        title: '上海国际会议中心',
        iconPath: '/images/location.png',
        width: 40,
        height: 40
      }
    ],
    polyline: [],
    publicRoutes: [
      {
        id: 1,
        name: '地铁2号线',
        duration: 35,
        stations: '人民广场 → 陆家嘴 → 东昌路',
        price: '¥4',
        tags: ['推荐', '直达']
      },
      {
        id: 2,
        name: '地铁4号线',
        duration: 42,
        stations: '上海火车站 → 世纪大道 → 浦东大道',
        price: '¥5',
        tags: ['换乘1次']
      }
    ],
    taxiEstimate: {
      price: '¥45-65',
      duration: '25分钟'
    },
    parkingList: [
      {
        id: 1,
        name: '会场地下停车场',
        available: 156,
        total: 300,
        status: 'available',
        statusText: '充足',
        price: '¥10/小时',
        distance: 50
      },
      {
        id: 2,
        name: '附近商场停车场',
        available: 23,
        total: 200,
        status: 'limited',
        statusText: '紧张',
        price: '¥8/小时',
        distance: 200
      }
    ],
    shuttleRoutes: [
      {
        id: 1,
        name: '机场专线',
        status: 'running',
        statusText: '运行中',
        stops: ['浦东T1', '浦东T2', '会场'],
        schedule: '每30分钟一班'
      },
      {
        id: 2,
        name: '火车站专线',
        status: 'waiting',
        statusText: '待发',
        stops: ['上海站', '会场'],
        schedule: '整点发车'
      }
    ]
  },

  onLoad() {
    this.getCurrentLocation()
  },

  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  },

  switchTransport(e) {
    this.setData({
      transportType: e.currentTarget.dataset.type
    })
  },

  navigateToConference() {
    wx.openLocation({
      latitude: 31.2304,
      longitude: 121.4737,
      name: '上海国际会议中心',
      address: '上海市浦东新区滨江大道2727号'
    })
  },

  callTaxi() {
    wx.showModal({
      title: '叫车服务',
      content: '将跳转至滴滴出行小程序',
      success: res => {
        if (res.confirm) {
          wx.navigateToMiniProgram({
            appId: 'wxd2c47d71e5f594d0',
            path: 'pages/index/index'
          })
        }
      }
    })
  },

  makePhoneCall(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onMarkerTap(e) {
    const markerId = e.markerId
    wx.showActionSheet({
      itemList: ['查看详情', '导航到这里'],
      success: res => {
        if (res.tapIndex === 1) {
          this.navigateToConference()
        }
      }
    })
  }
})