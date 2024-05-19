// pages/bill/bill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    real_price:0,
    bill_price:0,
    end_price:0,
    order_id:'',
    pay_way:'小庭微信',
    type:'尾款',
    bill_list:[],
    ty_option:[
      { text: '定金', value: '定金' },
      { text: '尾款', value: '尾款' },
      { text: '反现', value: '反现' }
    ],
    py_option:[
        { text: '小庭微信', value: '小庭微信' },
        { text: '小景微信', value: '小景微信' },
        { text: '小庭美团', value: '小庭美团' },
        { text: '小景美团', value: '小景美团' },
        { text: '小景公户', value: '小景公户' },
        { text: '小庭公户', value: '小庭公户' },
        { text: '现金', value: '现金' },
        { text: '其它', value: '其它' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    this.setData({
      order_id:option.order_id,
      real_price:Number(option.real_price),
    })
    this.getBill()
  },
  setOrderBill(){
    const data=this.data
    const that=this
    if (data.price==''||data.price==0){
      return 
    }
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/setOrderBill',
      data: JSON.stringify({order_id:data.order_id,price:data.price,type:data.type,pay_way:data.pay_way,remark:data.remark}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.setData({
          price:'',
          remark:''
        })
        that.getBill()
      }
    })
  },
  delOrderBill(e){
    const that=this
    const id=e.currentTarget.dataset.id
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/delOrderBill',
      data: JSON.stringify({"bill_id":id}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.getBill()
      }
    })
  },
  updateRealPrice(){
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/updateRealPrice',
      data: JSON.stringify({"order_id":that.data.order_id,"real_price":that.data.real_price}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.setData(
          {
            end_price:that.data.real_price-that.data.bill_price
          }
        )
      }
    })
  },
  getBill(){
    const that=this
    const order_id=this.data.order_id
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getOrderBill',
      data: JSON.stringify({"order_id":order_id}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        const data=res.data.result
        let bill_price=0
        data.forEach(v=>{
          bill_price+=v.price
        })
        that.setData(
          {
            bill_list:data,
            bill_price:bill_price,
            end_price:that.data.real_price-bill_price
          }
        )
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