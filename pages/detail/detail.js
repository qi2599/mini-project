// pages/detail/detail.js
const { method, url, fail } = getApp().globalData.queryData
const header = wx.getStorageSync("header") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      method,
      header,
      fail,
      url: url + "prod/queryById?id=" + options.id,
      success: (data) => {
        this.setData({
          goods_data: data.data.result
        })
      }
    })
  },
  go_back(){
    wx.navigateBack({
      delta:1
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