// Pages/mycollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    collections: [],
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.cloud.callFunction({
      name: 'getUserId',
      complete: res => {
        that.setData({
          openid: res.result.openid
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    this.requestCollections(0).then(res => {
      that.setData({
        collections: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    this.requestCollections(0).then(res => {
      that.setData({
        collections: res,
        page: 0
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    let curPage = that.data.page + 1
    let collectionList = that.data.collections
    this.requestCollections(curPage).then(res => {
      that.setData({
        collections: collectionList.concat(res),
        page: curPage
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onItemSelected: function(e) {
    let poetry_info_json = e.currentTarget.dataset.index
    if(poetry_info_json){
      wx.setStorageSync("poetryjson", poetry_info_json)
      wx.navigateTo({
        url: '../../Pages/poetry/poetry',
      })
    }
  },
  requestCollections: function(pageFor) {
    wx.showNavigationBarLoading()
    var that = this
    return new Promise((reslove, reject) => {
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      // collection 方法获取一个集合的引用
      // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
      // get 方法会触发网络请求，往数据库取数据
      db.collection('poetry_collections').where({
        _openid: that.data.openid
      }).skip(pageFor * 10).limit(10).get({
        success: function(res) {
          // 输出 [{ "title": "The Catcher in the Rye", ... }]
          reslove(res.data)
        },
        fail: function(error) {
          reject(error)
        },
        complete: function() {
          wx.hideNavigationBarLoading()
          // 短暂震动
          wx.vibrateShort()
        }
      })
    })

  }
})