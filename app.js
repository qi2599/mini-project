//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.get_cookie()
  },
  globalData: {
    userInfo: null,
    sh_user: null,
    queryData: {
      method:"POST",
      url: "http://139.159.204.137/wapback/app/",
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '连接失败',
          icon: 'none',
          image: '/icons/fail.png'
        })
      }
    }
  },
  set_user(res){
    this.globalData.sh_user = res
  },
  
  get_cookie(){
    // 获取cookie
    let {method,header,url} = this.globalData.queryData
    wx.request({
      method,
      header,
      url: url + 'other/getHomeRunImgPicList',
      success:(res)=>{
        console.log(res)
        let cookie=res.header['Set-Cookie']
        cookie = cookie.replace('; Path=/wapback', '')
        let header = { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'cookie': cookie }
        wx.setStorageSync('header', header)
      }
    })
  }
})