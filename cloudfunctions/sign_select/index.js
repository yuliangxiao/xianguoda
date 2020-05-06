// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

function getNowMonthDate() {
  var date = new Date();
  var year = date.getFullYear() + "";
  var month = (date.getMonth() + 1) + "";
  // 本月第一天日期
  var begin = year + "-" + month + "-01 00:00:00"
  // 本月最后一天日期    
  var lastDateOfCurrentMonth = new Date(year, month, 0);
  var end = year + "-" + month + "-" + lastDateOfCurrentMonth.getDate() + " 23:00:00";
  return [begin, end];
}

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(new Date(getNowMonthDate()[0]))
  // console.log(new Date(getNowMonthDate()[1]))
  // console.log(new Date('2020-10-10 23:00:00'))
  // console.log(new Date('2020-10-10 24:00:00'))
  const result = db.collection('Sign').where(_.and([{
      CreateTime: _.lt(new Date(getNowMonthDate()[1]))
    },
    {
      CreateTime: _.gt(new Date(getNowMonthDate()[0]))
    }
  ])).get()
  // const result = db.collection('Sign').where(_.and([{
  //     CreateTime: _.lt(new Date('2020-05-31 23:00:00'))
  //   },
  //   {
  //     CreateTime: _.gt(new Date('2020-05-01 00:00:00'))
  //   },
  //   {
  //     OpenID: event.OpenID
  //   }
  // ])).get()
  // const result = await db.collection('Sign').where({
  //   OpenID: event.OpenID
  // }).get()
  return result;
}