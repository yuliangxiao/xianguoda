// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var data_json = event.data;
    if (event._id == '0') {
      data_json.CreateTime = db.serverDate()
      data_json.LocationXY = db.Geo.Point(data_json.LocationXY[0], data_json.LocationXY[1])
      data_json.EffectiveTime = new Date(data_json.EffectiveTime)
      return await db.collection('Goods').add({
        data: data_json
      })
    } else {
      data_json.LocationXY = db.Geo.Point(data_json.LocationXY[0], data_json.LocationXY[1])
      data_json.EffectiveTime = new Date(data_json.EffectiveTime)
      return await db.collection('Goods').where({
          _id: event._id
        })
        .update({
          data: data_json,
        });
    }
  } catch (e) {
    console.error(e)
  }
}