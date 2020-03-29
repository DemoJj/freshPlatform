import Vue from 'vue'
import Router from 'vue-router'
import ShoppingMall from '@/components/pages/shop/ShoppingMall'
import Register from '@/components/pages/user/Register' //注册页面
import Login from '@/components/pages/user/Login'
import Goods from '@/components/pages/goods/Goods'
import CategoryList from '@/components/pages/goods/CategoryList'
import Cart from '@/components/pages/cart/Cart'
import Main from '@/components/pages/Main'
import City from '@/components/pages/shop/City'
import Member from '@/components/pages/user/member'
import FinishCart from '@/components/pages/cart/FinishCart'
import OrderDetail from "@/components/pages/user/OrderDetail";
import SearchBox from '@/components/pages/shop/SearchBox.vue';
import Comments from '@/components/pages/user/Comments';
import CommentEdit from '@/components/pages/user/CommentEdit';


Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path:'/',
      redirect:'/Main'
    },
    {
      path: '/Main',
      component: Main,
      children: [{
          path: '/',
          name: 'ShoppingMall',
          component: ShoppingMall,
          meta:{active:0}
        },
        {
          path: '/categoryList',
          name: 'CategoryList',
          component: CategoryList,
          meta:{active:1}
        },
        {
          path: '/cart',
          name: 'Cart',
          component: Cart,
          meta:{active:2}
        },
        {
          path: '/member',
          name: 'Member',
          component: Member,
          meta:{active:3}
        }
      ]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/city',
      name: 'City',
      component: City
    },
    {
      path:'/finishCart',
      name:'FinishCart',
      component:FinishCart
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/searchBox',
      name: 'SearchBox',
      component: SearchBox
    },
    {
      path: '/comments',
      name: 'Comments',
      component: Comments
    },
    {
      path: '/commentEdit',
      name: 'CommentEdit',
      component: CommentEdit
    },
  ]
})
