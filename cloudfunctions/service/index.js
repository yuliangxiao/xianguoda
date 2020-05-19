// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
//1:通过接口判断是否需要自动收货
exports.main = async (event, context) => {
  if (event.flag == 1) {
    let list = await db.collection('OrderDetail').where({
      IsDeliver: true,
      IsReceiving: false
    }).get()
    if (list.data.length > 0) {
      for (let i = 0; i < list.data.length; i++) {
        let days = Math.floor((new Date().getTime() - new Date(list.data[i].DeliverTime).getTime()) / (24 * 3600 * 1000))

        // console.log(days)
        //如果发货三天之后还没有收货
        if (days > 3) {

          // console.log(list.data[i]._id)
          await db.collection('OrderDetail').where({
              _id: list.data[i]._id
            })
            .update({
              data: {
                IsReceiving: true,
                ReceivingTime: db.serverDate()
              }
            });
          continue

          // 下面的代码不知道改没改，从goods_relevant拷贝过来的


          //根据结算金额分别往商户账号跟团长账号添加金额
          let PayRecord = await db.collection('PayRecord').where({
            OrderDetailID: event.data.OrderDetailID
          }).get()
          //更改货源账号金额及添加收支记录表
          let curr_user = await db.collection('User').where({
            OpenID: PayRecord.data[0].GoodsOpenID
          }).get()
          await db.collection('User').where({
              OpenID: PayRecord.data[0].GoodsOpenID
            })
            .update({
              data: {
                Money: curr_user.data[0].Money + PayRecord.data[0].Price1
              },
            });
          await db.collection('PersonInEx').add({
            data: {
              OpenID: PayRecord.data[0].GoodsOpenID,
              Money: PayRecord.data[0].Price1,
              OrderID: PayRecord.data[0].OrderID,
              InExType: '3'
            }
          })

          //如果货物不是货源自己的，那需要给团长添加抽成
          if (PayRecord.data[0].Price2 > 0) {
            let curr_user1 = await db.collection('User').where({
              OpenID: PayRecord.data[0].ReprintOpenID
            }).get()
            await db.collection('User').where({
                OpenID: PayRecord.data[0].ReprintOpenID
              })
              .update({
                data: {
                  Money: curr_user1.data[0].Money + PayRecord.data[0].Price2
                },
              });
            await db.collection('PersonInEx').add({
              data: {
                OpenID: PayRecord.data[0].ReprintOpenID,
                Money: PayRecord.data[0].Price2,
                OrderID: PayRecord.data[0].OrderID,
                InExType: '3'
              }
            })
          }
          //更改支付记录表的结算状态
          await db.collection('PayRecord').where({
              _id: PayRecord.data[0]._id
            })
            .update({
              data: {
                IsSettlement: true,
                SettlementTime: db.serverDate()
              },
            });
          //更改订单明细表的收货状态
          return await db.collection('OrderDetail').where({
              _id: event.data.OrderDetailID
            })
            .update({
              data: {
                IsReceiving: true,
                ReceivingTime: db.serverDate()
              },
            });
        }
      }
    }
  }

  return '123'
}