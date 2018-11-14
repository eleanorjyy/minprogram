// page/component/new-pages/cart/cart.js
const app = getApp()
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    }
  },
  onShow() {

    this.setData({
      hasList: true,
      // carts:[
      //   { id: 1, title: 'active enzyme exfoliator', image:'http://www.rttpay.com/tst/商铺首页sample/热门品牌/Josh Rosebrook/active enzyme exfoliator图2.jpg',num:4,price:123.99,selected:true},
      //   { id: 2, title: 'Firming_Concentrate', image:'http://www.rttpay.com/tst/商铺首页sample/热门品牌/Ama.la/抗氧advanced Firming_Concentrate.jpg',num:1,price:688.99,selected:true}
      // ]

      carts: app.globalData.carts
    });
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = app.globalData.carts;
    // // 删减数量
    app.globalData.totalNum -= app.globalData.carts[index].num;
    app.globalData.carts.splice(index,1);
    this.setData({
      carts: app.globalData.carts
    });
    if (!app.globalData.carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = app.globalData.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
      app.globalData.carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = app.globalData.carts[index].num;
    num = num + 1;
    carts[index].num = num;
    app.globalData.carts[index].num = num;
    app.globalData.totalNum += 1;
    this.setData({
      carts: app.globalData.carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = app.globalData.carts[index].num;
    
    if(num <= 1){
      return false;
    }
    num = num - 1;
    app.globalData.totalNum -= 1;
    carts[index].num = num;
    app.globalData.carts[index].num = num;
    this.setData({
      carts: app.globalData.carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})