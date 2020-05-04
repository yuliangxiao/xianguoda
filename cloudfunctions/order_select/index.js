// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
// 0-个人中心界面订单数量显示
exports.main = async (event, context) => {



  const result1 = await db.collection('Order').where({
    OpenID: event.data.OpenID,
    IsPay: false
  }).get()

  let result2 = {}
  await db.collection('OrderDetail').aggregate()
    .lookup({
      from: "Order",
      localField: 'OrderID',
      foreignField: '_id',
      as: 'OrderList'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$OrderList', 0]), '$$ROOT'])
    })
    .project({
      OrderList: 0
    })
    .match({
      OpenID: event.data.OpenID,
      IsDeliver: false,
      IsPay: true
    })
    .end()
    .then(res => result2 = res)
    .catch(err => result2 = err)

  console.log(result2)
  // const result2 = await db.collection('OrderDetail').where({
  //   OpenID: event.data.OpenID,
  //   IsDeliver: false
  // }).get()
  // const result3 = await db.collection('OrderDetail').where({
  //   OpenID: event.data.OpenID,
  //   IsReceiving: false
  // }).get()
  // const result4 = await db.collection('OrderDetail').where({
  //   OpenID: event.data.OpenID,
  //   IsEvaluate: false
  // }).get()
  // let result = {
  //   'result1': result1.data.length,
  //   'result2': result2.data.length,
  //   'result3': result3.data.length,
  //   'result4': result4.data.length
  // }
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
  return 1;
}