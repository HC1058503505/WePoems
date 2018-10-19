// Pages/detail/detail.js
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
      canvasW:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      poem: wx.getStorageSync("poem")
    })
    wx.setNavigationBarTitle({
       title:this.data.poem.poem_title
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
    let poem_title = this.data.poem.poem_title
    let poem_dynasty = this.data.poem.poem_dynasty
    let poem_author = this.data.poem.poem_author
    let poem_content = this.data.poem.poem_content

    const ctx = wx.createCanvasContext('shareImg', this)
    ctx.setFillStyle('red')
    ctx.fillRect(0,0,windowW, this.data.canvasH)
    // ctx.setTextAlign('center')
    // var count = 0
    // for (let index in items) {
    //   if (count == 0) {
    //     ctx.setFontSize(20)
    //     ctx.setFillStyle('red')
    //   } else if (count == 1) {
    //     ctx.setFontSize(15)
    //     ctx.setFillStyle('green')
    //   } else {
    //     ctx.setFontSize(18)
    //     ctx.setFillStyle('blue')
    //   }
    //   let item = items[index]
    //   if (item.text != undefined) {
    //     count ++
    //     ctx.fillText(item.text, item.linex, item.liney)
    //   }
      
    // }

    // ctx.draw(true, function () {
    //   that.drawPicture()
    // })
    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    ctx.font = "normal bold 20px 'Times New Roman', Times, serif"
    let poem_title_width = ctx.measureText(poem_title)
    let poem_title_x = (windowW - poem_title_width.width) / 2
    console.log(windowW, poem_title_width.width,poem_title_x)
    ctx.fillText(poem_title, poem_title_x,150)

    ctx.setFontSize(15)
    ctx.setFillStyle('grey')
    ctx.font = "normal normals 15px 'Times New Roman', Times, serif"
    let poem_dynasty_author_width = ctx.measureText(poem_dynasty + '/' + poem_author)
    let poem_dynasty_author_x = (windowW - poem_dynasty_author_width.width) / 2
    console.log(windowW, poem_dynasty_author_width.width, poem_dynasty_author_x)
    ctx.fillText(poem_dynasty + '/' + poem_author, poem_dynasty_author_x, 200)

    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    ctx.font = "normal bold 20px 'Times New Roman', Times, serif"
    let poem_content_width = ctx.measureText(poem_content)
    let poem_content_x = (windowW - poem_content_width.width) / 2
    console.log(windowW, poem_content_width.width, poem_content_x)
    ctx.fillText(poem_content, poem_content_x, 250)

    // poem_title
    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    let poem_title_H = this.drawText(ctx, poem_title, 180, 50, 20, windowW - 90)

    // poem_dynasty_author
    ctx.setFontSize(15)
    ctx.setFillStyle('grey')
    let poem_dynasty_author_H = this.drawText(ctx, poem_dynasty + '/' + poem_author, 180, 50 + poem_title_H + 20, 20, windowW - 90)

    // poem_content
    ctx.setFontSize(18)
    ctx.setFillStyle('black')
    let poem_content_H = this.drawText(ctx, poem_content, 180, 50 + poem_title_H + 20 + poem_dynasty_author_H + 20, 20, windowW - 90)
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
    ctx.setFontSize(20)
    ctx.setFillStyle('black')
    let poemt_title_datset = this.drawText(ctx, poem_title, 180, 50, 20, windowW - 90)
    let poem_title_H = poemt_title_datset.contentH
    let poem_title_line_text_items = poemt_title_datset.line_text_items

    // poem_dynasty_author
    ctx.setFontSize(15)
    ctx.setFillStyle('grey')
    let poem_dynasty_author_dataset = this.drawText(ctx, poem_dynasty + '/' + poem_author, 180, 50 + poem_title_H + 20, 20, windowW - 90)
    let poem_dynasty_author_H = poem_dynasty_author_dataset.contentH
    let poem_dynasty_author_line_text_items = poem_dynasty_author_dataset.line_text_items
    // poem_content
    ctx.setFontSize(18)
    ctx.setFillStyle('black')
    let poem_content_dataset = this.drawText(ctx, poem_content, 180, 50 + poem_title_H + 20 + poem_dynasty_author_H + 20, 20, windowW - 90)
    let poem_content_H = poem_content_dataset.contentH
    let poem_content_line_text_items = poem_content_dataset.line_text_items
    let canvasH = 50 + poem_title_H + 20 + poem_dynasty_author_H + 20 + poem_content_H + 20
    let canvasW = windowW
    let temp = poem_title_line_text_items.concat(poem_dynasty_author_line_text_items)
    let all_items = temp.concat(poem_content_line_text_items)
    return {
      'canvasH': canvasH,
      'canvasW': canvasW,
      'line_all_items': all_items
    }
  },
  drawPicture: function () { 
    var that = this
    let windowW = this.data.systemInfo.windowWidth
    let windowH = this.data.systemInfo.windowHeight
    console.log(that.data.canvasH, windowW)
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: that.data.canvasH,
      destHeight: that.data.canvasH,
      destWidth: windowW,
      canvasId: 'shareImg',
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
    


    // ctx.setFontSize(30)
    // ctx.setFillStyle('black')

    // ctx.setTextAlign('center')
    // ctx.fillText(this.data.poem.poem_title,100,50)
    // ctx.fillText(this.data.poem.poem_dynasty + '/' + this.data.poem.poem_author, 100, 100)
    // ctx.fillText(this.data.poem.poem_content, 100, 150)
    // ctx.setFillStyle('#484a3d')
    // ctx.fillRect(50,20,100,300)
  },
  drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
    var line_text_items = []
    for (let i = 0; i < str.length; i++) {
      let line_text = {}
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth || str[i] == '\n') {
        line_text = {
          'text': str.substring(lastSubStrIndex, i),
          'linex' : leftWidth,
          'liney' : initHeight
        }
        // ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
        initHeight += 25; //16为字体的高度                
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分      
        line_text = {
          'text': str.substring(lastSubStrIndex, i + 1),
          'linex': leftWidth,
          'liney': initHeight
        }          
        // ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }

      line_text_items.push(line_text)
    }        // 标题border-bottom 线距顶部距离        
    titleHeight = titleHeight + 10;
    return {
      'contentH' : titleHeight,
      'line_text_items' : line_text_items
    }
  },
  drawTextLast: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
    var line_text_items = []
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth || str[i] == '\n') {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
        initHeight += 25; //16为字体的高度                
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分      
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }

      line_text_items.push(line_text)
    }        // 标题border-bottom 线距顶部距离    
    titleHeight = titleHeight + 10;
    return titleHeight   
  },
  phoneType:  function () {
    console.log(this.data.systemInfo.platform)
    if (this.data.systemInfo.platform == 'ios') {
      return 2
    } 
    return 2
  }

})