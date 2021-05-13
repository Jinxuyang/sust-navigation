// 云函数入口文件
const cloud = require('wx-server-sdk')
// 云函数入口函数
/**
 * 通过id查询到point的坐标和名称
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  cloud.init()
const db = cloud.database().collection('sust_point')
const point_id = event.point_id
let data= await db.doc(point_id).field({
  units: false
}).get()

return data.data
}