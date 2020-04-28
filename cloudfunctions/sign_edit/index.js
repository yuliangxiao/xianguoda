// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var data_json = event.data;
  data_json.CreateTime = db.serverDate()
  return await db.collection('Sign').add({
    data: data_json
  })
}