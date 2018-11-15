// Pages/tag/tag.js
var tag = ''
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemlist : []
  },

  onItemSelected: function(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    // wx.setStorageSync("poem", JSON.stringify(this.data.poemlist[index]))  
    wx.setStorageSync("poem", this.data.poemlist[index])
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
     tag = ''
     page = 0
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
    var that = this
    var dataList = that.data.poemlist
    utils.requestMe('/poems/tag/' + tag + '/page/' + page + '/limit/10', 'get', 'poems')
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