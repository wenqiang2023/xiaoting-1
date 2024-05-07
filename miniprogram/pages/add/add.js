// pages/add/add.js
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    class: "",
    color: "",
    gender: "",
    id: "",
    fileID: "",
    fileList: [],
  },

  async onClickRight() {
    var that = this;
    var count;
    var lastID;

    //获取已有衣服数量信息
    var Data_Dresses = db.collection("Data_Dresses");
    await Data_Dresses.count().then(async (res) => {
      count = res.total;
      let last;
      if (count != 0) {
        last = await Data_Dresses.skip(count - 1).get();
        lastID = last.data[0].Dress_id;
      } else {
        lastID = -1;
      }
      that.setData({
        id: lastID + 1,
      });
      // console.log(res.total);
      var fileList = this.data.fileList;
      for (let index in fileList) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = fileList[index].tempFilePath;
        // console.log(tempFilePath);

        //上传图片
        wx.cloud.uploadFile({
          cloudPath: lastID + 1 + "/" + index + ".jpg", //仅为示例，非真实的接口地址
          filePath: tempFilePath, //res.tempFilepaths
          name: "file", // 文件对应的key ，默认 为 file
          success(res) {
            console.log("success" + index);
            // if(index == 0)
            // {
            //   this.setData({fileID:res.fileID});
            // }
            console.log(index + ":" + res.fileID);
            that.setData({ fileID: res.fileID });
            if (index == 0) {
              console.log(that.data.fileID);
              //上传数据库
              Data_Dresses.add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  Dress_class: that.data.class,
                  Dress_color: that.data.color,
                  Dress_name: that.data.name,
                  Dress_gender: that.data.gender,
                  Dress_id: that.data.id,
                  Dress_fileID: that.data.fileID,
                  ImgNum: fileList.length,
                },
              })
                .then((res) => {
                  //成功的处理
                  console.log(res);
                  wx.showToast({
                    title: "上传成功",
                    icon: "none",
                    image: "",
                    duration: 3000,
                    mask: false,
                    complete: () => {
                      wx.navigateBack({
                        url: "../mainpage/managepage",
                      });
                    },
                  });
                })
                .catch((err) => {
                  //失败的处理
                  console.log("上传失败:" + err);
                });
            }
          },
          fail: (e) => {
            console.log("fail", e);
          },
        });
      }
    });
  },

  onClickLeft() {
    wx.navigateBack({
      url: "../mainpage/managepage",
    });
  },
  onChangeName(event) {
    this.setData({
      name: event.detail,
    });
  },

  onChangeClass(event) {
    this.setData({
      class: event.detail,
    });
  },

  onChangeColor(event) {
    this.setData({
      color: event.detail,
    });
  },

  onChangeGender(event) {
    this.setData({
      gender: event.detail,
    });
  },

  afterRead(event) {
    var files = event.detail.file;
    // 上传完成需要更新 fileList
    // console.log(event.detail.file)
    // console.log(file.tempFilePath)
    const { fileList = [] } = this.data;
    for (var index in files) {
      var file = files[index];
      var tempFilePath = file.tempFilePath;
      console.log(file);
      fileList.push({
        ...file,
        url: tempFilePath,
        // deletable:true,
      });
    }
    this.setData({ fileList });
  },

  deleteImg(event) {
    var fileList = this.data.fileList;
    let index = event.detail.index;
    console.log(index);
    fileList.splice(index, 1);
    this.setData({ fileList });
    console.log(fileList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 完成后正常使用资源方的已授权的云资源
    // await c1.callFunction({
    //   name: '函数名',
    //   data: {},
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideHomeButton();
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
