export default {
  userData : function () {
    return{
      title: '交易管理',
      data: [
        {
          title: '订单信息',
          img1: require('../../assets/img/order1.png'),
          img2: require('../../assets/img/order2.png'),
          route:'/personInfo/orderMessage'
        },
        {
          title: '收货地址',
          img1: require('../../assets/img/location1.png'),
          img2: require('../../assets/img/location2.png'),
          route:'/personInfo/locations',
        },
      ]
    }
  },
  manageData: function () {
    return{
      title: '账户管理',
      data: [
        {
          title: '账户信息',
          img1: require('../../assets/img/account1.png'),
          img2: require('../../assets/img/account2.png'),
          route:'/personInfo/editInfo',
        },
        {
          title: '我的收藏',
          img1: require('../../assets/img/collect1.png'),
          img2: require('../../assets/img/collect2.png'),
          route:'/personInfo/collects',
        },
        {
          title: '社交信息',
          img1: require('../../assets/img/social1.png'),
          img2: require('../../assets/img/social2.png'),
          route:'/personInfo'
        },
      ]
    }
  }
}
