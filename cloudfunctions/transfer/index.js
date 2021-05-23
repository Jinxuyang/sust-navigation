// 云函数入口文件
const cloud = require('wx-server-sdk')
const mysql = require('mysql2/promise')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const connection = await mysql.createConnection({
    host: "47.92.194.26",
    port: 6002,
    database: "navigate_sust",
    user: "root",
    password: "123456"
  })

  

  const point_data = await connection.execute('SELECT * FROM sust_point')
  point_data[0].forEach(async i => {
    let res = {}
    res.name = i.name
    res.coordinate = db.Geo.Point(parseFloat(i.lng),parseFloat(i.lat))
    res.type = {
      "name" : i.type
    }

    let unit_data = (await connection.execute('SELECT name,position FROM unit_info WHERE point_id = '+i.id))[0]
    
    unit_res = []
    unit_data.forEach(j => {
      let ssss = {}
      ssss.name = j.name
      ssss.position = j.position
      unit_res.push(ssss)
    })
    res.units = unit_res


    await db.collection('sust_point').add({
      // data 字段表示需新增的 JSON 数据
      data: res
    })
   
  })

  return
}