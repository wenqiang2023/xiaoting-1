// pages/mainpage/index.js
const db = wx.cloud.database()
const globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    column:3,
    date:'',
    activeKeyLeft: 0,
    clothId:'',
    Data_Dresses:[],
    Dress_Id:[],
    option1: [
      { text: '全部', value: 0 },
    ],
    showFilter:false,
    filtMonth:[],
    filtDay:[]
  },

  onTapFilter() {
    console.log("show filter")
    this.setData({
      showFilter: true,
    })
  },

  onCloseFilter(){
    this.setData({
      showFilter: false,
    })
  },

  onTapCalender(){
    this.setData({
      showCalender: true,
    })
  },

  onCloseCalender(){
    this.setData({
      showCalender: false,
    })
  },

  onTapColumn(){
    var column = this.data.column
    if(column == 3)
    {
      this.setData({column:2})
    }
    else{
      this.setData({column:3})
    }
  },

  onConfirmFilter(event) {
    console.log(event.detail[0].getDate())
    const [start, end] = event.detail;
    this.setData({
      showFilter: false,
      filtMonth:[start.getMonth()+1,end.getMonth()+1],
      filtDay:[start.getDate(),end.getDate()],
    });
  },

  onChangeTab(event) {
    this.setData({ active: event.detail});
    console.log(this.data.active)
  },

  onChange1(event){
    this.setData({value1:event.detail})
  },

  onChange2(event){
    this.setData({value2:event.detail})
  },
  
  onChange3(event){
    this.setData({value3:event.detail})
  },

  onTurnPage(event){
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index
    var clothId = this.data.Dress_Id[index];
    var clothName = this.data.Data_Dresses[index].Dress_name
    var ImgNum = this.data.Data_Dresses[index].ImgNum
    // console.log(clothName)
    wx.navigateTo({
      url: '../clothInfo/cloth?clothId='+clothId+'&clothName='+clothName+'&ImgNum='+ImgNum,
      success: function(res){
        // success
        // console.log("跳转成功")
      },
      fail: function(res) {
        // console.log("跳转失败:"+res)
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://service-2n4i3yen-1324460017.sh.tencentapigw.com/test/OperateMySQL',
      success:res=>{
        console.log(res.data)
        this.setData({
          Data_Dresses:res.data,
        })
        this.getTmpURLs()
        globalData.Data_Dresses = res.data
        // console.log(fileID);
        this.setData({ active: 1});
        this.setData({ active: 0});

      },
      fail:res=>{
        console.log("Fail")
        console.log(res)
      }
    })
  },

  getTmpURLs()
  {
    var that = this;
    var Data_Dresses = that.data.Data_Dresses

    var classInfo = Data_Dresses.map(item=>item.Dress_class)  //获取种类
    classInfo = [... new Set(classInfo)]  //去重

    var {option1} = that.data;
    for(let index in classInfo)
    {
        option1.push({text:classInfo[index],value:Number(index)+1})
    }
    that.setData({option1})

    var Dress_Id = Data_Dresses.map(item=>item.Dress_id)  //获取衣服Id
    that.setData({Dress_Id:Dress_Id})

    for (let index in Data_Dresses) {
      // console.log("进入循环")
      var tmp = +index+1;
      Data_Dresses[index]["tempURL"] = "https://dress-1324460017.cos.ap-shanghai.myqcloud.com/服装/"+tmp+"/1.jpg/Compress";
      that.setData({ Data_Dresses });
    }
  },

  onSearch(event)
  {
    let value = event.detail;
    if(value == "111222")
    {
      globalData.user = "manager";
      console.log(event.detail);
      wx.switchTab({
        url: 'managepage',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
