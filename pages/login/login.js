// pages/login/login.js
const { method, header, url, fail } = getApp().globalData.queryData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    passwd:'',
    img_code:'',
    isTem: true,
  },
  get_user_name(event){
    this.setData({
      mobile:event.detail.value
    })
  },
  get_psd(event){
    this.setData({
      passwd: event.detail.value
    })
  },
  to_log(){
    this.setData({
      isTem: true
    })
  },
  to_reg() {
    this.setData({
      isTem: false
    })
    wx.request({
      method: 'GET',
      header,
      fail,
      url: url + "other/getImageCode",
      success: (data) => {
        this.setData({
          // img_code: data.data.result
        })
      }
    })
  },
  to_login(){
    if (!this.data.mobile || !this.data.passwd){
      wx.showToast({
        title: '账号和密码不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({ title: '正在登录' })
    wx.request({
      method,
      header,
      fail,
      url: url + "cust/login",
      data: {
        type:'1',
        mobile: this.data.mobile,
        passwd: this.data.passwd,
        subType: 'DXM_WAP'
      },
      success: (data) => {
        wx.hideLoading()
        if (data.data.result_code !== '00'){
          wx.showToast({
            title: data.data.result_desc,
            icon: 'none'
          })
        }else{
          getApp().set_user(data.data.result)
          wx.showToast({
            title: '登录成功',
          })
          wx.switchTab({
            url: '/pages/vip/vip'
          })
        }
      },
    })
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