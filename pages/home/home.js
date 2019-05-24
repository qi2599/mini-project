// pages/home/home.js
const { method, header, url, fail } = getApp().globalData.queryData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_list:[],
    goods_list:[],
    nav_list:[],
    setSearch:false,
    gotop:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图片
    wx.request({
      method,
      header,
      fail,
      url: url + "other/getHomeRunImgPicList",
      success: (data) => {
        this.setData({
          img_list: data.data.result
        })
      }
    })
    // 获取首页商品
    wx.request({
      method,
      header,
      fail,
      url: url + "prod/getIndexProducts",
      success: (data) => {
        data.data.result.forEach(item =>{
          // 添加懒加载图片
          item.img_show = false
          item.loadIcon = "/images/loadIcon.gif"
        })
        this.setData({
          goods_list: data.data.result
        })
        // 商品载入页面后调用懒加载
        setTimeout(()=>{
          this.showImg()
        },500)
      }
    })
    // 获取导航信息
    wx.request({
      method,
      header,
      fail,
      url: url + "prod/getWapBars",
      success: (data) => {
        this.setData({
          nav_list: data.data.result
        })
      }
    })
    // 获取本地搜索词
    this.setData({
      recent_list: wx.getStorageSync("recent")
    })
    // 如果没有本地搜索词则初始化
    if (!this.data.recent_list) {
      wx.setStorageSync("recent", [])
    }
  },
  // 跳转到详情面
  toDetail(event){
    let goods_id = event.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + goods_id
    })
  },
  // 导航跳转
  toSearch(event){
    let ref_id = event.currentTarget.dataset.item_data.ref_factor_id
    wx.navigateTo({
      url: `/pages/search/search?keyword=${''}&id=${ref_id}`
    })
  },
  // 回到顶部
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  //监听滚动条
  onPageScroll: function (e) {
    // 是否显示回到顶部
    if (e.scrollTop > 800){
      this.setData({
        gotop:true
      })
    }else {
      this.setData({
        gotop: false
      })
    }
    // 是否开启搜索的固定定位
    if (e.scrollTop > 210) {
      this.setData({
        setSearch: true
      })
    } else {
      this.setData({
        setSearch: false
      })
    }
    // const query = wx.createSelectorQuery()
    // query.select('#searchWrap').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(res => {
    //   // res[0].top : #searchWrap 到上边界的距离
    //   // res[1].scrollTop : //滚动条滚动的距离
    // })
  },
  // 设置懒加载
  showImg(){
    let goods_list = this.data.goods_list  // 获取原数据
    goods_list.forEach((item, i) => {
      wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.goods_item-' + i, (ret) => {
        if (ret.intersectionRatio > 0) {
          item.img_show = true
        }
        this.setData({ goods_list})
      })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      method,
      header,
      fail,
      url: url + "prod/getIndexProducts",
      success: (data) => {
        data.data.result.forEach(item => {
          // 添加懒加载图片
          item.img_show = false
          item.loadIcon = "/images/loadIcon.gif"
        })
        this.setData({
          goods_list: data.data.result
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        // 商品载入页面后调用懒加载
        setTimeout(() => {
          this.showImg()
        }, 500)
      }
    })
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