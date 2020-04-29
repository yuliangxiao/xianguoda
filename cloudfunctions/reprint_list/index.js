// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = cloud.database().command.aggregate
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {

  //一共三个类别，0-店铺ID 1-大类 2-搜索框
  let test_result = {}
  if (event.flag == 0) {
    await db.collection("Reprint")
      .aggregate()
      .match({
        ShopID: event.ShopID
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
  } else if (event.flag == 1) {

    const GoodsList = await db.collection('Goods').where({
      GoodsTypeID: event.GoodsTypeID
    }).get()
    if (GoodsList.data.length > 0) {
      let GoodsIDList = new Array()
      for (var i = 0; i < GoodsList.data.length; i++) {
        GoodsIDList[i] = GoodsList.data[i]._id
      }
      await db.collection("Reprint")
        .aggregate()
        .match({
          GoodsID: _.in(GoodsIDList)
        })
        .lookup({
          from: "Goods",
          localField: 'GoodsID',
          foreignField: '_id',
          as: 'GoodsList'
        })
        .lookup({
          from: "Location",
          localField: 'LocationID',
          foreignField: '_id',
          as: 'LocationList'
        })
        .replaceRoot({
          newRoot: $.mergeObjects([$.arrayElemAt(['$GoodsList', 0]), $.arrayElemAt(['$LocationList', 0]), '$$ROOT'])
        })
        .project({
          GoodsList: 0,
          LocationList: 0
        })
        .end()
        .then(res => test_result = res)
        .catch(err => test_result = err)
    }
  } else {
    const GoodsList = await db.collection('Goods').where({
      Title: db.RegExp({
        regexp: event.Title,
        option: 'i'
      })
    }).get()
    if (GoodsList.data.length > 0) {
      let GoodsIDList = new Array()
      for (var i = 0; i < GoodsList.data.length; i++) {
        GoodsIDList[i] = GoodsList.data[i]._id
      }
      await db.collection("Reprint")
        .aggregate()
        .match({
          GoodsID: _.in(GoodsIDList)
        })
        .lookup({
          from: "Goods",
          localField: 'GoodsID',
          foreignField: '_id',
          as: 'GoodsList'
        })
        .lookup({
          from: "Location",
          localField: 'LocationID',
          foreignField: '_id',
          as: 'LocationList'
        })
        .replaceRoot({
          newRoot: $.mergeObjects([$.arrayElemAt(['$GoodsList', 0]), $.arrayElemAt(['$LocationList', 0]), '$$ROOT'])
        })
        .project({
          GoodsList: 0,
          LocationList: 0
        })
        .end()
        .then(res => test_result = res)
        .catch(err => test_result = err)
    }
  }
  console.log(test_result)
  return test_result
}