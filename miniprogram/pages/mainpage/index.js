// pages/mainpage/index.js
const db = wx.cloud.database()
const globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activeKeyLeft: 0,
    clothId:'',
    Data_Dresses:[],
    Data_Deals:[],
    Dress_Id:[],
    option1: [
      { text: '朝代/类型', value: 0 },
    ],
    option2: [
      { text: '颜色', value: 0 },
    ],
    option3: [
      { text: '性别', value: 0 },
      { text: '男', value: 1 },
      { text: '女', value: 2 },
    ],
    value1: 0,
    value2: 0,
    value3: 0,
    activeNames: ['1'],
  },

  onChangeFilter() {
    var activeNames = this.data.activeNames;
    console.log(activeNames)
    if(activeNames[0]==1)
    {
      this.setData({
        activeNames: [],
      });  
    }
    else{
      this.setData({
        activeNames: ["1"],
      });  
    }
  },
  
  onChange(event) {
    this.setData({ active: event.detail });
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
      this.getDB();
      wx.request({
        url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getDressData',
        success:res=>{
          console.log(res)
          this.setData({
            Data_Dresses:res.data.result,
          })
          this.getTmpURLs()
          globalData.Data_Dresses = res.data.result
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
        console.log(Data_Dresses);

        var classInfo = Data_Dresses.map(item=>item.Dress_class)  //获取种类
        classInfo = [... new Set(classInfo)]  //去重

        var colorInfo = Data_Dresses.map(item=>item.Dress_color)  //获取颜色
        colorInfo = [... new Set(colorInfo)]  //去重

        var {option1,option2} = that.data;
        for(let index in classInfo)
        {
            option1.push({text:classInfo[index],value:Number(index)+1})
        }
        for(let index in colorInfo)
        {
            option2.push({text:colorInfo[index],value:Number(index)+1})
        }
        that.setData({option1})
        that.setData({option2})
        // // console.log(option2)

        var Dress_Id = Data_Dresses.map(item=>item.Dress_id)  //获取衣服Id
        that.setData({Dress_Id:Dress_Id})
    for (let index in Data_Dresses) {
      // console.log("进入循环")
      var tmp = +index+1;
      Data_Dresses[index]["tempURL"] = "https://dress-1324460017.cos.ap-shanghai.myqcloud.com/服装/"+tmp+"/1.jpg/Compress";
      that.setData({ Data_Dresses });
    }
  },

  async getDB(){
    var that = this;
    var total = await db.collection("Data_Dresses").count()
    total = total.total
    // console.log(total)
    var readTimes = total/20;
    for(let i = 0; i<readTimes;i++){
      console.log(db.collection("Data_Dresses").get())

      db.collection("Data_Dresses").skip(i * 20).limit(20).get({
        success: function(res) {
          that.setData({
            Data_Dresses:that.data.Data_Dresses.concat(res.data)
          },()=>{
            // // console.log(that.data.Data_Dresses);
            if( i == Math.ceil(readTimes)-1)
            {
              // // console.log(i,Math.ceil(readTimes))
              that.data.Data_Dresses.sort((a,b)=>a.Dress_id-b.Dress_id)
              console.log(that.data.Data_Dresses)
              that.getTmpURLs();
            }
          })
           // console.log("调用成功")
        },
        fail() {
          // console.log("调用失败")
        }
      })
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
