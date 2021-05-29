//index.js
import Toast from '../../dist/toast/toast';
const app = getApp()

Page({
  data: {
    longitude: 108.977368,
    latitude: 34.377653,
    map_width: 375,
    map_height: 700,
    markers: [
      {
      id: 0,
      longitude: 108.977368,
      latitude: 34.377653,
      callout: {
        content: '当前位置',
        color: '#e15f41',
        fontSize: 12,
        borderRadius:20,
        padding: 10,
        display: 'ALWAYS'
      },
      iconPath: '../../images/location_blue.png',
      width: 50,
      height: 50,
      bottomHeight: 0,
      point_id: ''
    },
    ],
    polygons: [{
      points: [
        {longitude: 108.976772, latitude: 34.381229},
        {longitude: 108.976493, latitude: 34.38177},
        {longitude: 108.976112, latitude: 34.381721},
        {longitude: 108.9754521, latitude: 34.383824},
        {longitude: 108.98028, latitude: 34.3847},
        {longitude: 108.980146, latitude: 34.385121},
        {longitude: 108.981439, latitude: 34.385347},
        {longitude: 108.981562, latitude: 34.385063},
        {longitude: 108.981305, latitude: 34.384598},
        {longitude: 108.981391, latitude: 34.382398},
        {longitude: 108.976772, latitude: 34.381229},
      ],
      fillColor: '#4F94CD33',
      strokeColor: '#fff',
      strokeWidth: 2,
      zIndex: 1
    },{
      points:[
        {longitude: 108.971477, latitude: 34.379486},
        {longitude: 108.981321, latitude: 34.382146},
        {longitude: 108.981176, latitude: 34.375115},
        {longitude: 108.980441, latitude: 34.375071},
        {longitude: 108.973011, latitude: 34.375603},
        {longitude: 108.972931, latitude: 34.376967},
        {longitude: 108.971509, latitude: 34.377006},
        {longitude: 108.971477, latitude: 34.379486},
      ],
      fillColor: '#4F94CD33',
      strokeColor: '#fff',
      strokeWidth: 2,
      zIndex: 1
    }],
    icon: [
      {
        name: 'location',
        description: '找地点',
        id: 'unit'
      },
      {
        name: 'addressbook',
        description: '找人',
        id: 'person'
      },
      {
        name: 'text',
        description: '办事',
        id: 'event'
      }
    ],
    isChecked: 0,
    flyFlag: false,
    bottomHeight: '0rpx',
    keyword: '',
    action: ''
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('global_map')
  },

  onLoad: function() {
    let that = this
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        that.setData({
          map_width: res.windowWidth,
          map_height: res.windowHeight
        })
      },
    })
  },

  getHeight(e) {
    // console.log("获取键盘高度",e.detail.height)
    // console.log(this.data.bottomHeight)
    let bottomHeight = this.data.bottomHeight
    bottomHeight = (e.detail.height * 2 ) + 'rpx'
    this.setData({
      bottomHeight
    })
    // console.log("之后", this.data.bottomHeight)
  },


  // 切换搜索选项
  choiceStatus(e) {
    console.log(e)
    let srchAction =''
    switch (e.currentTarget.id) {
      case 'unit':
        srchAction = 'getUnit'
        break;
      case 'person':
        srchAction = 'getPerson'
        break;
      case 'event':
        srchAction = 'getEvent'
        break;
      default:
        srchAction = 'getUnit'
        break;
    }
    console.log('action:', srchAction)
    this.setData({
      isChecked: e.currentTarget.id,
      action: srchAction
    })
  },

  //点击搜索 
  search() {
    let that = this
    let keyword = this.data.keyword
    let action = this.data.action
    console.log('keyword:',keyword)
    console.log('action:',action)
    if(keyword) {
      wx.cloud.callFunction({
        name: 'search',
        data: {
          keyword,
          action,
        }
      }).then(res => {
        console.log('点击搜索res',res.result)
        let point_id = res.result.list[0].point_id
        that.setData({
          point_id
        })
        console.log('point_id:', that.data.point_id)
        wx.cloud.callFunction({
          name:'point',
          data: {
            point_id
          },
          success: res => {
            console.log('point-res:', res.result)
            let markers = that.data.markers
            let marker = {
              id:0,
              longitude: res.result.coordinate.coordinates[0],
              latitude: res.result.coordinate.coordinates[1],
              callout: {
                content: res.result.name,
                color: '#e15f41',
                fontSize: 12,
                borderRadius:20,
                padding: 10,
                display: 'ALWAYS'
              },
              iconPath: '../../images/location_red.png',
              width: 50,
              height: 50
            }
            // console.log('marker:', marker)
            markers.pop()
            markers.push(marker)
            that.setData({
              markers
            })
            that.mapCtx.moveToLocation({
              longitude: marker.longitude,
              latitude: marker.latitude
            })
            console.log('markers:', that.data.markers) 
          },
          fail: err => {
            console.log('请求point错误：',err)
            Toast('网络错误')
          }
        })
        that.setData({
          keyword: ''
        })
      }).catch(err => {
        console.log('请求search错误：',err)
        Toast('无法搜索到该地')
      })
  
    } else {
      Toast('请输入搜索关键字')
    }
  },

  toDetail() {
    wx.navigateTo({
      url: '../detail/detail?point_id=' + this.data.point_id,
    })
  },

  //获取搜索的值
  getKeyWord(e) {
    this.setData({
      keyword: e.detail.value,
      bottomHeight: 0
    })
  }
})
