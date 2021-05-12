// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const keyword = event.keyword
  switch (event.action) {
    case 'getUnit': {
      return getUnits(keyword)
    }
    case 'getEvent': {
      return getEvents(keyword)
    }
    case 'getPerson': {
      return getPeople(keyword)
    }
    default: {
      return
    }
  } 
}

async function getUnits(keyword){
  const db = cloud.database().collection('sust_point')
  db.aggregate()
  .unwind('$units')
  .addFields({
    units: {
      point_id: '$_id'
    }
  })
  .project({
    units: {
      people: false,
      events: false
    }
  })
  .replaceRoot({
    newRoot: '$units'
  })
  .match({
    name: {
      $regex: '.*' + keyword,
      $options: 'i'
    }
  })
  .end().then(res => {
    console.log(res);
  })
}

async function getEvents(keyword){
  const db = cloud.database().collection('sust_point')
  db.aggregate()
  .unwind('$units')
  .unwind('$units.events')
  .addFields({
    units: {
      events: {
        point_id :'$_id'
      } 
    }
  }) 
  .replaceRoot({
    newRoot: '$units.events'
  })
  .match({
    name: {
      $regex: '.*' + keyword,
      $options: 'i'
    }
  })
  .end().then(res => {
    console.log(res)
  })
}

async function getPeople(keyword){
  const db = cloud.database().collection('sust_point')
  db.aggregate()
  .unwind('$units')
  .unwind('$units.people')
  .addFields({
    units: {
      people: {
        point_id :'$_id'
      } 
    }
  }) 
  .replaceRoot({
    newRoot: '$units.people'
  })
  .match({
    name: {
      $regex: '.*' + keyword,
      $options: 'i'
    }
  })
  .end().then(res => {
    console.log(res)
  })
}
