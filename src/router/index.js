import Vue from 'vue'
import VueRouter from 'vue-router'
import Ebook from '../Ebook.vue'
import '../assets/font/iconfont.css'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    component: Ebook
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
