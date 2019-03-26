// Pages/poet/poet.js
//在使用的View中引入WxParse模块
let wxparse = require("../../wxParse/wxParse.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetryinfo:{},
    authorId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'CategorySearchKey',
      success: function(res) {
        that.setData({
          authorId:res.data
        })
      },
    })

    wx.getStorage({
      key: 'AuthorName',
      success: function(res) {
        wx.setNavigationBarTitle({
          title: res.data,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    this.requestAuthorMore()
      .then(res => {
        res.tb_author.pic = "https://img.gushiwen.org" + "/authorImg/" + res.tb_author.pic + ".jpg"
        for(var i in res.tb_gushiwens.gushiwens) {
          let poetry = res.tb_gushiwens.gushiwens[i]
          wxparse.wxParse("poem_content", "html", poetry.cont.replace(/\(.*\)/ig, ''), this, 5)
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

        for(var j in res.tb_ziliaos.ziliaos) {
          let ziliao = res.tb_ziliaos.ziliaos[j]
          wxparse.wxParse('author_ziliao_' + j, 'html', ziliao.cont.replace(/\(.*\)/ig, ''), that, 5)
        }
        that.setData({
          poetryinfo: res
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onItemSelected: function(e) {
    let select = e.currentTarget.dataset.index
    wx.setStorage({
      key: 'poetryjson',
      data: select,
    })
    wx.navigateTo({
      url: '../../Pages/poetry/poetry',
    })
  },
  requestAuthorMore: function () {
    var that = this
    let postData = {
      'token': 'gswapi',
      'id': that.data.authorId
    }
    console.log(postData)
    return new Promise((reslove, reject) => {
      wx.request({
        url: app.globalData.baseURL + '/api/author/author2.aspx',
        method: 'POST',
        data: postData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
          reslove(res.data)
        },
        fail: function (error) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)

        },
        complete: function () {
          wx.hideNavigationBarLoading()
          // 短暂震动
          wx.vibrateShort()
        }
      })
    })
  }
})