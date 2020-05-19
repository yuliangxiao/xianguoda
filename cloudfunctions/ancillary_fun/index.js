// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const $ = cloud.database().command.aggregate

function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
// 云函数入口函数 附属功能集合 
//prarm1:flag 接口类型 0-获取热卖接口 (必填) 1-首页地图展示及首页列表展示接口 2-根据商品表id获取转载表数据 3-根据地图中商品是否在中心点展示简略信息
//prarm2:data 参数列表 keyword-搜索关键字(1)

//fun1 获取热卖列表，最多3个

exports.main = async (event, context) => {
  if (event.flag == 0) {
    let UserData = {}
    await db.collection("User")
      .aggregate()
      .match({
        OpenID: event.data.OpenID
      })
      .lookup({
        from: "Location",
        localField: 'LocationID',
        foreignField: '_id',
        as: 'LocationList'
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$LocationList', 0]), '$$ROOT'])
      })
      .project({
        LocationList: 0
      })
      .end()
      .then(res => UserData = res)
      .catch(err => UserData = err)

    const GoodsList = await db.collection('Goods').where({
      IsFlag: true
    }).get()
    // await db.collection("Goods")
    //   .aggregate()
    //   .match({
    //     IsFlag: true
    //   })
    //   .lookup({
    //     from: "Location",
    //     localField: 'LocationID',
    //     foreignField: '_id',
    //     as: 'LocationList'
    //   })
    //   .end()
    //   .then(res => GoodsList = res)
    //   .catch(err => GoodsList = err)
    let Result_List = {}
    let c = 1
    for (let i = 0; i < GoodsList.data.length; i++) {
      if (GoodsList.data[i].DeliveryRange >
        GetDistance(GoodsList.data[i].LocationXY.latitude,
          GoodsList.data[i].LocationXY.longitude,
          UserData.list[0].LocationXY.coordinates[1], UserData.list[0].LocationXY.coordinates[0])) {
        Result_List[c] = GoodsList.data[i]
        c++
        if (c > 3) break
      }
    }
    console.log(Result_List)
    //console.log(GetDistance(36.176189563153244, 120.42672770790102, 36.106932262436544, 120.38740115932467));

    return Result_List;

  } else if (event.flag == 1) {
    let UserData = {}
    await db.collection("User")
      .aggregate()
      .match({
        OpenID: event.data.OpenID
      })
      .lookup({
        from: "Location",
        localField: 'LocationID',
        foreignField: '_id',
        as: 'LocationList'
      })
      .replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$LocationList', 0]), '$$ROOT'])
      })
      .project({
        LocationList: 0
      })
      .end()
      .then(res => UserData = res)
      .catch(err => UserData = err)
    let GoodsList = {}
    if (event.data.keyword == '') {
      await db.collection("Goods")
        .aggregate()
        .lookup({
          from: "Location",
          localField: 'LocationID',
          foreignField: '_id',
          as: 'LocationList'
        })
        .end()
        .then(res => GoodsList = res)
        .catch(err => GoodsList = err)
    } else {
      await db.collection("Goods")
        .aggregate()
        .match({
          Title: db.RegExp({
            regexp: event.data.keyword,
            option: 'i'
          })
        })
        .lookup({
          from: "Location",
          localField: 'LocationID',
          foreignField: '_id',
          as: 'LocationList'
        })
        .end()
        .then(res => GoodsList = res)
        .catch(err => GoodsList = err)
    }
    let Result_List = {}
    let c = 0
    for (let i = 0; i < GoodsList.list.length; i++) {
      if (GoodsList.list[i].DeliveryRange >
        GetDistance(GoodsList.list[i].LocationXY.coordinates[1],
          GoodsList.list[i].LocationXY.coordinates[0],
          UserData.list[0].LocationXY.coordinates[1], UserData.list[0].LocationXY.coordinates[0])) {
        Result_List[c] = GoodsList.list[i]
        c++
      }
    }
    console.log(Result_List)
    return Result_List
  } else if (event.flag == 2) {
    let Result_List = {}
    await db.collection("Goods")
      .aggregate()
      .match({
        _id: event.data.GoodsID
      })
      .lookup({
        from: "Reprint",
        localField: '_id',
        foreignField: 'GoodsID',
        as: 'ReprintList'
      })
      .end()
      .then(res => Result_List = res)
      .catch(err => Result_List = err)
    console.log(Result_List)
    return Result_List;
  } else if (event.flag == 2) {
    const Result_List = await db.collection('Goods').where({
      id: event.data.GoodsID
    }).get()
    console.log(Result_List)
    return Result_List;
  } else {
    return '123';
  }
}