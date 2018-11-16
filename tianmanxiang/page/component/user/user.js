// page/component/new-pages/user/user.js
Page({
  data:{
    thumb:'',
    name:'',
    orders:[],
    hasAddress:false,
    address:{},
    
  },
  
  getOrder(orders){
    let self = this;
    //console.log(orders);
    var orderInfo = [];
    
    
    if(orders != []){
      for(var i=0;i<orders.length;i++){
        var each = {"orderId":orders[i].oid,"totalPrice":orders[i].price,
              "time":orders[i].time,"status":orders[i].status,
              "boxes":orders[i].boxes};
        //console.log(each);
        orderInfo.push(each);
      }
    }
    console.log(orderInfo);
    return orderInfo;
  },
  onLoad(){
    var self = this;
    
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          name: res.userInfo.name
        })
      }
    }),

    /**
     * 发起请求获取订单列表信息
     */
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              header: {
                "Content-Type": "application/json"
              },
              url: 
'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/orderHistory',
              method: 'POST',
              data: {
                code: res.code
              },
              success: function (res) {
                //console.log(res.data.orders);
                var orders = self.getOrder(res.data.orders);
                //console.log(orders);
                self.setData({
                  orders: orders
                })

                
              },
              fail: function (res) {

              }
            })
          } else {

          }
        }
      });
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
    self.onLoad()
  },
  /**
   * 发起支付请求
   */
  payOrders(option){
    /* */
    let js_code = ""
    var that = this
    const order_id = option.currentTarget.dataset.order_id


    
    wx.login({
      success: function (res) {


        if (res.code) {

          //发起网络请求
          wx.request({
            header: {
              "Content-Type": "application/json"
            },
            url: 
'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/orderByOrderId',
            method: 'POST',
            data: {
              code: res.code,
              // total: 1, // 分，乘以100,
              // total: that.data.total * 100, // 分，乘以100,
              order_id: order_id,
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


    /* */

  },

  callPayRequest(res) {
    console.log(res.data)
    let that = this;
    wx.requestPayment(
      {
        'timeStamp': res.data.timeStamp.toString(),
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': 'MD5',
        'paySign': res.data.paySign,
        'success': function (res) {

          that.onLoad()
        },
        'fail': function (res) {

          console.log(res);

          wx.showModal({
            title: '提示',
            content: '支付失败',
            showCancel: false
          })
          that.onLoad()

        },
        'complete': function (res) {

        }
      })
  },


})
