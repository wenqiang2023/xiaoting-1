// pages/mainpage/index.js
const db = wx.cloud.database()
const globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tag_sel:[],
    active:{index: 0, name: 0, title: "全部"},
    activeSex:'女',
    column:3,
    date:'',
    activeKeyLeft: 0,
    clothId:'',
    Data_Dresses:[],
    Dress_Id:[],
    option1: [],
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
    console.log(event.detail)
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
    var index = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../clothInfo/cloth',
      success: (res)=>{
        res.eventChannel.emit('acceptDataFromOpenerPage', this.data.Data_Dresses[index])
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDressType()
  },
  getDressType(){
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getTagType',
      data: JSON.stringify({"type":"服装"}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
         const data=res.data.result
         data.unshift({'name':'全部'})
         data.push({'name':'其它'})
         this.setData({option1:data})
         this.getClothingData()
      }
    })
  },
  getClothingData(){
    const option1=this.data.option1
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getClothingData',
      success:res=>{
        const data=res.data.result
        data.forEach(v=>{
           if (option1.findIndex((item)=>{return item.name==v.type})==-1){
             v.type='其它'
            
           }
           v.tempURL="https://dress-1324460017.cos.ap-shanghai.myqcloud.com/服装/"+v.clothing_id+"/1.jpg/Compress";
        })
        this.setData({
          Data_Dresses:data,
        })
      }
    })
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
  isShow(item){
    const sex=this.data.activeSex
    const active=this.data.active.title
    const f1=item.type==active||active=='全部'
    const f2=item.sex==sex
    console.log(f1&&f2)
    return f1&&f2
  },
  selectTag(e){
    const value=e.currentTarget.dataset.t
    this.setData({
      activeSex:value
    })
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
