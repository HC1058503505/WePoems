

App({
  globalData : {
    navHeight : 0,
    scene:0,
    userID: '',
    pixelRatio: 0,
    screenH:0,
    screenW:0
  },
  onLaunch: function (options) {
    // 小程序启动之后 触发
    // 获取手机系统信息
    var that = this
    wx.getSystemInfo({
      success: res => {
        that.globalData.navHeight = res.statusBarHeight + 46,
        that.globalData.pixelRatio = res.pixelRatio,
        that.globalData.screenH = res.windowHeight,
        that.globalData.screenW = res.windowWidth
      }, fail(err) {
        console.log(err);
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