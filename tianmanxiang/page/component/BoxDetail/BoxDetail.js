// page/component/BoxDetail/BoxDetail.js
const app = getApp()
Page({
  data:{
    
    
    box: {},
    products:[],
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    },
    
    getBoxInfo(boxdata,boxid){
      //let self = this;
      if(boxdata != []){

        for(var i=0;i<boxdata.length;i++){
          // console.log(boxdata[i].bid);
          // console.log(boxid);
          if(boxdata[i].bid == boxid){
            var box = boxdata[i];
            return box;
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
      
    })
     
    wx.request({
            url:
              'https://www.cmapi.ca/cm_miniprogram/dev/public/index.php/api/sboxmanage/v1/getAllBoxes',
            
            method: "get",
            success(res) {

              // console.log(res.data.ea_boxes);
              var tap_box = self.getBoxInfo(res.data.ea_boxes,option.boxid);
              var products = tap_box.products;
              // console.log(tap_box);
              self.setData({
                
                box:tap_box,
                products:products



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