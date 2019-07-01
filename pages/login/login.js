// pages/login/login.js
const { method, url, fail } = getApp().globalData.queryData
const header = wx.getStorageSync("header") 
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
  // 收集用户名
  get_user_name(event){
    this.setData({
      mobile:event.detail.value
    })
  },
  // 收集密码
  get_psd(event){
    this.setData({
      passwd: event.detail.value
    })
  },
  // 更换验证码
  get_imgcode(){
    let code = url + "other/getImageCode?t=" + new Date().getTime()
    this.setData({
      img_code: code
    })
  },
  // 登录、注册切换
  to_log(){
    this.setData({
      isTem: true
    })
  },
  to_reg() {
    this.setData({
      isTem: false
    })
    let code = url + "other/getImageCode?t=" + new Date().getTime()
    this.setData({
      img_code: code
    })
  },
  // 进行登录
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
        if (data.data.result_code == '00'){
          getApp().set_user(data.data.result)
          wx.showToast({
            title: '登录成功',
          })
          wx.switchTab({
            url: '/pages/vip/vip'
          })
        }else{
          wx.showToast({
            title: data.data.result_desc,
            icon: 'none'
          })
        }
      },
    })
  },
  // 进行注册
  form_sub(ev){
    let val = ev.detail.value
    if(!val.num){
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if(!val.store_name){
      wx.showToast({
        title: '请输入商店名称',
        icon: 'none'
      })
      return
    }
    if(!val.user_name){
      wx.showToast({
        title: '请输入客户名字',
        icon: 'none'
      })
      return
    }
    if(!val.user_add){
      wx.showToast({
        title: '请输入收货地址',
        icon: 'none'
      })
      return
    }
    if(!val.psd || !val.aff_psd){
      wx.showToast({
        title: '请设置密码',
        icon: 'none'
      })
      return
    }
    if(!val.yanzhen){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    if(val.psd !== val.aff_psd){
      wx.showToast({
        title: '输入的密码不一致',
        icon: 'none'
      })
      return
    }
    wx.request({
      method,
      header,
      fail,
      url: url + "other/verifyImageCode",
      data: { 
        authCode: val.yanzhen,
        subType: 'DXM_WAP'
      },
      success(res){
        if(res.success){
          wx.request({
            method,
            header,
            fail,
            url: url + "/app/cust/regist",
            data:{
              mobile: num,
              passwd: psd,
              cust_addr: user_add,
              cust_name: store_name,
              p_name: user_name
            },
            success(res){
              if (res.result_code == '00'){
                wx.showToast({
                  title: '资料提交成功，待审核。',
                  icon: 'none'
                })
                wx.navigateBack({
                  delta:1
                })
              }else{
                wx.showToast({
                  title: res.result_desc,
                  icon: 'none'
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          })
        }
      }
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