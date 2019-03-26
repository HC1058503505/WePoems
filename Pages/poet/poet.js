// Pages/poet/poet.js
//在使用的View中引入WxParse模块
let wxparse = require("../../wxParse/wxParse.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetryinfo:{},
    authorId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'CategorySearchKey',
      success: function(res) {
        that.setData({
          authorId:res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    this.requestAuthorMore()
      .then(res => {
        wxparse.wxParse('dkcontent', 'html', res.content, that, 5);
        that.setData({
          poetryinfo: res
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
  requestAuthorMore: function () {
    var that = this
    let postData = {
      'token': 'gswapi',
      'id': that.data.authorId
    }
    console.log(postData)
    return new Promise((reslove, reject) => {
      wx.request({
        url: app.globalData.baseURL + '/api/author/author2.aspx',
        method: 'POST',
        data: postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
          res.data.tb_author.pic = "https://img.gushiwen.org" + "/authorImg/" + res.data.tb_author.pic + ".jpg"
          reslove(res.data)
        },
        fail: function (error) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)

        },
        complete: function () {
          wx.hideNavigationBarLoading()
          // 短暂震动
          wx.vibrateShort()
        }
      })
    })
  }
})