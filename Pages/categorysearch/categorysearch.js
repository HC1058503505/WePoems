// Pages/categorysearch/categorysearch.js
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
    sectionId:""
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
    wx.setNavigationBarTitle({
      title: '查找',
    })

    var that = this

    this.requestMe()
      .then(res => {
        let tagType = wx.getStorageSync("categorysearch")
        that.setData({
          search_conditions: res,
          isAuthor: tagType == "tag_poet",
          isDynasty: tagType == "tag_dynasty",
          isTag: tagType == "tag",
          isPoetry: tagType == "tag_poems"
        })
        wx.removeStorageSync("categorysearch")
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
  onItemSelected: function(e) {
    let authorId = e.currentTarget.dataset.id
    // https://weapp.madliar.com/poem/poet/665?page=0
    
    wx.setStorageSync("CategorySearchAuthorID", authorId)
    wx.navigateTo({
      url: '../../Pages/categorydetail/categorydetail',
    })
  },
  tagTap: function(e) {
    let tagType = e.target.id
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
  },
  requestMe: function() {
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
        }
      })
    })
  }
})