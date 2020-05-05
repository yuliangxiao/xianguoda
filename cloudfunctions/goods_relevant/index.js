// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
// 云函数入口函数 商户相关界面接口
// 0-获取当前店铺的待发货商品
// 1-获取具体待发货地点及数量
// 2-修改当前商品的发货状态
// 3-修改当前商品的支付状态
// 4-修改当前商品的收货状态

exports.main = async (event, context) => {
  if (event.flag == 0) {
    let ResultList = {}
    const GoodsList = await db.collection('Goods').where({
      ShopID: event.data.ShopID,
      IsEffective: true
    }).get()
    // if (GoodsList.data.length > 0) {
    // }
    return GoodsList;
  } else if (event.flag == 1) {
    let ResultList = {}
    await db.collection('OrderDetail').aggregate()
      .match({
        IsDeliver: false,
        GoodsID: event.data.GoodsID
      })
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
      .group({
        _id: '$LocationID',
        num: $.sum('$Num')
      })
      .end()
      .then(res => ResultList = res)
      .catch(err => ResultList = err)

    let LocationList = new Array()
    for (var i = 0; i < ResultList.list.length; i++) {
      LocationList[i] = ResultList.list[i]._id
    }
    const LocationListResult = await db.collection('Location').where({
      _id: _.in(LocationList)
    }).get()
    for (let x = 0; x < ResultList.list.length; x++) {
      for (let y = 0; y < LocationListResult.data.length; y++) {
        if (ResultList.list[x]._id == LocationListResult.data[y]._id) {
          ResultList.list[x].LocationName = LocationListResult.data[y].Village
          break
        }
      }
    }
    return ResultList;
  } else if (event.flag == 2) {
    return await db.collection('OrderDetail').where({
        GoodsID: event.data.GoodsID,
        IsDeliver: false
      })
      .update({
        data: {
          IsDeliver: true,
          DeliverTime: db.serverDate()
        },
      });
  } else {
    return '123123';
  }
}