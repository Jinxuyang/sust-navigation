// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const keyword = event.keyword
  switch (event.action) {
    case 'getUnit': {
      const db = cloud.database().collection('unit_info')
      return search(db,keyword)
    }
    case 'getEvent': {
      const db = cloud.database().collection('event_info')
      return search(db,keyword)
    }
    case 'getPerson': {
      const db = cloud.database().collection('person_info')
      return search(db,keyword)
    }
    default: {
      return
    }
  } 
}

async function search(db,keyword){
  return await db.where({
    name: {
      $regex: '.*' + keyword,
      $options: 'i'
    }
  }).get()
}
