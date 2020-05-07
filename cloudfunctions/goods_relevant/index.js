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
// 3-修改当前订单的支付状态
// 4-修改当前商品的收货状态
// 5-退款接口(未测试)
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
    const OrderDetailList = await db.collection('OrderDetail').where({
      GoodsID: event.data.GoodsID,
      IsDeliver: false
    }).get()

    // const OrderDetailIDList = event.data.OrderDetailIDList
    for (let i = 0; i < OrderDetailList.list.length; i++) {
      await db.collection('OrderDetail').where({
          _id: OrderDetailList.list[i]._id
        })
        .update({
          data: {
            IsDeliver: true,
            DeliverTime: db.serverDate()
          },
        });
    }
    return 'ok'
  } else if (event.flag == 3) {

    let OrderDetail = {}
    await db.collection("OrderDetail")
      .aggregate()
      .match({
        OrderID: event.data.OrderID
      })
      .lookup({
        from: "Order",
        localField: 'OrderID',
        foreignField: '_id',
        as: 'Order'
      })
      .lookup({
        from: "Reprint",
        localField: 'ReprintID',
        foreignField: '_id',
        as: 'Reprint'
      })
      // .replaceRoot({
      //   newRoot: $.mergeObjects([$.arrayElemAt(['$Order', 0]), '$$ROOT'])
      // })
      // .project({
      //   Order: 0
      // })
      .end()
      .then(res => OrderDetail = res)
      .catch(err => OrderDetail = err)
    for (let i = 0; i < OrderDetail.list.length; i++) {

      let curr_goods = await db.collection('Goods').where({
        _id: OrderDetail.list[i].Reprint[0].GoodsID
      }).get()
      let Price1 = 0
      let Price2 = 0
      let TotalPrice = OrderDetail.list[i].Num * OrderDetail.list[i].Reprint[0].Price
      let GoodsOpenID = ''
      let ReprintOpenID = ''

      if (curr_goods.data[0].ShopID == OrderDetail.list[i].Reprint[0].ShopID) {
        Price1 = TotalPrice

        GoodsOpenID = curr_goods.data[0].OpenID
        ReprintOpenID = curr_goods.data[0].OpenID

      } else {
        Price1 = OrderDetail.list[i].Num * curr_goods.data[0].InsidePrice
        Price2 = TotalPrice - Price1

        GoodsOpenID = curr_goods.data[0].OpenID

        let curr_goods = await db.collection('Goods').where({
          _id: OrderDetail.list[i].Reprint[0].GoodsID
        }).get()
        ReprintOpenID = curr_goods.data[0].OpenID
      }

      await db.collection('PayRecord').add({
        data: {
          OpenID: OrderDetail.list[i].OpenID,
          OrderID: OrderDetail.list[i].OrderID,
          ReprintID: OrderDetail.list[i].ReprintID,
          GoodsID: OrderDetail.list[i].GoodsID,
          TotalPrice: TotalPrice,
          Price1: Price1,
          Price2: Price2,
          IsSettlement: flase,
          // SettlementTime: ,
          CreateTime: db.serverDate(),
          OrderDetailID: OrderDetail.list[i]._id,
          GoodsOpenID: GoodsOpenID,
          ReprintOpenID: ReprintOpenID
        }
      })
    }


    return await db.collection('Order').where({
        _id: event.data.OrderID,
      })
      .update({
        data: {
          IsPay: true,
          PayTime: db.serverDate()
        },
      });
  } else if (event.flag == 4) {
    return await db.collection('OrderDetail').where({
        _id: event.data.OrderDetailID
      })
      .update({
        data: {
          IsReceiving: true,
          ReceivingTime: db.serverDate()
        },
      });
  } else if (event.flag == 5) {
    const OrderDetailIDList = event.data.OrderDetailIDList
    for (let i = 0; i < OrderDetailIDList.length; i++) {
      let OrderDetail = {}
      await db.collection("OrderDetail")
        .aggregate()
        .match({
          _id: OrderDetailIDList[i]
        })
        .lookup({
          from: "Order",
          localField: 'OrderID',
          foreignField: '_id',
          as: 'Order'
        })
        .lookup({
          from: "Reprint",
          localField: 'ReprintID',
          foreignField: '_id',
          as: 'Reprint'
        })
        // .replaceRoot({
        //   newRoot: $.mergeObjects([$.arrayElemAt(['$Order', 0]), '$$ROOT'])
        // })
        // .project({
        //   Order: 0
        // })
        .end()
        .then(res => OrderDetail = res)
        .catch(err => OrderDetail = err)

      //查询当前订单是否有多个商品
      let is_has_multiple_goods = false

      let curr_detail = await db.collection('OrderDetail').where({
        OpenID: OrderDetail.list[0].OrderID
      }).get()

      if (curr_detail.length > 1) {
        is_has_multiple_goods = true
      }
      //应退回金额
      let refund_print = 0
      //如果没有使用优惠券
      if (OrderDetail.list[0].OriginalPrice == OrderDetail.list[0].ActualPrice) {
        //如果这个订单买了多个商品，应退回的金额等于当前商品购买的数量加上商品的单价
        if (is_has_multiple_goods) {
          refund_print = OrderDetail.list[0].Reprint[0].Price * OrderDetail.list[0].num
        } else {
          //如果当前订单只购买了一个产品，那么退回支付金额就可以
          refund_print = OrderDetail.list[0].Order[0].ActualPrice
        }
      }
      //如果使用了优惠券
      else {
        //如果这个订单购买了多个商品,退回的金额等于 当前商品的原价/商品支付的原来总价*商品的实际支付价格(不知道对不对)
        if (is_has_multiple_goods) {
          refund_print = OrderDetail.list[0].Reprint[0].Price * OrderDetail.list[0].num / OrderDetail.list[0].OriginalPrice * OrderDetail.list[0].ActualPrice
        } else {
          //如果当前订单只购买了一个产品，那么退回支付金额就可以
          refund_print = OrderDetail.list[0].Order[0].ActualPrice
        }
      }
      //修改订单状态
      await db.collection('OrderDetail').where({
          _id: OrderDetailIDList[i]
        })
        .update({
          data: {
            IsRefund: true,
            RefundTime: db.serverDate()
          },
        });
      //修改用户金额
      const PayRecord = await db.collection('PayRecord').where({
        _id: OrderDetail.list[0].Order[0].OpenID
      }).get()
      await db.collection('User').where({
          _id: OrderDetail.list[0].Order[0].OpenID
        })
        .update({
          data: {
            Money: PayRecord.data[0].Money + refund_print
          },
        });
    }
    return 'ok'
  } else {
    return '123123';
  }
}