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
  const Location = await db.collection('Location').where({
    _id: test_result.list[0].LocationID
  }).get()

  test_result.list[0].LocationText = Location.data[0].Village

  let UserListResult = ''
  //团购人数
  await db.collection("OrderDetail")
    .aggregate()
    .match({
      ReprintID: event._id
    })
    .lookup({
      from: "User",
      localField: 'OpenID',
      foreignField: 'OpenID',
      as: 'UserList'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$UserList', 0]), '$$ROOT'])
    })
    .project({
      UserList: 0
    })
    .end()
    .then(res => UserListResult = res)
    .catch(err => UserListResult = err)
  if (UserListResult.list.length > 0) {
    test_result.list[0].UserList = UserListResult.list
  } else {
    test_result.list[0].UserList = []
  }
  //供货商 目前查询当前团长下的所有当前类别产品的列表吧
  let GoodsListOtherResult = ''
  await db.collection("Reprint")
    .aggregate()
    .match({
      GoodsID: test_result.list[0].GoodsID,
      ShopID: test_result.list[0].ShopID
    })
    .lookup({
      from: "Goods",
      localField: 'GoodsID',
      foreignField: '_id',
      as: 'GoodsOtherList'
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$GoodsOtherList', 0]), '$$ROOT'])
    })
    .project({
      GoodsOtherList: 0
    })
    .end()
    .then(res => GoodsListOtherResult = res)
    .catch(err => GoodsListOtherResult = err)
  console.log(GoodsListOtherResult)
  if (GoodsListOtherResult.list.length > 0) {
    test_result.list[0].GoodsOtherList = GoodsListOtherResult.list
  } else {
    test_result.list[0].GoodsOtherList = []
  }
  //判断是否在配送范围内
  if (GoodsList.list[i].DeliveryRange >
    GetDistance(GoodsList.list[i].LocationXY.coordinates[1],
      GoodsList.list[i].LocationXY.coordinates[0],
      UserData.list[0].LocationXY.coordinates[1], UserData.list[0].LocationXY.coordinates[0])) {
   
  }

  console.log(test_result)
  return test_result;
}