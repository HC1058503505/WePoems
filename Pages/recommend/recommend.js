// Pages/recommend/recommend.js
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gushiwens:[]
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
        let temp = that.parseHtml(res)
        that.setData({
          gushiwens: temp
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
    var that = this
    var tempGuShiWens = this.data.gushiwens
    this.requestMe()
      .then(res => {
        let temp = that.parseHtml(res)
        tempGuShiWens = tempGuShiWens.concat(temp)
        that.setData({
          gushiwens : tempGuShiWens
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestMe: function(){
    wx.showNavigationBarLoading()
    return new Promise((reslove, reject) => {
      wx.request({
        url: 'https://app.gushiwen.org/api/upTimeTop11.aspx?pwd=&token=gswapi&id=&page=' + page,
        data: '',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          page += 1
          reslove(res.data.gushiwens)
        },
        fail: function (res) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
        },
        complete: function (res) {
          wx.hideNavigationBarLoading()
        },
      })
    })
  },
  parseHtml: function (datas) {

    for (var index in datas) {
      let poetry = datas[index]
      let htmlContent = poetry.cont
                              .replace(/<p>/ig,'')
                              .replace(/\\r/ig,'')
                              .replace(/\\n/ig,'')
                              .replace(/<\/p>/ig,'\n')
                              .replace(/<br \/>/ig,'\n')
                              .replace(/\(.*\)/ig,'')
                              .replace(/&quot/ig,'＂')
      poetry.cont = htmlContent
    }
    return datas
  },
  onItemSelected: function (e) {
    let select = e.currentTarget.dataset.index
    wx.setStorage({
      key: 'poetryjson',
      data: select,
    })
    wx.navigateTo({
      url: '../../Pages/poetry/poetry',
    })
  }
})