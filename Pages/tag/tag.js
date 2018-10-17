// Pages/tag/tag.js

var tag = ''
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poems_tag : []
  },

  onItemSelected: function(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    console.log(index)
    // wx.setStorageSync("poem", JSON.stringify(this.data.poemlist[index]))  
    wx.setStorageSync("poem", this.data.poems_tag[index])
    wx.navigateTo({
      url: '../../Pages/detail/detail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tag = wx.getStorageSync("tag")
    wx.removeStorageSync("tag")

    wx.setNavigationBarTitle({
      title: '标签.' + tag
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: 'https://houcong.win:18081/poems/tag/' + tag + '/page/0/limit/10',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var dataList = []
        for (let index in res.data) {
          let poem = res.data[index]
          let poem_content_list = poem.poem_content.split("\n")
          let poem_abstract = poem_content_list[0]
          poem["poem_abstract"] = poem_abstract
          poem["poem_tags"] = poem.poem_tags.split('|')
          dataList.push(poem)

        }

        that.setData({
          poems_tag: dataList
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
    wx.showNavigationBarLoading()
    var that = this;
    page = page + 1;

    var dataList = that.data.poems_tag
    wx.request({
      url: 'https://houcong.win:18081/poems/tag/' + tag + '/page/' + page + '/limit/10',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        for (let index in res.data) {
          let poem = res.data[index]
          let poem_content_list = poem.poem_content.split("\n")
          let poem_abstract = poem_content_list[0]
          poem["poem_abstract"] = poem_abstract
          poem["poem_tags"] = poem.poem_tags.split('|')
          dataList.push(poem)
        }
        that.setData({
          poems_tag: dataList
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