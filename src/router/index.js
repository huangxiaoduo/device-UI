// 解决打包后路由不显示的问题。在没有后端配合的情况下路由模式为history，页面不会重新加载，应该改为hash模式。hash路由为：createWebHashHistory
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;