// pages/index3/index3.js
const { method, url, fail } = getApp().globalData.queryData
const header = wx.getStorageSync("header") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_list:[],
    class_list:[],
    classId:'',
    parent_id:'',
    pageNumber:1,
    val: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAll()
    wx.request({
      method,
      header,
      fail,
      data: {pageSize: 50},
      url: url + "prod/queryClass",
      success: (data) => {
        this.setData({
          class_list: [{ name: "所有商品", id: ""}, ...data.data.result, { name: "——", id: "666" }]
        })
      }
    })
  },
  getAll(){
    wx.showLoading({title: '加载中'})
    wx.pageScrollTo({ scrollTop: 0 })
    this.data.classId = ''
    this.data.pageNumber = 1
    wx.request({
      method,
      header,
      fail,
      url: url + "prod/query",
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 20
      },
      success: (data) => {
        this.setData({
          all_list: data.data.result
        })
        wx.hideLoading()
      },
    })
  },
  toDetail(event){
    let goods_id = event.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + goods_id
    })
  },
  // 获取二级菜单
  getClass2(event){
    wx.showLoading({ title: '加载中' })
    this.data.pageNumber = 1
    this.setData({
      classId: event.currentTarget.dataset.classid,
    })
    let class_list = this.data.class_list
    // 清除二级菜单
    class_list.forEach(item => {
      item.class_list2 = []
    })
    wx.request({
      method,
      header,
      fail,
      data: {
        class_parent_id: event.currentTarget.dataset.classid,
        pageNumber: 1,
        pageSize: 50
      },
      url: url + "prod/queryClass",
      success: (data) => {
        // 二级菜单列表添加到对应的一级菜单中
        let res = data.data.result
        class_list.some(item =>{
          if (!res[0]){
            res = [{ parent_id: this.data.classId}]
          }
          if (item.id == res[0].parent_id){
            item.class_list2 = res
            return true
          }
        })
        if (res[0].parent_id === "0") {
          res[0].parent_id = ''
        }
        this.setData({
          class_list,
          parent_id: res[0].parent_id
        })
        wx.hideLoading()
      } 
    })
    wx.request({
      method,
      header,
      fail,
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 20,
        classId: event.currentTarget.dataset.classid
      },
      url: url + "prod/query",
      success: (data) => {
        this.setData({
          all_list: data.data.result
        })
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        wx.hideLoading()
      }
    })
  },
  // 获取二级分类商品
  setClassId(event){
    wx.showLoading({ title: '加载中' })
    this.setData({
      classId: event.currentTarget.dataset.classid
    })
    wx.request({
      method,
      header,
      fail,
      data: {
        pageNumber: this.data.pageNumber,
        pageSize: 20,
        classId: event.currentTarget.dataset.classid
      },
      url: url + "prod/query",
      success: (data) => {
        this.setData({
          all_list: data.data.result
        })
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        wx.hideLoading()
      }
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
    this.setData({
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
    this.data.pageNumber++
    wx.showLoading({ title: '加载中' })
    wx.request({
      method,
      header,
      fail,
      data: {
        pageNumber: this.data.pageNumber,
        classId: this.data.classId,
        pageSize: 20
      },
      url: url + "prod/query",
      success: (data) => {
        let newData = this.data.all_list.concat(data.data.result)
        this.setData({
          all_list: newData
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})