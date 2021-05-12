// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const point_id = event.point_id
  const db = cloud.database().collection('sust_point')

  return db.where({
    id: point_id
  }).get()
}