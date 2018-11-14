const app = getApp()
Page({
    data: {
        category: [],
        detail:[],
        curIndex: 0,
        isScroll: true,
        toView: ''
    },

    onLoad: function (option){
      var self = this;
      self.setData({
        curIndex: app.globalData.cate_id,
        toView: app.globalData.cate,
      })



      wx.request({
        url:    
'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/getAllBoxes',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          // "Content-Type": "application/json"
        },
        method: "get",
        success(res) {
          
          console.log(res.data.ea_boxes);
          self.setData({
             boxs:res.data.ea_boxes
            

            // toView: res.data.category[0].name
          })
        }
      })

    },
    onReady: function (option){
        var self = this;
    },

    onPageScroll: function (option) { 

    },

    mytouchmove: function(e){
      var self = this;

      self.setData({
        curIndex: e.currentTarget.dataset.index - 1,
        // toView: app.globalData.cate,
      })
    },

    mytouchend: function(e) {
      var self = this;

      self.setData({
        curIndex: e.currentTarget.dataset.index -1,
        // toView: app.globalData.cate,
      })

    },

    toDetails: function (event) {
      wx.redirectTo({
        url: '../details/details?id=' + event.currentTarget.dataset.id
      })
    },
    
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })

      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      // setTimeout(function () {
      //   self.setData({
      //     isScroll: false
      //   })
      // },1)
        
    }
    
})