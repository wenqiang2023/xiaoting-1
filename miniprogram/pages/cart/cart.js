// pages/cart/cart.js
const globalData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      this.getOrderList()
  },
  getOrderList(){
    const that=this

    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getOrderListByUser',
      data: JSON.stringify({"user_id":globalData.userInfo.openid}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        const data=res.data.result
        data.forEach(v=>{
          v.prod_img="https://dress-1324460017.cos.ap-shanghai.myqcloud.com/"+v.prod_type+"/"+v.prod_id+"/1.jpg/Compress";
        })
         that.setData({
          order_list:data
         })
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