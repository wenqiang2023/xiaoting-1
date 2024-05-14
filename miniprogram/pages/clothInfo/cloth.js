// pages/clothInfo/cloth.js
// import regeneratorRuntime from '../../../async/node_modules/regenerator-runtime/runtime.js';
const globalData = getApp().globalData
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    clothing:{price:''},
    orderList:[],
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
      return day;
    },
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data)=> {
      this.setData({
        clothing:data,
      })
      this.setImgs(data)
      this.getBookingDate(data)
    })
    
 

   
  },
  getBookingDate(data){
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getBookingDate',
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      data: JSON.stringify({
          prod_id:data.clothing_id,
          prod_type:'服装'
      }),
      success(res) { 
        const data=res.data.result
        that.setData({
          formatter:( val )=>{
            const day=val.date
            const Y =day.getFullYear(); 
            const M = (day.getMonth() + 1 < 10 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1);
            const D = day.getDate() < 10 ? '0' + day.getDate() : day.getDate(); 
            const date =Y+'-'+M+'-'+D
            for(let index in data){
              if(date==data[index].booking_date){
                val.type = 'disabled'
                val.bottomInfo = '被预约'
              }
            }
          return val;
          }
      })
      }
    });

  },
  setImgs(data){
    const imgs=[]
    for(let index=1; index<=data.img_num; index++)
    {
      imgs.push("https://dress-1324460017.cos.ap-shanghai.myqcloud.com/服装/"+data.clothing_id+"/"+index+".jpg")
    }
    this.setData({imageURLs:imgs})
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
  onClickConfirm(e){
    
    const that=this
    const date=e.detail
    //获取年份  
    const Y =date.getFullYear();
    //获取月份  
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    const dd=Y+'-'+M+'-'+D
    if (that.data.orderList.indexOf(dd)!=-1){
      wx.showToast({
        title: '已预约！',
        duration: 1500
      })
    }else{
      that.data.orderList.push(dd)
      wx.request({
        url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/insertOrderList',
        method:'POST',
        header: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
            prod_id:this.data.clothing.clothing_id,
            prod_type:'服装',
            prod_name:this.data.clothing.name,
            user_id:globalData.userInfo.openid,
            booking_date:dd,
            price:this.data.clothing.price
        }),
        success(res) {
          if (res.data.code != 200) {
            wx.showToast({
              title: '提交失败！！！',
              icon: 'loading',
              duration: 1500
            })
          } else {
            that.setData({
              show:false,
              msg:"请添加客服小姐姐微信确认并支付定金~",
              showQR:true,
          })
          }
        }
      });
    }
   
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