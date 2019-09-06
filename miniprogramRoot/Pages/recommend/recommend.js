// Pages/recommend/recommend.js
var app = getApp()
var page = 0
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
    // 分享内容展示
    var poetryjson = options.poetryjson
    var categorysearch = options.categorysearch
    if (poetryjson != undefined && categorysearch != undefined) {
      wx.setStorage({
        key: 'poetryjson',
        data: poetryjson
      })

      wx.setStorage({
        key: 'categorysearch',
        data: categorysearch
      })
      
      wx.navigateTo({
        url: '../../Pages/poetry/poetry',
      })
    }
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
    page = 0
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 0
    var that = this
    this.requestMe()
      .then(res => {
        let temp = that.parseHtml(res)
        that.setData({
          gushiwens: temp
        })
        wx.stopPullDownRefresh()
      })
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
    let postData = {
      "pwd" : "",
      "token" : "gswapi",
      "id" : "",
      "page" : page
    }
    return new Promise((reslove, reject) => {
      wx.request({
        url: app.globalData.baseURL + '/api/Default.aspx',
        data: postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
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
          // 短暂震动
          wx.vibrateShort()
        },
      })
    })
  },
  parseHtml: function (datas) {

    for (var index in datas) {
      let poetry = datas[index]
      let htmlContent = poetry.cont.replace(/\(.*\)/ig, '')
                                   .replace(/（.*）/ig, '')
                                   .replace(/\(.*）/ig, '')
                                   .replace(/（.*\)/ig, '')
                                   .replace(/<br \/>/ig,'<br \/><br \/>')
                                   .replace(/<\/p>/ig,'<br \/><br \/>')
                                   .replace(/<p>/ig,'')


      datas[index].cont = htmlContent
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