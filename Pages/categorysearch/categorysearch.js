// Pages/categorysearch/categorysearch.js
var zimu = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthor: true,
    isDynasty: false,
    isTag: false,
    isPoetry: false,
    search_conditions: [],
    sectionId:"",
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tagType = wx.getStorageSync("categorysearch")
    this.setData({
      isAuthor: tagType == "tag_poet",
      isDynasty: tagType == "tag_dynasty",
      isTag: tagType == "tag",
      isPoetry: tagType == "tag_poems"
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    this.requestMe()
      .then(res => {
        that.setData({
          search_conditions: res,
          isShow : true
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
    zimu = ''
    wx.removeStorage({
      key: 'categorysearch',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'AuthorName',
      success: function(res) {},
    })

    wx.removeStorage({
      key: 'CategorySearchKey',
      success: function(res) {},
    })
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
  onItemSelected: function(e) {
    let dataS = e.currentTarget.dataset
    let authorName = dataS.id

    if (dataS.hasOwnProperty("name")) {
      let authorName = dataS.id
      wx.setStorageSync("AuthorName", authorName)
    }
    
    // https://weapp.madliar.com/poem/poet/665?page=0

    wx.setStorageSync("CategorySearchKey", authorName)
    wx.navigateTo({
      url: '../../Pages/categorydetail/categorydetail',
    })
  },
  tagTap: function(e) {
    let tagType = e.target.id
    wx.setStorageSync("categorysearch", tagType)
    this.setData({
      isAuthor: tagType == "tag_poet",
      isDynasty: tagType == "tag_dynasty",
      isTag: tagType == "tag",
      isPoetry: tagType == "tag_poems"
    })
  },
  zimuTap: function (e) {

    this.setData({
      sectionId: e.currentTarget.dataset.id
    })

    wx.showToast({
      title: e.currentTarget.dataset.id,
      icon: "none",
      duration: 1000
    })
    // 短暂震动
    wx.vibrateShort()
  },
  seachAction: function(){
    wx.navigateTo({
      url: '../../Pages/showresult/showresult',
    })
  },
  requestMe: function() {
    wx.showNavigationBarLoading()
    return new Promise((reslove,reject) => {
      var that = this
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      // collection 方法获取一个集合的引用
      // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
      // get 方法会触发网络请求，往数据库取数据
      db.collection('search_conditions').where({

      }).get({
        success: function (res) {
          // 输出 [{ "title": "The Catcher in the Rye", ... }]
          reslove(res.data[0])
        },
        fail: function (error) {
          reject(error)
        },
        complete: function () {
          wx.hideNavigationBarLoading()
          wx.vibrateShort()
        }
      })
    })
  }
})