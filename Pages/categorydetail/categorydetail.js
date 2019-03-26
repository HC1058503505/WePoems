// Pages/categorydetail/categorydetail.js
let wxparse = require("../../wxParse/wxParse.js");
var tagType = ""
let app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemlist: [],
    hide_bottom_line: true,
    postData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tagType = wx.getStorageSync("categorysearch")
    let CategorySearchKey = wx.getStorageSync("CategorySearchKey")
    let title = ""
    let postDS = {
      token: "gswapi",
      id: "",
      page: page
    }

    if (tagType == "tag_poet" || tagType == "poet") {
      postDS.astr = CategorySearchKey
      let authorName = wx.getStorageSync("AuthorName")
      title = "诗人." + authorName
    } else if (tagType == "tag_dynasty" || tagType == "dynasty") {
      postDS.cstr = CategorySearchKey
      title = "朝代." + CategorySearchKey
    } else {
      postDS.tstr = CategorySearchKey
      title = tagType == "tag" ? ("标签." + CategorySearchKey) : ("诗集." + CategorySearchKey)
    }

    this.setData({
      postData: postDS
    })

    wx.setNavigationBarTitle({
      title: title,
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
          poemlist: res
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
     this.data.postData.page = 1
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.postData.page = 1
    console.log(this.data.postData)
    var that = this
    this.requestMe()
      .then(res => {
        that.setData({
          poemlist: res
        })
        wx.stopPullDownRefresh()
      })
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
        // wxparse.wxParse("poem_content", "html", poetry.cont, this, 5)
        // let poem_content_nodes = this.data.poem_content.nodes
        // if (poem_content_nodes.length == 0) {
        //   return
        // }

        // var poem_content_first_node = poem_content_nodes[0]
        // console.log(poem_content_first_node)
        // while (poem_content_first_node.node != "text") {
        //   poem_content_first_node = poem_content_first_node.nodes[0]
        // }
        // poetry.cont = poem_content_first_node.text
        
        temp = temp.concat(res)
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
  parseHtml: function (datas) {

    for (var index in datas) {
      let poetry = datas[index]
      wxparse.wxParse("poem_content", "html", poetry.cont, this, 5)
      let poem_content_nodes = this.data.poem_content.nodes
      if (poem_content_nodes.length == 0) {
        return
      }

      var poem_content_first_node = poem_content_nodes[0]
      while (poem_content_first_node.node != "text") {
        poem_content_first_node = poem_content_first_node.nodes[0]
      }
      poetry.cont = poem_content_first_node.text
    }

    return datas
  },
  requestMe: function() {
    wx.showNavigationBarLoading()
    var that = this
    return new Promise((reslove, reject) => {
      wx.request({
        url: app.globalData.baseURL + "/api/shiwen/Default.aspx",
        data: that.data.postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.data.postData.page ++;
          let poem_list = that.parseHtml(res.data.gushiwens)
          reslove(poem_list)
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