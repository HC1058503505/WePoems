// Pages/detail/detail.js
const utils = require('../../utils/util.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      poem : {},
      scrollHeight: wx.getSystemInfoSync().windowHeight - 50 - app.globalData.navHeight,
      scrollTop: -1,
      isZhengwen: true,
      isYizhu: false,
      isShangxi: false,
      isAuthor: false,
      previewhidden: false,
      systemInfo: {},
      canvasH:0,
      canvasW:0,
      isCollection:false,
      isFromShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(options.pageid == 10071) {
      console.log('分享',options.poem_id)
      // 根据poem_id请求数据
      utils.requestMe('/poem/id/' + options.poem_id, 'get', 'sharePoem')
        .then(res => {
          console.log(res)
          // that.setData({
          //   poem: res,
          //   isFromShare: true
          // })
        })
    } else {
      this.setData({
        poem: wx.getStorageSync("poem"),
        isFromShare: app.globalData.scene == 1007
      })
    }
    
    var titleStr = ''
    if (this.data.poem.poem_title != undefined) {
      titleStr = this.data.poem.poem_title
    }
    wx.setNavigationBarTitle({
      title: titleStr
    })

    wx.removeStorageSync("poem")   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          systemInfo: res
        })
      }
    });
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
    console.log('shareAction')
    let poem_title = this.data.poem.poem_title
    let poem_dynasty = this.data.poem.poem_dynasty
    let poem_author = this.data.poem.poem_author
    let poem_content = this.data.poem.poem_content
    let poem_id = this.data.poem.poem_id
    console.log('分享：' + poem_id)
    return {
      title: poem_title,
      desc: JSON.stringify(this.data.poem),
      path: '/Pages/home/home?pageid=10071&poem_id=' + poem_id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  homeAction:function(){
    console.log('homeAction')
    wx.redirectTo({
      url: '../../Pages/home/home',
    })
  },
  shareAction:function(){
    this.onShareAppMessage()
  },
  collectionAction:function(){
    this.setData({
      isCollection: !this.data.isCollection
    })
  },
  poemDetailTabAction: function(event) {
    let targetid = event.currentTarget.id

    if (targetid == 'author') {
      var author = this.data.poem.poem_author
      // wx.setStorageSync("poem", JSON.stringify(this.data.poemlist[index]))  
      wx.setStorageSync("author", author)
      wx.navigateTo({
        url: '../../Pages/author/author',
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
    wx.setStorageSync("tag", e.currentTarget.id)
    wx.navigateTo({
      url: '../../Pages/tag/tag',
    })
  },

  copyAction: function(e) {

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

  copyPoems: function() {
    var that = this;
    let copy_content = this.data.poem.poem_title + '\n\n'
      + this.data.poem.poem_dynasty + '/' + this.data.poem.poem_author + '\n\n'
      + this.data.poem.poem_content;
    wx.setClipboardData({
      data: copy_content,
      success: function(res){
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

  generatePic: function(items) {

    var that = this;
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight
    var scale = windowW / 750
    let poem_title = this.data.poem.poem_title
    let poem_dynasty = this.data.poem.poem_dynasty
    let poem_author = this.data.poem.poem_author
    let poem_content = this.data.poem.poem_content

    const ctx = wx.createCanvasContext('shareImg', this)
    ctx.setFillStyle('rgb(242, 242, 242)')
    ctx.fillRect(0,0,windowW, this.data.canvasH)
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
    
    ctx.draw(true,function(){
      that.drawPicture()
    })
  },
  canvasWH: function(){
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight
    let poem_title = this.data.poem.poem_title
    let poem_dynasty = this.data.poem.poem_dynasty
    let poem_author = this.data.poem.poem_author
    let poem_content = this.data.poem.poem_content
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
      quality:1,
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
  canvasDrawText: function(ctx, str, beginY, isFillText) {
    const windowW = this.data.systemInfo.windowWidth
    const windowH = this.data.systemInfo.windowHeight
    const beginX = windowW * 0.5
    const canvasMaxWidth = windowW - 40
    const strList = str.split('\n')
    for(var index in strList) {
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

  canvasTextAutoLine: function (str, ctx, initX, initY, lineHeight,isFillText){
      var lineWidth = 0;
      var canvasWidth = this.data.systemInfo.windowWidth;
      var lastSubStrIndex = 0;
      for(let i = 0;i<str.length;i++){
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth - 40) {//减去initX,防止边界出现的问题
          if(isFillText) {
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
  }

})