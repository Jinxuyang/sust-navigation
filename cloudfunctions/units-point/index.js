// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
/**
 * 通过id查询到point的unit 
 * 可选数据: floor 返回指定floor的units
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  const point_id=event.point_id
  const floor=event.floor
const db=cloud.database()
let filter={
units: true
}
let db_result= await db.collection("sust_point").doc(point_id).field(filter).get()
let units=db_result.data.units
let data=[]
if (floor!=null) {
  let length=units.length
  let flag=0;
  for(var i=0;i<length;i++){
if (units[i].floor==floor) {
  data[flag]=units[i]
  flag++
}
  }
}else{
  data=units
}
return data
}