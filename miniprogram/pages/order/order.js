// pages/mainpage/mainpage.js
const db = wx.cloud.database()
const globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    hideChoose: true,
    showMng: "none",
    allChecked: false,
    Data_Deals: [],
    Data_Dresses: [],
    result: [],
  },

  onChangeCell(event) {
    this.setData({
      result: event.detail,
    });
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
      var Data_Deals = this.data.Data_Deals;
      for (var index in Data_Deals) {
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

  onClickButton() {
    var imageIDs = this.data.imageIDs;
    var result = this.data.result;
    var selectedIDs = [];
    for (var index in result) {
      selectedIDs.push(imageIDs[result[index]]);
    }
    this.setData({ selectedIDs: selectedIDs });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var Data_Deals = globalData.Data_Deals
    this.setData({
      Data_Deals:Data_Deals
    })
  },

  onCancel(event) {
    var index = event.currentTarget.dataset["index"];
    console.log(this.data.Data_Deals[index]);
    this.setData({
      ["Data_Deals[" + index + "].Status"]: "已取消",
      ["Data_Deals[" + index + "].tag"]: "danger",
    });

    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/updateDealData',
      data: {
        reserved:false,
        confirmed:true,
        Status:"已取消",
        tag:"danger",
        dealId:this.data.Data_Deals[index].dealId,
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
        }
      }
    });
  },

  onConfirm(event) {
    var index = event.currentTarget.dataset["index"];
    console.log(this.data.Data_Deals[index]);
    this.setData({
      ["Data_Deals[" + index + "].Status"]: "已确认",
      ["Data_Deals[" + index + "].tag"]: "primary",
    });

    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/updateDealData',
      data: {
        reserved:true,
        confirmed:true,
        Status:"已确认",
        tag:"primary",
        dealId:this.data.Data_Deals[index].dealId,
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
        }
      }
    });
  },

  onComplete(event) {
    var index = event.currentTarget.dataset["index"];
    console.log(this.data.Data_Deals[index]);
    this.setData({
      ["Data_Deals[" + index + "].Status"]: "已完成",
      ["Data_Deals[" + index + "].tag"]: "success",
    });

    wx.request({
      url: 'https://service-ocfokc81-1324460017.sh.tencentapigw.com/release/updateDealData',
      data: {
        reserved:false,
        confirmed:true,
        Status:"已完成",
        tag:"success",
        dealId:this.data.Data_Deals[index].dealId,
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
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
