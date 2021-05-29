//index.js
import Toast from '../../dist/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 108.977368,
    latitude: 34.377653,
    map_width: 375,
    map_height: 700,
    markers: [],
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
      
      strokeColor: '#fff',
      strokeWidth: 2,
      zIndex: 1,
      scale: 16
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
    action: 'getUnit',
    units: [],
    scale: 16
  },

  onReady: function(e) {
    this.mapCtx = wx.createMapContext('global_map')
    wx.getLocation({
      'type': 'gcj02'
    }).then(res => {
      this.mapCtx.moveToLocation({
        longitude: res.longitude,
        latitude: res.latitude
      })
      console.log(res);
    })
  },
  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        this.setData({
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
        this.setData({
          units: res.result.list
        })
        console.log('units:', this.data.units)
        
        // this.setData({
        //   keyword: ''
        // })
      }).catch(err => {
        console.log('请求search错误：',err)
        Toast('无法搜索到该地')
      })
  
    } else {
      this.setData({
        units: ""
      })
    }
  },

  async getCoordinate(e){
    let point_id = e.currentTarget.dataset.point_id
    console.log("point_id:" + point_id);
    this.setData({
      point_id
    })
    await wx.cloud.callFunction({
          name:'point',
          data: {
            point_id
          }
        }).then( res => {
          console.log('point:', res.result)
          let markers = this.data.markers
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
          markers.pop()
          markers.push(marker)
          this.setData({
            markers,
            scale: 18,
            currentPoint: res.result
          })
          this.mapCtx.moveToLocation({
            longitude: marker.longitude,
            latitude: marker.latitude
          })
          console.log('markers:', this.data.markers) 
          console.log("then结束");
        })
        this.setData({
          units:''
        })
  },
  async routePlan(e){
    await this.getCoordinate(e)
    console.log("执行到then下");
    let point = this.data.currentPoint;
    console.log(point);
    let plugin = requirePlugin('routePlan');
    let key = 'IK5BZ-73MWV-65IPB-UMZOF-IY3OJ-FRBGX';  //使用在腾讯位置服务申请的key
    let referer = '科大导航';   //调用插件的app的名称
    let endPoint = JSON.stringify({
        'name': point.name,
        'longitude': point.coordinate.coordinates[0],
        'latitude': point.coordinate.coordinates[1]
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&mode=walking'+'&endPoint=' +endPoint
    });

    this.setData({
      units:''
    })
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