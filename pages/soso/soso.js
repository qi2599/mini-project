// pages/soso/soso.js
const { method, header, url, fail } = getApp().globalData.queryData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_list:[],
    recent_list:[],
    val: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取热门搜索词
    wx.request({
      method,
      header,
      fail,
      url: url + "busi/log/queryHot",
      data: {
        isEncrypt: 'false',
        pageNumber: '1',
        pageSize: '12',
        subType: 'DXM_WAP',
      },
      success: (data) => {
        this.setData({
          hot_list: data.data.result
        })
      }
    })
  },
  // 跳转：根据 catch_value 和 inp_value 跳转搜索
  toSearch(){
    wx.navigateTo({
      url: `/pages/search/search?keyword=${this.data.inp_value + this.data.catch_value}&id=${''}`
    })
  },
  set_value(event){
    this.data.catch_value = event.currentTarget.dataset.keyword
    this.data.inp_value = ''
    this.toSearch()
  },
  inp_go(event){
    this.setData({
      inp_value: event.detail.value
    })
    this.data.catch_value = ''
    this.toSearch()
    this.addStorage()
  },
  inp_set(event) {
    this.data.catch_value = ''
    this.setData({
      inp_value: event.detail.value
    })
  },
  // 搜索词添加到本地缓存
  addStorage(){
    wx.getStorage({
      key: "recent",
      success: (res) => {
        let arr = res.data
        // 如果之前有相同的值则不再添加
        let is_none = true
        arr.some(item => {
          if (item == this.data.inp_value) {
            is_none = false
            return true
          }
        })
        if (is_none && this.data.inp_value != '') {
          arr = [...arr, this.data.inp_value]
        }
        wx.setStorage({
          key: "recent",
          data: arr
        })
      }
    })
  },
  // 清除本地缓存
  clearStorage(){
    wx.clearStorage()
    this.setData({
      recent_list: []
    })
    wx.setStorageSync("recent", [])
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
    this.setData({
      recent_list: wx.getStorageSync("recent"),
      val: ''
    })

    this.data.inp_value = ''
    this.data.catch_value = ''
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