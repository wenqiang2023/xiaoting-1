// pages/indexpage/indexpage.js
var globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    activitiesURL:[
      'https://dress-1324460017.cos.ap-shanghai.myqcloud.com/活动/0.jpg/Scale',
      'https://dress-1324460017.cos.ap-shanghai.myqcloud.com/活动/1.jpg/Scale',
    ],
    item_name_Custom:['服装','妆造','内景写真','外景写真'],
    item_name_Manager:['订单管理','财务管理','库存管理','会员管理'],
    pageUrl:['dress','makeup','pic_Indoor','pic_Outdoor','order','finance','inventory','member'],
    isManager:0,
    openid:'1',
    managerID:[],
  },

  onChangeTab(event){
    this.setData({ active: event.detail });

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
            url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getopenid',
            data: {
              code:res.code,
            },
            success(res) {
              // console.log(res.data);
              if (res.data.status == 0) {
                console.log('获取失败！！！')
              } else {
                console.log('获取成功！！！')
                globalData.openid = res.data
                that.setData({
                  openid: res.data,
                  globalData,
                })
              }
              wx.request({
                url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getManagerID',
                success:res=>{
                  console.log(res.data)
                  that.setData({
                    managerID:res.data.result.map(item=>item.openid),
                  })
                  var {isManager,managerID,openid} = that.data
                  isManager = managerID.includes(openid)
                  console.log(managerID,openid)
                  that.setData({
                    isManager:isManager
                  })
                },
                fail:res=>{
                  console.log("Fail")
                  console.log(res)
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getDressData',
      success:res=>{
        console.log(res.data)
        globalData.Data_Dresses = res.data.result
      },
      fail:res=>{
        console.log("Fail")
        console.log(res)
      }
    })
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getDealData',
      success:res=>{
        console.log(res.data)
        globalData.Data_Deals = res.data.result
      },
      fail:res=>{
        console.log("Fail")
        console.log(res)
      }
    })
  },

  onClickItem(event){
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index
    var pageUrl = this.data.pageUrl
    wx.navigateTo({
      url: '/pages/'+pageUrl[index]+'/'+pageUrl[index],
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