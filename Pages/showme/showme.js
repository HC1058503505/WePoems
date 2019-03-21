// Pages/showme/showme.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAbout: false,
    isAbstract: false,
    update_info:[
      {
        "version_num": "V1.0.0",
        "version_publish": "2018.11.10",
        "version_msgs": ["- 第一个版本，实现基本推荐、搜索古诗功能。"]
      },
      {
        "version_num": "V1.0.9",
        "version_publish": "2018.11.11",
        "version_msgs": ["- 完善搜索以及热搜功能"]
      },
      {
        "version_num": "V1.1.0",
        "version_publish": "2018.11.12",
        "version_msgs": ["- 完善诗词生成图片模糊问题以及其他细节"]
      },
      {
        "version_num": "V1.2.0",
        "version_publish": "2019.3.2",
        "version_msgs": ["- 增加用户登录、分享与收藏功能"]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'MeSelectedIndex',
      success: function(res) {
        let index = res.data
        let title = ""
        if (index == "1") {
          title = "关于"
        } else if (index == "2") {
          title = "功能介绍"
        }

        wx.setNavigationBarTitle({
          title: title,
        })

        that.setData({
          isAbout: index == "1",
          isAbstract: index == "2"
        })
      },
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

  }
})