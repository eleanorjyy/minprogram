// page/component/orders/orders.js
const app = getApp()
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders: []
  },

  toPay() {

    let that = this;

    wx.getStorage({
      key: 'address',
      success: function (res) {

        that.getCode();
      },
      fail: function (res) {

        wx.showModal({
          title: '提示',
          content: '缺少用户信息，不可以下单',
          showCancel: false
        })
      }
    })
    
  },
  onReady() {
    
    this.getTotalPrice();
    // this.getCode();
    
  },
  
  onShow:function(){
    const self = this;
    
    let pList = app.globalData.carts.map(function(a) {return {id: a.id, num: a.num}});

    wx.request({
      header: {
        "Content-Type": "application/json"
      },
      url:
'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/beforeOrder',
      method: 'POST',
      data: {
        pList: pList
      },
      success: function (res) {


        self.setData({
          orders: res.data.data,
          total: res.data.total, 
          pretax: res.data.pretax,
          tax: res.data.tax,
          shipping_fee: res.data.shipping_fee
        });
        // self.getTotalPrice();
      },
      fail: function (res) {

      }
    })

    // this.setData({
    //   orders: app.globalData.carts
    // });
    wx.getStorage({
      key:'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },
  createNonceStr: function () {
    return Math.random().toString(36).substr(2, 15)
  },
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },

  
  callPayRequest(res){

    wx.requestPayment(
      {
        'timeStamp': res.data.timeStamp.toString(),
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': 'MD5',
        'paySign': res.data.paySign,
        'success': function (res) {

          wx.showModal({
            title: '提示',
            content: '支付成功',
            showCancel: false
          })

        },
        'fail': function (res) {

          wx.showModal({
            title: '提示',
            content: '支付失败',
            showCancel: false
          })
        },
        'complete': function (res) {

          // 清空购物车
          app.globalData.carts = []
          app.globalData.totalNum = 0

          wx.switchTab({
            url: '/page/component/user/user'
          })

          console.log(res);

        }
      })
  },

  getCode(){
    let js_code = ""
    var that = this
    let pList = app.globalData.carts.map(function (a) { return { id: a.id, num: a.num } });



    wx.login({
      success: function (res) {
        

        if (res.code) {


          //发起网络请求
          wx.request({
            header: {
              "Content-Type": "application/json"
            },
            url: 
'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/smallAppLoginCheck',
            method: 'POST',
            data: {
              code: res.code,
              // total: 1, // 分，乘以100,
              // total: that.data.total * 100, // 分，乘以100,
              pList: pList,
              // pretax: that.data.pretax * 100,
              // tax: that.data.tax * 100,
              // shipping_fee: that.data.shipping_fee * 100

            },
            success: function (res) {

              that.callPayRequest(res)
            },
            fail: function (res) {

            }
          })
        } else {

        }
      }
    });

  },
})