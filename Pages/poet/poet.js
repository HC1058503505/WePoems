// Pages/poet/poet.js
//在使用的View中引入WxParse模块
let wxparse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetinfo:[]
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
    var that = this
    this.requestMe()
      .then(res => {
        wxparse.wxParse('dkcontent', 'html', res.content, that, 5);
        that.setData({
          poetinfo: res
        })
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

  },
  requestMe: function() {
    wx.showNavigationBarLoading()
    return new Promise((reslove, reject) => {
      let poetjson = wx.getStorageSync("poetjson")
      wx.request({
        url: "https://sweapp.madliar.com/" + poetjson,
        method: "get",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          reslove(res.data)
          wx.hideNavigationBarLoading()
        },
        fail: function(error) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)
          wx.hideNavigationBarLoading()
        },
        complete: function() {
          wx.removeStorageSync("poetjson")
        }
      })
    })
  }
})