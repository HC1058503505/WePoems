// Pages/showresult/showresult.js
let wxparse = require("../../wxParse/wxParse.js");
let app = getApp()
var page = 1
var searchContent = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult:[],
    isSearch: false,
    hotsearch:[],
    inputValue:"",
    postData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.requestMe()
      .then(res => {
        that.setData({
          hotsearch: res.hotsearch
        })
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
    searchContent = ""
    page = 1
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
    // if(this.data.searchResult.end) {
    //   return
    // } 

    // var that = this
    // var tempSearchResult = this.data.searchResult
    // that.search(searchContent).then(res => {
    //   tempSearchResult.poem_list = tempSearchResult.poem_list.concat(res.poem_list)
    //   that.setData({
    //     searchResult: tempSearchResult
    //   })
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tagTapAction:function(e){
    
    let name = e.currentTarget.dataset.name
    let tagtype = e.currentTarget.dataset.type
    let tagid = e.currentTarget.dataset.id

    if (tagtype == "poet") {
      wx.setStorageSync("AuthorName", name)
      wx.setStorageSync("CategorySearchKey", tagid)
    } else {  
      wx.setStorageSync("CategorySearchKey", name)
    }
    wx.setStorageSync("categorysearch", tagtype)
    // https://weapp.madliar.com/poem/poet/665?page=0
    wx.navigateTo({
      url: '../../Pages/categorydetail/categorydetail',
    })
  },
  bindKeyInput: function(e) {
    searchContent = e.detail.value
    page = 1
    if (searchContent.length == 0) {
      return
    }
    var that = this
    that.search(searchContent).then(res => {
      that.setData({
        searchResult: res,
        isSearch: true
      })
    })
  },
  currentInput:function(e) {
    console.log(e)
    let cursor = e.detail.cursor
    let value = e.detail.value
    if (cursor == 0) {
      searchContent = ""
      page = 1
      // 搜索关键字为空 
      this.setData({
        isSearch: false
      })
    } else {
      var that = this
      setTimeout(function () {
        if (searchContent == e.detail.value) {
          return
        } else {
          searchContent = e.detail.value
          page = 1
          let postDS = {
            token: "gswapi",
            valuekey: searchContent
          }
          that.setData({
            postData: postDS
          })
        }

        that.search(searchContent).then(res => {
          that.setData({
            searchResult: res,
            isSearch: true
          })
        })
      }, 1000)
      
    }

    
  },
  search: function(searchContent){
    wx.showNavigationBarLoading()
    var that = this
    console.log(that.data.postData)
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseURL + "/api/ajaxSearch3.aspx",
        data: that.data.postData,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          resolve(res.data)
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
    let dataSet = e.currentTarget.dataset
    console.log(dataSet)
    let pageRoute = ''
    if (dataSet.type == "poetry") {
      wx.setStorageSync("AuthorName", dataSet.name)
      wx.setStorageSync("CategorySearchKey", dataSet.index)
      wx.setStorageSync("categorysearch", "poet")
      pageRoute = '../../Pages/poet/poet'
    } else if (dataSet.type == "mingju"){
      wx.setStorageSync("poetryjson", dataSet.index)
      pageRoute = '../../Pages/poetry/poetry'
    } else {
      wx.setStorageSync("CategorySearchKey", dataSet.index)
      pageRoute = '../../Pages/poet/poet'
    }

    wx.navigateTo({
      url: pageRoute,
    })

  },
  requestMe: function () {
    wx.showNavigationBarLoading()
    return new Promise((reslove, reject) => {
      var that = this
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      // collection 方法获取一个集合的引用
      // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
      // get 方法会触发网络请求，往数据库取数据
      db.collection('hostsearch').where({

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