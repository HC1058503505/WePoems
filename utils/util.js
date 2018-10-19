const baseUrl = 'https://houcong.win:18081'

function requestMe(path, method, pageType){
  wx.showNavigationBarLoading()
  return new Promise( (resolve, reject) => {
    wx.request({
      url: baseUrl + path,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result
        if (pageType == 'poems') {
          result = poemsType(res.data['data'])
          // 短暂震动
          wx.vibrateShort()
        } else if (pageType == 'author') {
          result = authorType(res.data['data'])
        }

        resolve(result)
        
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        // wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function (error) {
        wx.showToast({
          title: '请求失败',
          duration: 1500
        })
        reject(error)
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        // wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  })
}

function poemsType(dataResult){
  let count = dataResult['count'] 
  let results = dataResult['result']
  
  var dataList = []
  for (var index in results){
    let poem = results[index]
    let poem_content_list = poem.poem_content.split("\n")
    let poem_abstract = poem_content_list[0]
    poem["poem_abstract"] = poem_abstract
    poem["poem_tags"] = poem.poem_tags.split('|')
    dataList.push(poem)
  }

  return {
    'count' : count,
    'results' : dataList
  }
}

function authorType(dataResult){
  let results = dataResult['result']
  let poet_message = results[0]
  let poet_portrait_src = '../../Sources/images/placeholder.jpg'
  if (poet_message.poet_portrait.length > 0) {
    poet_portrait_src = baseUrl + '/pictures/poets/' + poet_message.poet_portrait + '.jpg'
  }
  return {
    'poet_info': poet_message,
    'poet_portrait': poet_portrait_src
  }
}
module.exports.requestMe = requestMe
//备注: 开发者key需要到“实战开发助手”小程序获取，直接配置就可以使用，如果每日次数用完可以申请增加次数