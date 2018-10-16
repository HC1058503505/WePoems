

App({
  globalData : {
    navHeight : 0
  },
  onLaunch: function () {
    // 小程序启动之后 触发
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
  }
})