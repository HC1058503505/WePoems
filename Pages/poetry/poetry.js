// Pages/poetry/poetry.js
let wxparse = require("../../wxParse/wxParse.js");
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetryinfo: [],
    isZhengwen: true,
    isYizhu: false,
    isShangxi: false,
    isAuthor: false,
    scrollTop: -1,
    canvasH: 0,
    isCollection: false,
    openid: "",
    doc_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    this.requestMe()
      .then(res => {
        wxparse.wxParse('poem_content', 'html', res.content, that, 5);
        wxparse.wxParse('poem_fanyi', 'html', res.fanyi, that, 5);
        wxparse.wxParse('poem_shangxi', 'html', res.shangxi, that, 5);
        let titleStr = '古诗文斋'
        if (res.hasOwnProperty('name')) {
          titleStr = res.name
        }
        wx.setNavigationBarTitle({
          title: titleStr
        })
        that.setData({
          poetryinfo: res
        })
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success(result) {
              wx.cloud.callFunction({
                name: 'getUserId',
                complete: res => {
                  that.setData({
                    openid : res.result.openid
                  })
                  that.judgeCollection()
                }
              })
            }
          })
        } else {
          that.setData({
            openid: ""
          })
        }
      }
    })
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
    wx.removeStorageSync("poetryjson")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let poetryjson = wx.getStorageSync("poetryjson")
    return {
      path: "Pages/recommend/recommend?poetryjson=" + poetryjson,
    }
  },
  collectionAction: function(res) {
    if(this.data.isCollection) {
      this.removeCollection()
      return
    }

    let userMsg = res.detail.userInfo
    if (userMsg) {
      if(this.data.openid.length == 0) {
        var that = this
        wx.cloud.callFunction({
          name: 'getUserId',
          complete: res => {
            that.setData({
              openid: res.result.openid
            })
            that.judgeCollection()
          }
        })
      } else {
        // 添加收藏
        this.addCollection()
      }
    }
  },
  poemDetailTabAction: function(event) {
    let targetid = event.currentTarget.id

    if (targetid == 'author') {

      var poetid = ''
      if (this.data.poetryinfo.hasOwnProperty('id')) {
        poetid = this.data.poetryinfo.poet.id
      }
      // wx.setStorageSync("poem", JSON.stringify(this.data.poemlist[index]))  
      wx.setStorageSync("poetjson", "poet_" + poetid + ".json")
      wx.navigateTo({
        url: '../../Pages/poet/poet',
      })
      return
    }

    this.setData({
      scrollTop: 0,
      isZhengwen: targetid == 'zhengwen',
      isYizhu: targetid == 'yizhu',
      isShangxi: targetid == 'shangxi'
    })
  },
  poemTagTapAction: function(e) {
    wx.setStorageSync("CategorySearchKey", e.currentTarget.id)
    wx.setStorageSync("categorysearch", "tag")
    wx.navigateTo({
      url: '../../Pages/categorydetail/categorydetail',
    })
  },
  moreAction: function(e) {

    var that = this;
    wx.showActionSheet({
      itemList: ["复制诗词", "生成图片"],
      itemColor: '#000000',
      success: function(res) {
        if (res.tapIndex == 0) {
          that.copyPoems()
        } else if (res.tapIndex == 1) {

          let canvasMsg = that.canvasWH()
          that.setData({
            previewhidden: true,
            canvasH: canvasMsg.canvasH
          })
          that.generatePic(canvasMsg.line_all_items)
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })
  },
  copyPoems: function() {

    var that = this;
    let copy_content = this.data.poetryinfo.name + '\n\n' +
      this.data.poetryinfo.dynasty + '/' + this.data.poetryinfo.poet.name + '\n\n' + this.poemslices(this.data.poem_content.nodes);
    wx.setClipboardData({
      data: copy_content,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  poemslices: function(nodes) {
    var poem_sententces = ""
    if (nodes.length == 0) {
      return poem_sententces
    }

    for (var index in nodes) {
      let nodeItem = nodes[index]
      if (nodeItem.node == "text") {
        poem_sententces += nodeItem.text
      } else if (nodeItem.node != "text" && nodeItem.hasOwnProperty("nodes")) {
        poem_sententces += this.poemslices(nodeItem.nodes)
      }
      poem_sententces += "\n"
    }
    return poem_sententces
  },
  generatePic: function(items) {

    var that = this;
    let windowW = app.globalData.screenW
    let windowH = app.globalData.screenH
    var scale = windowW / 750
    let poem_title = this.data.poetryinfo.name
    let poem_dynasty = this.data.poetryinfo.dynasty
    let poem_author = this.data.poetryinfo.poet.name
    let poem_content = this.poemslices(this.data.poem_content.nodes);

    const ctx = wx.createCanvasContext('shareImg', this)
    ctx.setFillStyle('rgb(242, 242, 242)')
    ctx.fillRect(0, 0, windowW, this.data.canvasH)
    ctx.setTextAlign('center')


    // poem_title
    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    const poem_title_H = this.canvasDrawText(ctx, poem_title, 50, true)

    // poem_dynasty_author
    ctx.setFontSize(15)
    ctx.setFillStyle('grey')
    const poem_author_H = this.canvasDrawText(ctx, poem_dynasty + '/' + poem_author, poem_title_H, true)

    // poem_content
    ctx.setFontSize(18)
    ctx.setFillStyle('black')
    this.canvasDrawText(ctx, poem_content, poem_author_H, true)

    ctx.draw(true, function() {
      that.drawPicture()
    })
  },
  canvasWH: function() {
    let windowW = app.globalData.screenW
    let windowH = app.globalData.screenH
    let poem_title = this.data.poetryinfo.name
    let poem_dynasty = this.data.poetryinfo.dynasty
    let poem_author = this.data.poetryinfo.poet.name
    let poem_content = this.poemslices(this.data.poem_content.nodes);
    const ctx = wx.createCanvasContext('shareImg', this)


    // poem_title
    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    const poem_title_H = this.canvasDrawText(ctx, poem_title, 50, false)

    // poem_dynasty_author
    ctx.setFontSize(15)
    ctx.setFillStyle('grey')
    const poem_author_H = this.canvasDrawText(ctx, poem_dynasty + '/' + poem_author, poem_title_H, false)

    // poem_content
    ctx.setFontSize(18)
    ctx.setFillStyle('black')
    const poem_content_H = this.canvasDrawText(ctx, poem_content, poem_author_H, false)
    let canvasH = poem_content_H
    let canvasW = windowW

    return {
      'canvasH': canvasH,
      'canvasW': canvasW
    }
  },
  drawPicture: function() {
    var that = this
    let windowW = app.globalData.screenW
    let windowH = app.globalData.screenH

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: that.data.canvasH,
      destHeight: that.data.canvasH * app.globalData.pixelRatio,
      destWidth: windowW * app.globalData.pixelRatio,
      canvasId: 'shareImg',
      quality: 1,
      success: function(res) {
        wx.previewImage({
          urls: [res.tempFilePath],
          success: function() {
            that.setData({
              previewhidden: false
            })
          },
          fail: function(err) {
          }
        })
      }
    }, this)
  },
  canvasDrawText: function(ctx, str, beginY, isFillText) {
    const windowW = app.globalData.screenW
    const windowH = app.globalData.screenH
    const beginX = windowW * 0.5
    const canvasMaxWidth = windowW - 40
    const strList = str.split('\n')
    for (var index in strList) {
      let strItem = strList[index]
      if (ctx.measureText(strItem).width <= canvasMaxWidth) {
        if (isFillText) {
          ctx.fillText(strItem, beginX, beginY, canvasMaxWidth)
        }
        beginY += 30
      } else {
        beginY = this.canvasTextAutoLine(strItem, ctx, beginX, beginY, 30, isFillText)
      }
    }

    return beginY
  },

  canvasTextAutoLine: function(str, ctx, initX, initY, lineHeight, isFillText) {
    var lineWidth = 0;
    var canvasWidth = app.globalData.screenW;
    var lastSubStrIndex = 0;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth - 40) { //减去initX,防止边界出现的问题
        if (isFillText) {
          ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
        }

        initY += lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1 && isFillText) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
      }
    }

    return initY + lineHeight
  },
  requestMe: function() {
    wx.showNavigationBarLoading()
    let poetryjson = wx.getStorageSync("poetryjson")
    return new Promise((reslove, reject) => {
      wx.request({
        url: "https://sweapp.madliar.com/" + poetryjson,
        method: "get",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          reslove(res.data)
          wx.hideNavigationBarLoading()
        },
        fail: function(error) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)
          wx.hideNavigationBarLoading()
        },
        complete: function() {
          // 短暂震动
          wx.vibrateShort()
        }
      })
    })
  },
  judgeCollection: function() {
    var that = this
    let poetryjson = wx.getStorageSync("poetryjson")
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    db.collection("poetry_collections").where({
      _openid: that.data.openid,
      poetry_id: poetryjson
    }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        that.setData({
          isCollection : true,
          doc_id: res.data[0]._id
        })
      },
      fail: function (error) {

      },
      complete: function () {
      }
    })
  },
  parseHtml: function (target) {
    let content = this.data.poetryinfo.content
      .replace(/<p>/ig, '')
      .replace(/\\r/ig, '')
      .replace(/\\n/ig, '')
      .replace(/<\/p>/ig, '\n')
      .replace(/<br \/>/ig, '\n')
      .replace(/\(.*\)/ig, '')
      .replace(/&quot/ig, '＂')
      .replace(/<\/span>/ig, '')
      .replace(/<span.*>/ig, '')
      .replace(/<br>/ig,'\n')
    return content
  },
  addCollection: function () {
    let poetryjson = wx.getStorageSync("poetryjson")
    var that = this
    return new Promise((reslove, reject) => {
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      // collection 方法获取一个集合的引用
      // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
      // get 方法会触发网络请求，往数据库取数据
      // db.collection('poetry_collections').where({

      // }).get({
        // success: function (res) {
        //   // 输出 [{ "title": "The Catcher in the Rye", ... }]
        //   console(res)
        //   reslove(res.data[0])
        // },
        // fail: function (error) {
        //   console.log(error)
        //   reject(error)
        // },
        // complete: function () {
        //   console.log("complete")
        // }
      // })

      db.collection("poetry_collections").add({
        data : {
          poetry_id: poetryjson,
          poetry_name: that.data.poetryinfo.name,
          poetry_dynasty: that.data.poetryinfo.dynasty,
          poetry_content: that.parseHtml(that),
          poetry_author: that.data.poetryinfo.poet.name
        },
        success: function (res) {
          wx.showToast({
            title: '收藏成功',
            duration: 1500,
            mask: true,
            success: function(showOK) {
              that.setData({
                isCollection: true,
                doc_id: res._id
              })
            },
            fail: function(res) {},
            complete: function(showFail) {},
          })
        },
        fail: function(error) {
          wx.showToast({
            title: '收藏失败',
            duration: 1500,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      })
    })
  },
  removeCollection: function(){
    let poetryjson = wx.getStorageSync("poetryjson")
    var that = this
    return new Promise((reslove, reject) => {
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      db.collection("poetry_collections").doc(that.data.doc_id).remove({
        success(res){
          wx.showToast({
            title: '取消收藏',
            duration: 1500,
            mask: true,
            success: function (res) {
              that.setData({
                isCollection: false
              })
            },
          })
        },
        fail(error){
          wx.showToast({
            title: '取消收藏失败',
            duration: 1500,
          })
        }
      })
    })
  }
})