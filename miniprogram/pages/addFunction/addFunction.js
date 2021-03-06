// pages/addFunction/addFunction.js

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`

Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
  },

  onLoad: function (options) {

  },

  copyCode: function () {
    wx.setClipboardData({
      data: code,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  testFunction() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 1,
        b: 2
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  goods_edit() {
    wx.cloud.callFunction({
      name: 'goods_edit',
      data: {
        _id: 'b5ad2e925ea12e24000310c7707d00f9',
        data: {
          OpenID: 'asdfadfa',
          ShopID: '1',
          GroupPrice: 10.5,
          Image: 'https://6170-appserver-u0drq-1301911998.tcb.qcloud.la/my-image.jpg?sign=22e40d8eeccd1c1f99888f36bdf1a54f&t=1587527129',
          Title: '标题',
          GoodsTypeID: '1',
          GroupNum: 5.0,
          InsidePrice: 10.1,
          InsideNum: 10.0,
          LocationID: '1',
          LocationXY: [113, 23],
          StockNum: 9999,
          DeliveryRange: 3.0,
          DeliveryTime: 5.0,
          EffectiveTime: '2020-05-01 00:00:00',
          IsEffective: true,
          IsFlag: true
        }
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  goods_select() {
    wx.cloud.callFunction({
      name: 'goods_select',
      data: {
        _id: 'b5ad2e925ea12e24000310c7707d00f9',
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  user_edit() {
    wx.cloud.callFunction({
      name: 'user_edit',
      data: {
        _id: '3f8c212f5ea27627001c0d25244090fe',
        data: {
          OpenID: 'openid',
          Name: '名称',
          Money: 110.50,
          Image: 'https://6170-appserver-u0drq-1301911998.tcb.qcloud.la/my-image.jpg?sign=22e40d8eeccd1c1f99888f36bdf1a54f&t=1587527129',
          Phone: '17854211111',
          LocationID: '1009',
          IsFlag: false
        }
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  user_select() {
    wx.cloud.callFunction({
      name: 'user_select',
      data: {
        _id: 'openid',
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  reprint_edit() {
    wx.cloud.callFunction({
      name: 'reprint_edit',
      data: {
        _id: '0',
        data: {
          ShopID: '1',
          GoodsID: '1',
          Price: 110.50,
          AssembleNum: '5'
        }
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  reprint_select() {
    wx.cloud.callFunction({
      name: 'reprint_select',
      data: {
        _id: '794792045ea283220019df1026f6a1a1',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  order_edit() {
    wx.cloud.callFunction({
      name: 'order_edit',
      data: {
        _id: '0',
        data: {
          Order: {
            OpenID: 'OpenID',
            CouponID: '1',
            OriginalPrice: 110.5,
            ActualPrice: 100.5,
            LocationID: '1',
          },
          OrderDetail: [{
              ShopID: '1',
              GoodsID: '1',
              ReprintID: '1',
              Num: '10',
            },
            {
              ShopID: '2',
              GoodsID: '3',
              ReprintID: '4',
              Num: '20',
            }
          ]
        }
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  order_select() {
    wx.cloud.callFunction({
      name: 'order_select',
      data: {
        // flag: 0,
        // data: {
        //   OpenID: 'openid'
        // }
        flag: 1,
        data: {
          OpenID: 'openid',
          type: 4
        }
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  couponUser_edit() {
    wx.cloud.callFunction({
      name: 'couponUser_edit',
      data: {
        _id: '2a625d2b5ea6ca8d00400e3f550ffa49',
        data: {
          OpenID: 'OpenID',
          CouponID: '1',
          IsUse: false
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  couponUser_select() {
    wx.cloud.callFunction({
      name: 'couponUser_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  evaluate_edit() {
    wx.cloud.callFunction({
      name: 'evaluate_edit',
      data: {
        _id: '0',
        data: {
          OpenID: 'OpenID',
          GoodID: '1',
          Leave: '1',
          Remark: 'Remark',
          OrderDetailID: '19762d645ea9429f00129754668fb96c'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  evaluate_select() {
    wx.cloud.callFunction({
      name: 'evaluate_select',
      data: {
        GoodID: '1',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  collection_edit() {
    wx.cloud.callFunction({
      name: 'collection_edit',
      data: {
        _id: '0',
        data: {
          OpenID: 'OpenID',
          ReprintID: '1'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  collection_select() {
    wx.cloud.callFunction({
      name: 'collection_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  shoppingCart_edit() {
    wx.cloud.callFunction({
      name: 'shoppingCart_edit',
      data: {
        _id: '0',
        data: {
          OpenID: 'OpenID',
          ReprintID: '1',
          Num: 10
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  shoppingCart_select() {
    wx.cloud.callFunction({
      name: 'shoppingCart_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  sign_edit() {
    wx.cloud.callFunction({
      name: 'sign_edit',
      data: {
        data: {
          OpenID: 'OpenID'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  sign_select() {
    wx.cloud.callFunction({
      name: 'sign_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  payRecord_edit() {
    wx.cloud.callFunction({
      name: 'payRecord_edit',
      data: {
        _id: '0',
        OpenID: 'OpenID',
        OrderID: 'OrderID',
        ReprintID: 'ReprintID',
        GoodsID: 'GoodsID',
        TotalPrice: 50.0,
        Price1: 10.0,
        Price2: 40.0,
        IsSettlement: false
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  payRecord_select() {
    wx.cloud.callFunction({
      name: 'payRecord_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  shop_edit() {
    wx.cloud.callFunction({
      name: 'shop_edit',
      data: {
        _id: '3f8c212f5ea6db4a006519ec74d86105',
        data: {
          Name: 'd店铺名称111',
          OpenID: 'OpenID',
          LocationID: '1'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  shop_select() {
    wx.cloud.callFunction({
      name: 'shop_select',
      data: {
        OpenID: 'OpenID',
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  goodsType_select() {
    wx.cloud.callFunction({
      name: 'goodsType_select',
      // data: {
      //   OpenID: 'OpenID',
      // },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  reprint_list() {
    wx.cloud.callFunction({
      name: 'reprint_list',
      data: {
        flag: 0,
        // Title: '标'
        // GoodsTypeID: '1'
        ShopID: '3f8c212f5ea6db4a006519ec74d86105'
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  ancillary_fun() {
    wx.cloud.callFunction({
      name: 'ancillary_fun',
      data: {
        // flag: 0,
        // data: {
        //   OpenID: 'openid'
        // }
        // flag: 1,
        // data: {
        //   OpenID: 'openid',
        //   keyword: '标'
        // }
        flag: 2,
        data: {
          GoodsID: 'bLw6WZGPWbtEsgiithn5XFVp8G8WSBuluXmcxPlpPmgvr5pb'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  goods_relevant() {
    wx.cloud.callFunction({
      name: 'goods_relevant',
      data: {
        // flag: 0,
        // data: {
        //   OpenID: 'openid'
        // }
        // flag: 1,
        // data: {
        //   GoodsID: 'bLw6WZGPWbtEsgiithn5XFVp8G8WSBuluXmcxPlpPmgvr5pb'
        // }
        // flag: 2,
        // data: {
        //   OrderDetailIDList: [
        //     '6af880a55eb0e0a10014019375b20f83',
        //     '5e847ab25eb0e112001819f158f2460f'
        //   ]
        //   // GoodsID: 'bLw6WZGPWbtEsgiithn5XFVp8G8WSBuluXmcxPlpPmgvr5pb'
        // }
        // flag: 3,
        // data: {
        //   OrderID: 'YKWOKLDC6C0lDWJxyaO0zC6UU5llGWZPjSzGtiJfPkUfbJEg'
        // }
        // flag: 4,
        // data: {
        //   OrderDetailID: 'vI5Dkxu3TylOaZuOnQx3gX4pOI0VYme5OZfoHccxvd2WG84q'
        // }
        flag: 5,
        data: {
          OrderDetailIDList: [
            'QceMRWhbqZa093QmbPQdAeo4DnEthHthfBMO7Yf0315bHOuB'
          ]
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  service() {
    wx.cloud.callFunction({
      name: 'service',
      data: {
        flag: 1
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
  user_info() {
    wx.cloud.callFunction({
      name: 'user_info',
      data: {
        flag: 3,
        data: {
          OpenID: 'openid'
        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },
})