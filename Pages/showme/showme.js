// Pages/showme/showme.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAbout: false,
    isAbstract: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'MeSelectedIndex',
      success: function(res) {
        let index = res.data
        let title = ""
        if (index == "1") {
          title = "关于"
        } else if (index == "2") {
          title = "功能介绍"
        }

        wx.setNavigationBarTitle({
          title: title,
        })

        that.setData({
          isAbout: index == "1",
          isAbstract: index == "2"
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})