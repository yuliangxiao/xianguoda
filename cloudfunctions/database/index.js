// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('testlist1').where({
    _id: 'f8c2cf1e5e9d98e900858db800f07326' // 填入当前用户 openid
  }).get()
}