// Pages/author/author.js
var author_name = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poet_info : {},
    poet_portrait: '../../Sources/images/placeholder.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    author_name = wx.getStorageSync("author")
    wx.removeStorageSync("author") 

    wx.setNavigationBarTitle({
      title: author_name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: 'https://houcong.win:18081/poets/name/' + author_name + '/page/0/limit/1',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let poet_message = res.data[0]
        that.setData({
          poet_info: poet_message,
          poet_portrait: 'https://houcong.win:18081/pictures/poets/' + poet_message.poet_portrait + '.jpg'
        })

        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function (error) {
        wx.showToast({
          title: '请求失败',
          duration: 1500
        })

        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
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