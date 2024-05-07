// pages/clothInfo/cloth.js
// import regeneratorRuntime from '../../../async/node_modules/regenerator-runtime/runtime.js';
const globalData = getApp().globalData
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:"",
    imageURLs:[],
    Data_Deals:[],
    show:false,
    showQR:false,
    minDate: new Date().getTime(),
    maxDate: new Date().getTime()+3600000*24*31,
    month:0,
    day:0,
    msg:[],
    star:"star-o",
    formatter(day) {
      if (day.type === 'selected') {
        day.bottomInfo = '预约';
        console.log(day)
      }
      return day;
    },
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = Number(options.clothId)
    var Data_Deals = globalData.Data_Deals.filter(item => item.Dress_id == id)
    console.log(Data_Deals.filter(item => item.Dress_id == id))
    this.setData({
      Data_Deals:Data_Deals,
      formatter:function( day ){
      let week = day.date.getDay()
      var getMonth = day.date.getMonth()+1
      var getDate = day.date.getDate()
      for(let index in Data_Deals)
      {
        if((getMonth == Data_Deals[index].month)&&(getDate == Data_Deals[index].Day)&&(Data_Deals[index].reserved == 'true'))
        {
          day.type = 'disabled'
          day.bottomInfo = '被预约'
        }
      }
      return day;
      }
  })

    this.setData({
      id:Number(options.clothId),  //是String类型
      name:options.clothName,
      num:options.ImgNum
    })    

    var {id,num,imageURLs} = this.data
    for(let index=1; index<(+num+1); index++)
    {
      var tmp = id+1;
      imageURLs.push("https://dress-1324460017.cos.ap-shanghai.myqcloud.com/服装/"+tmp+"/"+index+".jpg")
    }
    this.setData({imageURLs})
  },

  onClickButton(){
    this.setData({
      show:true,
    })
  },
  onCloseCalender(){
    this.setData({
      show:false,
    })
  },
  onClickConfirm(event){
    var that = this;
    //获取选取日期
    this.setData({
      month:event.detail.getMonth()+1,
      day:event.detail.getDate(),
    })
    console.log(event)
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    //上传本次预约至数据库
    var dealId = globalData.Data_Deals.length;
    dealId = dealId + 1;
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/insertDealData',
      data: {
          dealId:dealId,
          // Dress_id:this.data.id,
          Day:this.data.day,
          month:this.data.month,
          reserved:true,
          confirmed:false,
          Dress_id:this.data.id,
          Dress_name:this.data.name,
          Order_date: Y + '年'  + M+ '月' + D+ '日' ,
          Status:"已预约",
          tag:"warning",
          URL:this.data.imageURLs[0],
      },
      success(res) {
        console.log(res.data.result);
        if (res.data.status == 0) {
          wx.showToast({
            title: '提交失败！！！',
            icon: 'loading',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '提交成功！！！', //这里打印出登录成功
            icon: 'success',
            duration: 1000
          })
          globalData.Data_Deals.push({
            dealId:dealId,
            Day:that.data.day,
            month:that.data.month,
            reserved:true,
            confirmed:false,
            Dress_id:that.data.id,
            Dress_name:that.data.name,
            Order_date: Y + '年'  + M+ '月' + D+ '日' ,
            Status:"已预约",
            tag:"warning",
            URL:that.data.imageURLs[0],
          })
          console.log(globalData.Data_Deals)
          that.setData({
            show:false,
            msg:"请添加客服小姐姐微信确认并支付定金~",
            showQR:true,
            globalData:globalData,
        })
        }
      }
    });
  },

  onclose(){
    this.setData({ 
      msg:[],
      showQR: false 
    });
  },

  onclose2(){
    this.setData({ 
      msg2:[],
      showQR2: false 
    });
  },
  onClickIcon(){
    console.log("点击客服")
    this.setData({
      msg2:"请添加客服小姐姐微信进行咨询~",
      showQR2:true,
    })
  },

  onClickIcon2(){
    var star = this.data.star
    if(star == "star-o"){
      this.setData({
        star:"star"
      })
    }
    else{
      this.setData({
        star:"star-o"
      })
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