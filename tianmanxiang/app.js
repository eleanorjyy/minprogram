import md5 from 'utils/md5.js';
App({
  onLaunch: function () {
    // console.log('App Launch')
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    cate_id: 0,
    cate: '',
    carts:[],
    totalNum: 0,
    return_id: 0,
    openid:'',
  },
  useMD5: function(obj){
    return md5(obj)
  }
})
