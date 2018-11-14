// page/component/details/details.js
const app = getApp()
Page({
  data:{
    boxes:[],
    bid:0,
    goods: {},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    },
    
    getProductInfo(boxdata,boxid,pid){
      //let self = this;
      if(boxdata != []){

        for(var i=0;i<boxdata.length;i++){
          console.log(boxdata[i].bid);
          console.log(boxid);
          if(boxdata[i].bid == boxid){
            
            for(var x=0;x<boxdata[i].products.length;x++){
              if(boxdata[i].products[x].pid == pid){
                
                var product = boxdata[i].products[x];
                return product
              }
            }
          }
        }
      }
  },
  
  onLoad: function (option) {
    var self = this;
    console.log(option);
    if(app.globalData.totalNum){
      self.setData({
        hasCarts: true
      })
    }
    self.setData({
      totalNum: app.globalData.totalNum,
      bid:option.id,
    })
     
    wx.request({
            url:
              'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/getAllBoxes',
            
            method: "get",
            success(res) {

              console.log(res.data.ea_boxes);
              var tap_product = self.getProductInfo(res.data.ea_boxes,option.boxid,option.id);

              console.log(tap_product);
              self.setData({
                boxes:res.data.ea_boxes,
                goods:tap_product



                // toView: res.data.category[0].name
              })
            }
          })

          
        

  

    
  },

  



//     wx.request({
//       url: 
// 'https://www.cmapi.ca/rtt_miniprogram/prod/index.php/api/hazelway/v1/product/' + option.id,
//       method: "POST",
//       success(res) {

//         self.setData({
//           goods: res.data.data
//         })
//       }
//     })
//   },

  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },


  minusCount() {
    let num = this.data.num;
    if(num > 1){
      num--;
      this.setData({
        num: num
      })
    }
    
  },

  addToCart: function (option) {
    const self = this;
    const num = this.data.num;
    let total = app.globalData.totalNum;

    let gCart = app.globalData.carts;

    let arrIndex = gCart.findIndex(x => x.id === option.currentTarget.dataset.id);
    if(arrIndex != -1){
      gCart[arrIndex].num += this.data.num;
    }
    else{
      gCart.push(option.currentTarget.dataset);
    }

    self.setData({
      show: true,
    })
    
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

    app.globalData.totalNum = num + total;
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})