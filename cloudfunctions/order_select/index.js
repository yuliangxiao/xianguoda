// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const result = await db.collection('Order').where({
    _id: event._id
  }).get()

  // const $ = db.command.aggregate
  // const result = db
  //   .collection('Order')

  //   .aggregate()

  //   .project({
  //     _id: 0,
  //     formatDate: $.dateToString({
  //       date: '$CreateTime',
  //       format: '%Y-%m-%d %H:%M:%S',
  //       timezone: 'Asia/Shanghai'
  //     })
  //   })
  //   .end()
  return result;
}