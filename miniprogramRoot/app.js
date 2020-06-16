

App({
  globalData : {
    navHeight : 0,
    scene:0,
    userID: '',
    pixelRatio: 0,
    screenH:0,
    screenW:0,
    baseURL: "https://app.gushiwen.cn",
    isX: false
  },
  onLaunch: function (options) {
    // 小程序启动之后 触发
    // 获取手机系统信息
    // 发起网络请求
    // let appID = "wxe57c9eee18f3a179"
    // let secretKey = "8f4c45c4e0978226217b843f862b57f2"
    var that = this
    wx.getSystemInfo({
      success: res => {
        that.globalData.navHeight = res.statusBarHeight + 46,
        that.globalData.pixelRatio = res.pixelRatio,
        that.globalData.screenH = res.windowHeight,
        that.globalData.screenW = res.windowWidth
        that.globalData.isX = res.statusBarHeight != 20
      }, fail(err) {
      }
    })
    wx.cloud.init({
      env: {
        database:"wepoems-2f5265"
      },
      traceUser: true
    })
  }

})