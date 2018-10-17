import Vue from 'vue'
import Router from 'vue-router'

import GoodsList from '../views/GoodsList.vue'
import Cart from '../components/cart.vue'
import Address from '../views/Address.vue'
import Order from '../views/OrderConfirm.vue'
import orderSuccess from '../views/OrderSuccess.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      name:'GoodsList',
      component:GoodsList
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    },
    {
      path:'/address',
      name:'address',
      component:Address
    },
    {
      path:'/order',
      name:'order',
      component:Order
    },
    {
      path:'/orderSuccess',
      name:'orderSuccess',
      component:orderSuccess
    }
  ]
})
