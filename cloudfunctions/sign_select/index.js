// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const result = db.collection('Sign').where(_.and([{
      CreateTime: _.lt(new Date('2020-04-28 12:00:00'))
    },
    {
      CreateTime: _.gt(new Date('2020-04-28 12:00:00'))
    }
  ])).get()
  // const result = await db.collection('Sign').where({
  //   OpenID: event.OpenID
  // }).get()
  return result;
}