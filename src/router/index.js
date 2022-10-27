import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Gachapon from '../views/PlaySection.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/gachapon',
    name: 'Gachapon',
    component: Gachapon
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
