// pages/prepage/prepage.js
var globalData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    wx.login({
      success (res) {
        if (res.code) {
          console.log('code:'+res.code)
          wx.request({
            url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getOpenid',
            data: {
              code:res.code,
            },
            success(res) {
              // console.log('openid:'+res.data.openid);
              if (res.data.status == 0) {
                console.log('获取失败！！！')
              } else {
                console.log('获取成功！！！')
                globalData.openid = res.data.openid
                that.setData({
                  globalData,
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})