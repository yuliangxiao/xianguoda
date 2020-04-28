// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  var json = db.collection('Goods').aggregate()
    .lookup({
      from: 'GoodsType',
      localField: 'GoodsTypeID',
      foreignField: 'GoodsTypeID',
      as: 'GoodsTypeList',
    })
    .end()
    .then(res => json = res)
    .catch(err => json = err)

  return json;
}