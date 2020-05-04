// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
// 云函数入口函数
// 0-个人中心界面订单数量显示
// 1-订单列表展示
exports.main = async (event, context) => {

  if (event.flag == 0) {
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
    let result3 = {}
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
        IsDeliver: true,
        IsPay: true,
        IsReceiving: false
      })
      .end()
      .then(res => result3 = res)
      .catch(err => result3 = err)
    let result4 = {}
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
        IsDeliver: true,
        IsPay: true,
        IsReceiving: true,
        IsEvaluate: false
      })
      .end()
      .then(res => result4 = res)
      .catch(err => result4 = err)
    let result = {
      'result1': result1.data.length,
      'result2': result2.list.length,
      'result3': result3.list.length,
      'result4': result4.list.length
    }
    console.log(result)
    return result;
  } else if (event.flag == 1) {
    let ResultList = {}
    if (event.data.type == 0) {
      await db.collection('Order').aggregate()
        .match({
          OpenID: event.data.OpenID,
          IsPay: false
        })
        .lookup({
          from: "OrderDetail",
          localField: '_id',
          foreignField: 'OrderID',
          as: 'OrderDetailList'
        })
        .end()
        .then(res => ResultList = res)
        .catch(err => ResultList = err)
      if (ResultList.list.length > 0) {
        let GoodsIDList = new Array()
        let GoodsID = 0
        for (var i = 0; i < ResultList.list.length; i++) {
          for (var j = 0; j < ResultList.list[i].OrderDetailList.length; j++) {
            GoodsIDList[GoodsID] = ResultList.list[i].OrderDetailList[j].GoodsID
            GoodsID++
          }
        }
        const GoodsList = await db.collection('Goods').where({
          _id: _.in(GoodsIDList)
        }).get()
        for (var i = 0; i < ResultList.list.length; i++) {
          for (var j = 0; j < ResultList.list[i].OrderDetailList.length; j++) {
            for (let z = 0; z < GoodsList.data.length; z++) {
              if (ResultList.list[i].OrderDetailList[j].GoodsID == GoodsList.data[z]._id) {
                ResultList.list[i].OrderDetailList[j].Goods = GoodsList.data[z]
                break
              }
            }
          }
        }
      }
    } else {
      console.log(1231231)
      let condition = {
        OpenID: event.data.OpenID,
        IsPay: true
      }
      if (event.data.flag == 2) {
        condition.IsDeliver = false
      } else if (event.data.flag == 3) {
        condition.IsDeliver = false
      } else if (event.data.flag == 4) {
        condition.IsDeliver = false
      }
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
        .match(condition)
        .end()
        .then(res => ResultList = res)
        .catch(err => ResultList = err)

      let GoodsIDList = new Array()

      for (var i = 0; i < ResultList.list.length; i++) {
        GoodsIDList[i] = ResultList.list[i].GoodsID
      }
      const GoodsList = await db.collection('Goods').where({
        _id: _.in(GoodsIDList)
      }).get()
      for (var i = 0; i < ResultList.list.length; i++) {
        for (let z = 0; z < GoodsList.data.length; z++) {
          if (ResultList.list[i].GoodsID == GoodsList.data[z]._id) {
            ResultList.list[i].Goods = GoodsList.data[z]
            break
          }
        }
      }
    }
    console.log(ResultList)
    return ResultList;
  } else {
    return '12123';
  }


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