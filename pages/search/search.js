// pages/search/search.js
const { method, header, url, fail } = getApp().globalData.queryData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list:[],
    pageNumber:1,
    ref_id:'',
    keyword:'',
    inp_value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.ref_id = options.id
    this.data.keyword = options.keyword
    wx.request({
      method,
      header,
      fail,
      data: {
        ref_factor_id: this.data.ref_id,
        keyword: this.data.keyword,
        pageNumber: 1,
        pageSize: 20,
      },
      url: url + "prod/query",
      success: (data) => {
        this.setData({
          goods_list: data.data.result
        })
        wx.hideLoading()
      }
    })
  },
  toDetail(event) {
    let goods_id = event.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + goods_id
    })
  },
  // 跳转：根据 catch_value 和 inp_value 跳转搜索
  toSearch() {
    wx.navigateTo({
      url: `/pages/search/search?keyword=${this.data.inp_value + this.data.catch_value}&id=${''}`
    })
  },
  set_value(event) {
    this.data.catch_value = event.currentTarget.dataset.keyword
    this.data.inp_value = ''
    this.toSearch()
  },
  inp_go(event) {
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
  addStorage() {
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
    this.setData({
      val: ''
    })
    this.data.inp_value = ''
    this.data.catch_value = ''
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
    this.data.pageNumber++,
    wx.showLoading({ title: '加载中' })
    let getData = {
      method,
      header,
      fail,
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 20,
        ref_factor_id: this.data.ref_id,
        keyword: this.data.keyword
      },
      url: url + "prod/query",
      success: (data) => {
        this.setData({
          goods_list: [...this.data.goods_list, ...data.data.result]
        })
        wx.hideLoading()
      }
    }
    wx.request(getData)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})