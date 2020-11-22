import signin from '@/components/signin'
import Dashboard from '@/components/Dashboard'
import products from '@/components/products'
import order from '@/components/order'
import discount from '@/components/discount'
import coupons from '@/components/coupons'
import customerOrder from '@/components/customerOrder'
import customerOrder2 from '@/components/customerOrder2'
import cart from '@/components/cart'
import checkOut from '@/components/checkOut'
import Vue from 'vue'
import Router from 'vue-router'



Vue.use(Router)


export default new Router({
  routes: [
    {
      path : '/',
      redirect : 'signin'
    },
    {
      path : '/signin',
      name : 'signin',
      component : signin
    },
    {
      path : '/admin',
      name : 'Dashboard',
      component : Dashboard,
      children : [
        {
          path : 'products',
          name : 'products',
          component : products,
          meta : {requiresAuth : true}
        },
        {
          path : 'order',
          name : 'order',
          component : order,
          meta : {requiresAuth : true}
        },
        {
          path : 'discount',
          name : 'discount',
          component : discount,
          meta : {requiresAuth : true}
        },
        {
          path : 'coupons',
          name : 'coupons',
          component : coupons,
          meta : {requiresAuth : true}
        }
      ]
    },
    {
      path : '/',
      name : 'Dashboard',
      component : Dashboard,
      children : [
        {
          path : 'customerOrder',
          name : 'customerOrder',
          component : customerOrder
        },
        {
          path : 'customerOrder2',
          name : 'customerOrder2',
          component : customerOrder2
        },
        {
          path : 'cart',
          name : 'cart',
          component : cart
        },
        {
          path : 'checkOut',
          name : 'checkOut',
          component : checkOut
        }
      ]
    }
  ]
})
