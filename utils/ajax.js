  //const api = 'http://127.0.0.1:8089/wxShop/';
const api = 'http://180.76.181.15:3000';
// common.js
function request(opt) {
  // set token
  wx.request({
    method: opt.method || 'GET',
    url: api + opt.url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: opt.data,
    success: function (res) {
      console.log(res.data)
      // if (res.data.code == 100) {
      //   if (opt.success) {
      //     opt.success(res.data);
      //   }
      // } else {
      //   console.error(res);
      //   wx.showToast({
      //     title: res.data.message,
      //   })
      // }
    }
  })
}


function requestLoading(url, params, message, success, fail) {
  console.log(params)
  wx.showLoading({
    title: message,
  })
  wx.request({
    url: api + url,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'get',
    success: function (res) {
      //console.log(res.data)
      wx.hideLoading()
      if (res.statusCode == 200) {
        success(res.data)
      } else {
        fail()
      }

    },
    fail: function (res) {
      wx.hideLoading()
      fail()
    },
    complete: function (res) {

    }
  })
}

module.exports.request = request