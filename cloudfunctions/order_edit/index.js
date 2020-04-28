// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var data_json = event.data;

    if (data_json.IsPay) {
      data_json.PayTime = new Date(data_json.PayTime)
    }
    if (data_json.IsDeliver) {
      data_json.DeliverTime = new Date(data_json.DeliverTime)
    }
    if (data_json.IsReceiving) {
      data_json.ReceivingTime = new Date(data_json.ReceivingTime)
    }
    if (event._id == '0') {
      data_json.CreateTime = db.serverDate()
      data_json.ExpectedTime = new Date(data_json.ExpectedTime)
      return await db.collection('Order').add({
        data: data_json
      })
    } else {
      return await db.collection('Order').where({
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