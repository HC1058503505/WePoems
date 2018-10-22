// Pages/author/author.js
const util = require('../../utils/util.js')
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
    var that = this;
    util.requestMe('/poets/name/' + author_name + '/page/0/limit/1','get','author')
      .then(res => {
        that.setData({
          poet_info: res.poet_info,
          poet_portrait: res.poet_portrait
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
  protraitTap: function(){
    wx.previewImage({
      urls: [this.data.poet_portrait],
      success: function(){

      },
      fail: function(){
        
      }
    })
  }
})