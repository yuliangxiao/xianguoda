// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
// 云函数入口函数
//  1：获取当前用户的余额跟未完成订单的收益总额
//  2: 获取个人收支明细
//  3: 获取团长佣金明细
exports.main = async (event, context) => {
  if (event.flag == 1) {
    let user_info = await db.collection('User').where({
      OpenID: event.data.OpenID
    }).get()
    console.log(user_info)
    //判断是否是团长，如果是团长的话查询未完成订单的金额
    if (user_info.data[0].IsFlag) {
      let Sum1 = {}
      await db.collection('PayRecord')
        .aggregate()
        .match({
          GoodsOpenID: event.data.OpenID,
          IsSettlement: false
        })
        .group({
          _id: null,
          Sum: $.sum('$Price1')
        })
        .end()
        .then(res => Sum1 = res)
        .catch(err => Sum1 = err)
      let Sum2 = {}
      await db.collection('PayRecord')
        .aggregate()
        .match({
          ReprintOpenID: event.data.OpenID,
          IsSettlement: false
        })
        .group({
          _id: null,
          Sum: $.sum('$Price2')
        })
        .end()
        .then(res => Sum2 = res)
        .catch(err => Sum2 = err)
      let Sum = 0
      if (Sum1.list.length > 0) {
        Sum = Sum + parseFloat(Sum1.list[0].Sum)
      }
      if (Sum2.list.length > 0) {
        Sum = Sum + parseFloat(Sum2.list[0].Sum)
      }
      user_info.data[0].Sum = Sum;
    }
    console.log(user_info)
    return user_info;
  } else if (event.flag == 2) {
    let personInEx_info = await db.collection('PersonInEx').where({
      OpenID: event.data.OpenID
    }).get()
    return personInEx_info;
  } else if (event.flag == 3) {
    let payRecord_info = {}
    await db.collection("PayRecord")
      .aggregate()
      .match(_.or([{
          GoodsOpenID: event.data.OpenID
        },
        {
          ReprintOpenID: event.data.OpenID
        }
      ]))
      .lookup({
        from: "Goods",
        localField: 'GoodsID',
        foreignField: '_id',
        as: 'Goods'
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$Goods', 0]), '$$ROOT'])
      })
      .project({
        Goods: 0
      })
      .end()
      .then(res => payRecord_info = res)
      .catch(err => payRecord_info = err)
    return payRecord_info;
  }
  return '123';

}