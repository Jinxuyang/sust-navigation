// pages/detail/detail.js
Page({
  data: {
    activeName: '1',
    point_id: '',
    floor_detail: [],
    floor: '',
    description: [],
    events:[],
    people:[]
  },
// 切换列表
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },

  //点开某楼层
  onOpen(event) {
    let that = this
    let floor = event.currentTarget.dataset.floor
    let point_id = this.data.point_id
    console.log("floor_num:" + floor);
    console.log("point_id:" + point_id);
    
    wx.cloud.callFunction({
      name: 'units-point',
      data: {
        point_id,
        floor
      }
    }).then(res => {
      let units_floor = res.result
      this.setData({
        units_floor
      })
      console.log(res);
    })
  },

  //点击部门查看部门详细可以办理的事件或办公室老师
  toDetailEvent(e) {
    console.log('进入部门详情');
    let events = JSON.stringify(e.currentTarget.dataset.events)
    let people = JSON.stringify(e.currentTarget.dataset.people)
    wx.navigateTo({
      url: '../depart/depart?events=' + events + '&people=' + people,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options.point_id);
    let point_id = options.point_id
    that.setData({
      point_id
    }),
    wx.cloud.callFunction({
      name: 'point',
      data: {
        point_id
      }
    }).then(res => {
      console.log('units-point-res:',res.result);
      let floor_num = res.result.floors
      let floor_array = [];
      for (let index = 1; index <= floor_num; index++) {
        floor_array.push(index)
      }
      that.setData({
        floor_array
      })
      console.log('floor_num:'+floor_array);
    })
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