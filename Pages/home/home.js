// Pages/home/home.js
const utils = require('../../utils/util.js');
var page = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemlist:[]
  },
  onItemSelected : function(e) {
    var index = e.currentTarget.dataset.index
    // wx.setStorageSync("poem", JSON.stringify(this.data.poemlist[index]))  
    wx.setStorageSync("poem", this.data.poemlist[index])
    wx.hideNavigationBarLoading()
    wx.navigateTo({
      url: '../../Pages/detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.pageid == 10071) {
      wx.navigateTo({
        url: '../../Pages/detail/detail?pageid=10071&poem_id=' + options.poem_id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showNavigationBarLoading()
    this.onReachBottom()
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
    // complete
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var dataList = that.data.poemlist
    utils.requestMe('/poems/page/' + page +'/limit/10','get','poems')
          .then(res => {
            that.setData({
              poemlist: dataList.concat(res.results)
            })

            page = page + 1
          })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})