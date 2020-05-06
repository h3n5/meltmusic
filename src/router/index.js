import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/MainPage',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home/index.vue'),
    children: [
      {
        path: 'MainPage',
        name: 'MainPage',
        component: () => import(/* webpackChunkName: "MainPage" */ '@/views/Home/sidePage/MainPage/index.vue')
      },
      {
        path: 'SearchPage',
        name: 'SearchPage',
        component: () => import(/* webpackChunkName: "SearchPage" */ '@/views/Home/sidePage/SearchPage/index.vue')
      },
      {
        path: 'PlayList/:id',
        props: true,
        name: 'PlayList',
        component: () => import(/* webpackChunkName: "PlayList" */ '@/views/Song/Album/index.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
