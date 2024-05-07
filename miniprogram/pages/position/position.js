// pages/position/position.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var self=this;
    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        self.setData({
          latitude: '30.291863',
          longitude: '120.12546',
          markers: [{
            id: 1,
            latitude: '30.291863',
            longitude: '120.12546',
            callout:{
              content:"汉小庭",
              bgColor:"#fff",
              fontSize:"15px",
              padding:"2px",
              borderRadius:"5px",
              borderWidth:"1px",
              borderColor:"#07c160",
              display:"ALWAYS"
            }
          },
          ],
        });
      }
    })
  },

  nav: function () {  
    wx.openLocation({
      latitude: 30.291863,
      longitude: 120.12546,
      name: "汉小庭",	//目的地定位名称
      scale: 15,	//缩放比例
      address: "西湖区翠柏路7号 电子商务产业园 2幢3楼318室"	//导航详细地址
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
    this.getTabBar().init();

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