// Pages/showresult/showresult.js
var page = 0
var searchContent = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult:[]
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
      title: '搜索',
    })
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('poets').where({

    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
      },
      fail: function(error) {
        console.log(error)
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
    if(this.data.searchResult.end) {
      return
    } 

    var that = this
    var tempSearchResult = this.data.searchResult
    that.search(searchContent).then(res => {
      tempSearchResult.poem_list = tempSearchResult.poem_list.concat(res.poem_list)
      that.setData({
        searchResult: tempSearchResult
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindKeyInput: function(e) {
    if (searchContent == e.detail.value) {
      return
    } else {
      searchContent = e.detail.value
      page = 0
    }
    
    var that = this
    that.search(searchContent).then(res => {
      that.setData({
        searchResult: res
      })
    })
  },
  search: function(searchContent){
    wx.showNavigationBarLoading()
    return new Promise((resolve, reject) => {
      wx.request({
        url: "https://weapp.madliar.com/search/?" + "page=" + page + "&q=" + searchContent,
        method: "get",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          let result = res.data.data
          if (result.end == false) {
            page = page + 1
          }
          resolve(res.data.data)
          wx.hideNavigationBarLoading()
        },
        fail: function(error){
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
        }
      })
    })
  },
  onItemSelected: function(e) {
    let select = e.currentTarget.dataset.index
    let selectparams = select.split('_')
    if (selectparams[0] == "poet") {
      wx.setStorage({
        key: 'poetjson',
        data: select,
      })
      wx.navigateTo({
        url: '../../Pages/poet/poet',
      })
    } else if (selectparams[0] == "poetry") {
      wx.setStorage({
        key: 'poetryjson',
        data: select,
      })
      wx.navigateTo({
        url: '../../Pages/poetry/poetry',
      })
    }
  }
})