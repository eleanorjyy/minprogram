// page/component/new-pages/user/address/address.js
Page({
  data:{
    address:{
      name:'',
      phone:'',
      detail:''
    }
  },
  onLoad(){
    var self = this;
    
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
    })
  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.name && value.phone && value.detail){
      wx.setStorage({
        key: 'address',
        data: value,
        success(){
          wx.navigateBack();
        }
      })

      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              header: {
                "Content-Type": "application/json"
              },
              url: 
'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/updateUserInfo',
              method: 'POST',
              data: {
                code: res.code,
                name: value.name,
                telephone: value.phone,
                address: value.detail
              },
              success: function (res) {
                
              },
              fail: function (res) {

              }
            })
          } else {

          }
        }
      });

    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  }
})