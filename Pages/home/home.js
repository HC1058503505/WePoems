// Pages/home/home.js
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemlist:[],
    page: 0
  },
  onItemSelected : function(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../Pages/detail/detail?poem_detail=' + JSON.stringify(this.data.poemlist[index]),
    })
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
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: 'http://180.76.181.15:3000/poems/0',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var dataList = []
        for (var item in res.data) {
          var poem = res.data[item]
          var poem_abstract = poem.poem_content.split("\n")[0]
          poem["poem_abstract"] = poem_abstract
          dataList.push(poem)
        }
        
        that.setData({
          poemlist:dataList
        })

        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function(error) {
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
    wx.showNavigationBarLoading()
    var that = this;
    var currentpage = that.data.page + 1;
    var dataList = that.data.poemlist
    wx.request({
      url: 'http://180.76.181.15:3000/poems/' + currentpage,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        for(var i=0; i < res.data.length; i++) {
          var poem = res.data[i]
          var poem_abstract = poem.poem_content.split("\n")[0]
          poem["poem_abstract"] = poem_abstract
          dataList.push(poem)
        }        
        that.setData({
          poemlist: dataList,
          page: currentpage
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})