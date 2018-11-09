// Pages/categorydetail/categorydetail.js
var tagType = ""
const baseUrl = "https://weapp.madliar.com/"
var detailUrl = baseUrl
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemlist: [],
    hide_bottom_line: true 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tagType = wx.getStorageSync("categorysearch")
    let CategorySearchKey = wx.getStorageSync("CategorySearchKey")
    let title = ""
    if (tagType == "tag_poet") {
      detailUrl += ("poem/poet/" + CategorySearchKey + "?page=")
      let authorName = wx.getStorageSync("AuthorName")
      title = "诗人." + authorName
    } else if (tagType == "tag_dynasty") {
      detailUrl += ("poem/dynasty/" + CategorySearchKey + "?page=")
      title = "朝代." + CategorySearchKey
    } else {
      detailUrl += ("poem/tag/" + CategorySearchKey + "?page=")
      title = tagType == "tag" ? ("标签." + CategorySearchKey) : ("诗集." + CategorySearchKey)
    }

    wx.setNavigationBarTitle({
      title: title,
    })
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
    this.requestMe()
      .then(res => {
        that.setData({
          poemlist: res
        })
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
     detailUrl = baseUrl
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

    if (this.data.poemlist.end) {
      this.setData({
        hide_bottom_line : false
      })
      return 
    }
    var that = this
    let temp = this.data.poemlist
    this.requestMe()
      .then(res => {
        temp.poem_list = temp.poem_list.concat(res.poem_list)
        that.setData({
          poemlist: temp
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onItemSelected:function(e){
    let select = e.currentTarget.dataset.index
    wx.setStorage({
      key: 'poetryjson',
      data: select,
    })
    wx.navigateTo({
      url: '../../Pages/poetry/poetry',
    })
  },
  requestMe: function() {
    wx.showNavigationBarLoading()
    return new Promise((reslove, reject) => {
      wx.request({
        url: detailUrl + page,
        data: '',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          page ++
          reslove(res.data.data)
        },
        fail: function (res) { 
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(res)
        },
        complete: function (res) {
          wx.hideNavigationBarLoading()
          // 短暂震动
          wx.vibrateShort()  
        },
      })
    })
  }
})