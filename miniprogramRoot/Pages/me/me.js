// Pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "点击登录",
    avatarUrl: "../../Sources/images/shici.png",
    isAuthor: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success(result) {
              that.setData({
                nickName: result.userInfo.nickName,
                avatarUrl: result.userInfo.avatarUrl,
                isAuthor: true
              })
            }
          })
        } else {
          that.setData({
            nickName: "点击登录",
            avatarUrl: "../../Sources/images/shici.png",
            isAuthor: false
          })
        }
      }
    })
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
    wx.removeStorage({
      key: 'MeSelectedIndex',
      success: function(res) {},
    })
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
  
  },

  login: function(res) {
    let userMsg = res.detail.userInfo

    if (userMsg) {
      this.setData({
        nickName : userMsg.nickName,
        avatarUrl : userMsg.avatarUrl,
        isAuthor : true
      })
    } 
  },
  collectionAction: function(e) {
    if (this.data.isAuthor) {
      wx.navigateTo({
        url: '../../Pages/mycollection/mycollection',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        duration: 1500,
        icon: "none"
      })

    }
  },
  meAction: function(e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync("MeSelectedIndex", index)
    wx.navigateTo({
      url: '../../Pages/showme/showme',
    })
  }
})