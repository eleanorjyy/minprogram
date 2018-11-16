const app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    boxes:[],
    
  },


  createNonceStr: function () {
    return Math.random().toString(36).substr(2, 15)
  },
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },

  // 吊起支付
  callPayRequest(res){
    wx.requestPayment(
      {
        'timeStamp': res.data.timeStamp.toString(),
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': 'MD5',
        'paySign': res.data.paySign,
        'success': function (res) { 
          console.log('success' + res);
        },
        'fail': function (res) {
          console.log('fail' + res)
         },
        'complete': function (res) { 
          
        }
      })
  },
  toDetails: function(event){

    wx.redirectTo({
      url: 'details/details?id=' + event.currentTarget.dataset.id
    })
  },

  toBoxDetails: function(event){

    wx.redirectTo({
      url: 'BoxDetail/BoxDetail?id=' + event.currentTarget.dataset.id
    })
  },

  // toCategory: function(event){
  //   console.log(event);
  //   app.globalData.cate_id = event.currentTarget.dataset.id - 1;
  //   app.globalData.cate = event.currentTarget.dataset.cate;

  //   wx.switchTab({
  //     url: 'details/details',

  //     success: function(e){
  //       var page = getCurrentPages().pop();
  //       page.onLoad();

  //     }
  //   })
  // },
  //获取box info
  getAllbox(){
    let self = this;
    wx.request({
            url:
              'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/getAllBoxes',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              // "Content-Type": "application/json"
            },
            method: "get",
            success(res) {

              // console.log(res.data.ea_boxes);
              self.setData({
                boxes: res.data.ea_boxes


                // toView: res.data.category[0].name
              })
            }
          })
  },

  // 获取code后通过后端获取用户信息
  getUserInfo(){

    let self = this;
    

    wx.login({
      success: function (res) {

        //console.log(res.code);
        
        app.globalData.openid = res.code;
        
        if (res.code) {

          wx.request({
            header: {
              "Content-Type": "application/json"
            },
            url: 'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/userInfo',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res) {
              
              if(res.data.ev_has_info) {
                console.log(res.data.ev_user_info.original.user[0]);
                var user = res.data.ev_user_info.original.user[0];
                let address_data = {
                  detail: user.address,
                  name: user.name,
                  phone: user.telephone,
                }
                wx.setStorage({
                  key: 'address',
                  data: address_data,
                  hasAddress: true,
                  success(res_storage) {

                  }
                })

              }
              
            },
            fail: function (res) {

            }
          })
        } else {

        }
      }
    });

  },
  onShareAppMessage: function () {

    return {

    title: '甜满箱',

    // desc: '',

    path: '/page/component/index'

    }
  },
  getCode(){
    let js_code = ""
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            }, 
            url: 
'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/smallAppLoginCheck',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function(res){
              that.callPayRequest(res)
            },
            fail: function(res){
            }
          })
        } else {

        }
      }
    });


  },

  onLoad(){
    

    var self = this;

    //get data from back-end
    self.getUserInfo()
    self.getAllbox()

    // app.globalData.carts = [];
    wx.request({
      url: 
'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/homePage',
      method: "POST",
      success(res) {
        self.setData({
          list: res.data.data
        })
      }
    })
  
    
    

  },

})