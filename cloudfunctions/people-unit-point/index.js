// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * 返回指定id的指定unit的people
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  const point_id=event.point_id
  const unit_name=event.unit_name
const db=cloud.database()
let filter={
units: true
}
let db_result= await db.collection("sust_point").doc(point_id).field(filter).get()
let units=db_result.data.units
//unit的name是否可能重复
let data=[]
if (unit_name!=null) {
  let length=units.length
  let flag=0;
  for(var i=0;i<length;i++){
if (units[i].name==unit_name) {
  data=units[i].people
  break
}
  }
}
return data
}