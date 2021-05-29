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
    let floor = event.detail
    let point_id = that.data.point_id
    let description = []
    wx.cloud.callFunction({
      name: 'units-point',
      data: {
        point_id,
        floor
      },
      success: res => {
        // console.log('onOpen-res:',res.result);
        description = res.result
        that.setData({
          description
        })
        console.log('description:', that.data.description);
      }
    })
  },

  //点击部门查看部门详细可以办理的事件或办公室老师
  toDetailEvent() {
    console.log('进入部门详情');
    // console.log(this.data.description[0].events);
    // console.log(this.data.description[0].people);
    let events = JSON.stringify(this.data.description[0].events)
    let people = JSON.stringify(this.data.description[0].people)
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
      name: 'units-point',
      data: {
        point_id
      },
      success: res => {
        console.log('units-point-res:',res.result);
        let floor_detail = []
        floor_detail = res.result
        that.setData({
          floor_detail
        })
        console.log('floor:',floor_detail);
      }
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