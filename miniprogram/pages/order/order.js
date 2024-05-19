// pages/mainpage/mainpage.js
const db = wx.cloud.database()
const globalData = getApp().globalData
import Dialog from '@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page_show:false,
    bill_type_show:false,
    bill_ts:[
      { text: '定金', value: '定金' },
      { text: '尾款', value: '尾款' },
    ],
    bill_price:'',
    bill_type:'尾款',
    bill_remark:'',
    bill_show:false,
    show:false,
    active: {index: 0, name: 0, title: "待确认"},
    order_list:[],
    order:{
      all_price:0,
      real_price:0,
      list:[],
      remark:'',
      discount_type:'',
      dep_price:0,
      end_price:0,
      prod_num:0,
      user_id:[]
    },
    order_map:{},
    order_type:[{name:'待确认'},{name:'已下定'},{name:'待服务'},{name:'待交付'},{name:'已完成'}]
  },

  onChangeTab(event) {
    this.setData({ active: event.detail });
    this.getOrderList()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
  },
  getOrderList(){
    const that=this
    const progress=that.data.active.title
    const key=progress=='待确认'?'user_id':'order_id'
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/getOrderList',
      data: JSON.stringify({"progress":progress,"orderKey":key}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
         const order_map={}
         const data=res.data.result
         const order_list=[]
         let name=''
         data.forEach(v=>{
           order_map[v.list_id]=v
           v.prod_img="https://dress-1324460017.cos.ap-shanghai.myqcloud.com/"+v.prod_type+"/"+v.prod_id+"/1.jpg/Compress";
           if (v[key]!=name){
              order_list.push({
                order_remark:v.order_remark,real_price:v.real_price,all_price:v.all_price,dep_price:v.dep_price,discount_type:v.discount_type,
                order_id:v.order_id,user_id:v.user_id,user_name:v.user_name,user_img:v.user_img,data:[v]})
              name=v[key]
           }else{
              order_list[order_list.length-1].data.push(v)
           }

         })
         that.setData({
          order_map:order_map,
          order_list:order_list
         })
      }
    })
  },
  setBill(){
    const order_id=this.data.order_id
    const price=this.data.bill_price
    const type=this.data.bill_type
    const remark=this.data.bill_remark
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/setBill',
      data: JSON.stringify({order_id:order_id,price:price,type:type,remark:remark}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.getOrderList()
      }
    })
  },
  checkboxChange(e){
    const data=this.data.order_map
    const values = e.detail.value
    const order={
      all_price:0,
      real_price:0,
      list:values,
      prod_num:values.length,
      remark:'',
      discount_type:'',
      dep_price:0,
      end_price:0,
      user_id:[],
      create_user_id:globalData.userInfo.openid?globalData.userInfo.openid:''
    }

    values.forEach(v=>{
       if(order.user_id.indexOf(data[v].user_id)==-1){
        order.user_id.push(data[v].user_id)
       }
       order.all_price+=data[v].price

    })
    order.real_price=order.all_price
    this.setData({
      order:order
    }
    )
  },
  onSubmit(){
    this.setData({
      show:true
    })
   
  },
  onConfirm(event) {
   
  },

  onComplete(event) {
    
  },
  set_real_price(e){
    this.data.order.real_price=e.detail
  },
  set_dep_price(e){
    this.data.order.dep_price=e.detail
  },
  set_remark(e){
    this.data.order.remark=e.detail
  },
  set_discount_type(e){
    this.data.order.discount_type=e.detail
  },
  setOrderData(){
    const order=this.data.order
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/setOrderData',
      data: JSON.stringify(order),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.setData({
          order:{
            all_price:0,
            real_price:0,
            list:[],
            remark:'',
            discount_type:'',
            dep_price:0,
            end_price:0,
            prod_num:0,
            user_id:[]
          }
        })
        that.getOrderList()
      }
    })
  },
  openBill(e){
    const order_id=e.currentTarget.dataset.oid
    const real_price=e.currentTarget.dataset.rp
     wx.navigateTo({
      url: '../bill/bill?order_id=' + order_id+'&real_price=' + real_price,
    })
  },
  delThis(e){
    const id=e.currentTarget.dataset.id
    const that=this
    Dialog.confirm({
      message: '删除后不可恢复，是否确认删除！',
    })
      .then(() => {
        wx.request({
          url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/delOrderList',
          data: JSON.stringify({"id":id}),
          method:'POST',
          header: {
            'content-type': 'application/json'
          },
          success:res=>{
            that.getOrderList()
          }
        })
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  },
  changeOrderP(e){
    const data=e.currentTarget.dataset
    const that=this
    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/changeOrderP',
      data: JSON.stringify({"progress":data.p,"order_id":data.o}),
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:res=>{
        that.getOrderList()
      }
    })
    

  },
  onClose(){

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getOrderList()
  },

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
