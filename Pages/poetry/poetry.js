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
    systemInfo: wx.getSystemInfoSync(),
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
    var that = this
    this.requestMe()
      .then(res => {
        wxparse.wxParse('poem_content', 'html', res.content, that, 5);
        wxparse.wxParse('poem_fanyi', 'html', res.fanyi, that, 5);
        wxparse.wxParse('poem_shangxi', 'html', res.shangxi, that, 5);
        let titleStr = '古诗文斋'
        if(res.hasOwnProperty('name')) {
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
  poemDetailTabAction: function (event) {
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
  poemTagTapAction: function (e) {
    wx.setStorageSync("CategorySearchKey", e.currentTarget.id)
    wx.navigateTo({
      url: '../../Pages/categorydetail/categorydetail',
    })
  },
  copyAction: function (e) {

    var that = this;
    wx.showActionSheet({
      itemList: ["复制诗词", "生成图片"],
      itemColor: '#000000',
      success: function (res) {
        if (res.tapIndex == 0) {
          that.copyPoems()
        } else if (res.tapIndex == 1) {

          let canvasMsg = that.canvasWH()
          that.setData({
            previewhidden: true,
            canvasH: canvasMsg.canvasH
          })
          console.log(canvasMsg)
          that.generatePic(canvasMsg.line_all_items)
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      },
    })
  },
  copyPoems: function () {

    var that = this;
    let copy_content = this.data.poetryinfo.name + '\n\n'
      + this.data.poetryinfo.dynasty + '/' + this.data.poetryinfo.poet.name + '\n\n' + this.poemslices(this.data.poem_content.nodes);
    console.log(copy_content)
    wx.setClipboardData({
      data: copy_content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  poemslices: function(nodes){
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
  generatePic: function (items) {

    var that = this;
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight
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

    ctx.draw(true, function () {
      that.drawPicture()
    })
  },
  canvasWH: function () {
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight
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
  drawPicture: function () {
    var that = this
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: that.data.canvasH,
      destHeight: that.data.canvasH,
      destWidth: windowW,
      canvasId: 'shareImg',
      quality: 1,
      success: function (res) {
        wx.previewImage({
          urls: [res.tempFilePath],
          success: function () {
            console.log('preview success')
            that.setData({
              previewhidden: false
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    }, this)
  },
  canvasDrawText: function (ctx, str, beginY, isFillText) {
    const windowW = this.data.systemInfo.windowWidth
    const windowH = this.data.systemInfo.windowHeight
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

  canvasTextAutoLine: function (str, ctx, initX, initY, lineHeight, isFillText) {
    var lineWidth = 0;
    var canvasWidth = this.data.systemInfo.windowWidth;
    var lastSubStrIndex = 0;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth - 40) {//减去initX,防止边界出现的问题
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
  requestMe: function () {
    wx.showNavigationBarLoading()
    return new Promise((reslove, reject) => {
      let poetryjson = wx.getStorageSync("poetryjson")
      wx.request({
        url: "https://sweapp.madliar.com/" + poetryjson,
        method: "get",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          reslove(res.data)
          wx.hideNavigationBarLoading()
        },
        fail: function (error) {
          wx.showToast({
            title: '请求失败',
            duration: 1500
          })
          reject(error)
          wx.hideNavigationBarLoading()
        },
        complete: function () {
          // 短暂震动
          wx.vibrateShort()
          wx.removeStorageSync("poetryjson")
        }
      })
    })
  }
})