// pages/mainpage/mainpage.js
const db = wx.cloud.database()
const globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    hideChoose: true,
    showMng: "none",
    allChecked: false,
    selectedIDs: [],
    result: [],
    Data_Dresses: [],
    rText: "管理",
  },

  onChangeCell(event) {
    this.setData({
      result: event.detail,
    });
    var Data_Dresses = this.data.Data_Dresses;
    var result = this.data.result;
    var selectedIDs = [];
    for (var index in result) {
      selectedIDs.push(Data_Dresses[result[index]].Dress_id);
    }
    this.setData({ selectedIDs: selectedIDs });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
    console.log(event.currentTarget.dataset);
  },

  noop() {},

  onChangeAllChk() {
    var allChecked = this.data.allChecked;
    this.setData({ allChecked: !allChecked });
    if (!allChecked) {
      var tmp = [];
      var Data_Dresses = this.data.Data_Dresses;
      for (var index in Data_Dresses) {
        tmp.push(index);
      }
      this.setData({ result: tmp });
    } else {
      this.setData({ result: [] });
    }
  },

  onChange(event) {
    this.setData({ active: event.detail });
  },

  onClickLeft() {
    wx.navigateTo({
      url: "../add/add",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("acceptDataFromOpenerPage", { data: "test" });
      },
    });
  },

  onClickRight() {
    var hideChoose = this.data.hideChoose;
    this.setData({
      hideChoose: !hideChoose,
    });
    if (hideChoose) {
      this.setData({
        rText: "退出管理",
        showMng: "block",
      });
    } else {
      this.setData({
        rText: "管理",
        showMng: "none",
      });
    }
  },

  async onClickButton() {
    var Info_Id;
    var selectedIDs = this.data.selectedIDs;
    for(var index in selectedIDs)
    {
      Info_Id = selectedIDs[index];
      db.collection("Data_Dresses").doc(Info_Id).remove({
        success(res){
          console.log("删除成功")
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      Data_Dresses:globalData.Data_Dresses
    })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
    if (typeof this.getTabBar === "function") {
      this.getTabBar((tabBar) => {
        tabBar.setData({
          selected: 0,
        });
      });
    }
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
