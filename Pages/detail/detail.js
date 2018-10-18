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
      imageTempPath: ''
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
          that.generatePic()
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

            that.setData({
              actionSheetHidden: true
            })
          }
        })
      }
    })
  },

  generatePic: function() {

    this.poemPicture()

    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 500,
      height: 700,
      destHeight: 500,
      destWidth: 700,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          previewhidden: true,
          imageTempPath: res.tempFilePath
        })

        wx.setNavigationBarTitle({
          title: ''
        })
      }
    }, this)   
    
  },
  poemPicture: function () {
    const ctx = wx.createCanvasContext('shareImg', this)
    ctx.setFontSize(30)
    ctx.setFillStyle('black')

    ctx.setTextAlign('center')
    ctx.fillText(this.data.poem.poem_title,100,50)
    ctx.fillText(this.data.poem.poem_dynasty + '/' + this.data.poem.poem_author, 100, 100)
    ctx.fillText(this.data.poem.poem_content, 100, 150)
    // ctx.setFillStyle('#484a3d')
    // ctx.fillRect(50,20,100,300)
    ctx.draw()
  },
 
  phoneType:  function () {
    console.log(this.data.systemInfo.platform)
    if (this.data.systemInfo.platform == 'ios') {
      return 2
    } 
    return 2
  }

})