import Vue from 'vue'
import VueRouter from 'vue-router'
var Home =  () => import('../views/Home.vue')
var Categorys =  () => import('../views/Categorys.vue')
var Article =  () => import('../views/Article.vue')
var PersonInfo =  () => import('../views/PersonInfo.vue')
var ShopCart =  () => import('../views/ShopCart.vue')
var Items =  () => import('../views/Items.vue')
var ConfirmOrder =  () => import('../views/ConfirmOrder.vue')
var GoodItemInfo =  () => import('../views/GoodItemInfo.vue')
var OrderDetail =  () => import('../views/OrderDetail.vue')

var OrderMessage =  () => import('../components/OrderMessage.vue')
var EditInfo =  () => import('../components/EditInfo.vue')
var Locations =  () => import('../components/Locations.vue')
var Collects =  () => import('../components/Collects.vue')




// import Home from '../views/Home.vue'
// import Categorys from '../views/Categorys.vue'
// import Article from '../views/Article.vue'
// import PersonInfo from '../views/PersonInfo.vue'
// import ShopCart from '../views/ShopCart.vue'
// import Items from '../views/Items.vue'
// import ConfirmOrder from '../views/ConfirmOrder.vue'
// import GoodItemInfo from '../views/GoodItemInfo.vue'
// import EditInfo from '../components/EditInfo.vue'
// import OrderMessage from '../components/OrderMessage.vue'
// import Locations from '../components/Locations.vue'
// import Collects from '../components/Collects.vue'
// import OrderDetail from '../views/OrderDetail.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      keepAlive:true,
    }
  },
  {
    path: '/categorys',
    name: 'Categorys',
    component: Categorys,
    meta: {
      title: '商品分类',
    }
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    meta: {
      title: '文章分类',
    }
  },
  {
    path: '/personInfo',
    name: 'PersonInfo',
    component: PersonInfo,
    meta: {
      title: '个人信息',
      requireLogin:true,
    },
    children:[
      { path: 'collects', name: 'Collects', component: Collects,
        meta: {
          title: '个人信息-个人收藏',
          requireLogin:true,
        },
      },
      { path: 'orderMessage', name: 'OrderMessage', component: OrderMessage,
        meta: {
          title: '个人信息-订单信息',
          requireLogin:true,
        },
      },
      { path: 'locations', name: 'Locations', component: Locations,
        meta: {
          title: '个人信息-地址管理',
          requireLogin:true,
        },
      },
      { path: 'editInfo', name: 'EditInfo', component: EditInfo,
        meta: {
          title: '个人信息-账户信息',
          requireLogin:true,
        },
      },
      { path: '', name: 'abs', component: EditInfo,
        meta: {
          title: '个人信息-账户信息',
          requireLogin:true,
        },
      },
    ]
  },
  {
    path: '/shopCart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: '购物车',
      requireLogin:true,
    }
  },
  {
    path: '/items/:id',
    name: 'Items',
    component: Items,
    meta:{
      title:'详情页'
    }
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: ConfirmOrder,
    meta:{
      title: '确认订单',
      requireLogin:true,
    }
  },
  {
    path: '/goodItemInfo',
    name: 'GoodItemInfo',
    component: GoodItemInfo,
    meta:{
      title: '好物推荐'
    }
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title: '订单详情'
    }
  }
]
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to,from,saveTop){
      if(saveTop){
          return saveTop;
      }else{
        if (from.meta.keepAlive) {
          from.meta.savedPosition = document.body.scrollTop
        }
          return {x:0,y:0}
        }
    },
  base: process.env.BASE_URL,
  routes,
})

export default router
