import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ClientView from '@/views/ClientView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/client/:id',
    name: 'client',
    component: ClientView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
