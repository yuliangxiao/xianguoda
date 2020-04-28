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
      return await db.collection('Reprint').add({
        data: data_json
      })
    } else {
      return await db.collection('Reprint').where({
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