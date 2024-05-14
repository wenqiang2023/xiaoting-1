// custom-tab-bar/index.js

Component({
  data: {
    selected:0,
    active:0,
    list:[{
        icon:'home-o',
        name:'indexpage',
        url:'/pages/indexpage/indexpage'
      },
      {
        icon:'location-o',
        name:'position',
        url:'/pages/position/position'
      },
      {
        icon:'cart-o',
        name:'cart',
        url:'/pages/cart/cart'
      },
      {
        icon:'user-o',
        name:'user',
        url:'/pages/person/person'
      },
    ] 
  },
  

  methods: {
    onChange(event) {
      this.setData({
        active: event.detail,
      });
      wx.switchTab({
        url: this.data.list[event.detail].url,
      });
      console.log(event.detail)
      console.log("active:"+this.data.active)
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });     

    }
  }
});
