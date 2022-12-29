import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/',
    name: '首页',
    component: () => import('../layout'),
    redirect: '/mechanism',
    children: [
      {
        path: '/mechanism',
        name: 'mechanism',
        component: () => import('@/views/mechanism/index.vue')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
