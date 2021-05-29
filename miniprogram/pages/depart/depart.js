// pages/depart/depart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: []
  },

  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },

  onOpen(event) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let events = JSON.parse(options.events)
    let people = JSON.parse(options.people)
    this.setData({
      all: events.concat(people)
    })
    console.log("all: ", this.data.all);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})