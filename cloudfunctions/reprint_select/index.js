// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = cloud.database().command.aggregate
const _ = db.command.aggregate


// 云函数入口函数
exports.main = async (event, context) => {

  let test_result = {}
  let TotalSales = ''
  await db.collection("Reprint")
    .aggregate()
    .match({
      _id: event._id
    })
    .lookup({
      from: "Goods",
      localField: 'GoodsID',
      foreignField: '_id',
      as: 'GoodsList'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$GoodsList', 0]), '$$ROOT'])
    })
    .project({
      GoodsList: 0
    })
    .end()
    .then(res => test_result = res)
    .catch(err => test_result = err)
  //总销售数量
  await db.collection('OrderDetail')
    .aggregate()
    .match({
      GoodsID: test_result.list[0].GoodsID
    })
    .group({
      _id: null,
      Num: $.sum('$Num')
    })
    .end()
    .then(res => TotalSales = res)
    .catch(err => TotalSales = err)
  if (TotalSales.list.length > 0) {
    test_result.list[0].TotalSales = TotalSales.list[0].Num
  } else {
    test_result.list[0].TotalSales = 0
  }
  //location位置
  //团购人数
  //供货商

  console.log(test_result)
  return test_result;
}