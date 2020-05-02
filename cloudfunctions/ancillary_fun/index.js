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
//prarm1:flag 接口类型 0-获取热卖接口 (必填)
//prarm2:data 参数列表

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

    let GoodsList = {}
    await db.collection("Goods")
      .aggregate()
      .match({
        IsFlag: true
      })
      .lookup({
        from: "Location",
        localField: 'LocationID',
        foreignField: '_id',
        as: 'LocationList'
      })
      // .replaceRoot({
      //   newRoot: $.mergeObjects([$.arrayElemAt(['$LocationList', 0]), '$$ROOT'])
      // })
      // .project({
      //   LocationList: 0
      // })
      .end()
      .then(res => GoodsList = res)
      .catch(err => GoodsList = err)
    let Result_List = {}
    let c = 0
    console.log(GoodsList.list)
    for (let i = 0; i < GoodsList.list.length; i++) {
      console.log(GoodsList.list[i].DeliveryRange)
      console.log(GoodsList.list[i].LocationList[0].LocationXY.coordinates[1])
      console.log(GoodsList.list[i].LocationList[0].LocationXY.coordinates[0])
      console.log(UserData.list[0].LocationXY.coordinates[1])
      console.log(UserData.list[0].LocationXY.coordinates[0])
      if (GoodsList.list[i].DeliveryRange >
        GetDistance(GoodsList.list[i].LocationList[0].LocationXY.coordinates[1],
          GoodsList.list[i].LocationList[0].LocationXY.coordinates[0],
          UserData.list[0].LocationXY.coordinates[1], UserData.list[0].LocationXY.coordinates[0])) {
        Result_List[c] = GoodsList.list[i]
        c++
      }
    }
    console.log(Result_List)
    //console.log(GetDistance(36.176189563153244, 120.42672770790102, 36.106932262436544, 120.38740115932467));

    return Result_List;

  } else {
    return '123';
  }
}