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
    isManager:-1,
    openid:''
  },

  onChangeTab(event){
    this.setData({ active: event.detail });

  },
  getUserInfo(){
    const openid=this.data.openid
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getUserInfo',
      data: {
        openid:openid,
      },
      success(res) {
          if (res.data.length!=0){
            globalData.userInfo=res.data[0]
          }
      }
    })
  },
  setUserInfo(){
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/setUserInfo',
      data: JSON.stringify(globalData.userInfo),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
          console.log('添加用户信息成功')
      }
    })
  },
  setManager(){
    const openid=this.data.openid
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getManagerID',
      success:res=>{
        const managerID=res.data.result.map(item=>item.openid)
        that.setData({
          isManager:managerID.indexOf(openid)
        })
      },
      fail:res=>{
        console.log("Fail")
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    globalData.userInfo=false
    var that = this
    wx.login({
      success (res) {
        wx.request({
          url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getopenid',
          data: {
            code:res.code,
          },
          success(res) {
            that.setData({
              openid:res.data
            })
            that.getUserInfo()
            that.setManager()
          }
        })
      }
    })
  },
  changePage(event){
    var index = event.currentTarget.dataset.index
    var pageUrl = this.data.pageUrl
    wx.navigateTo({
      url: '/pages/'+pageUrl[index]+'/'+pageUrl[index],
    })
  },
  onClickItem(event){
    const that=this
    if (!globalData.userInfo){
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          const userInfo=res.userInfo
          globalData.userInfo={
             openid:that.data.openid,
             name:userInfo.nickName,
             img:userInfo.avatarUrl
          }
          that.setUserInfo()
          that.changePage(event)
        }
      })
    }else{
        that.changePage(event)
    }
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