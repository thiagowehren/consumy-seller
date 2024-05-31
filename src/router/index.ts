import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { Auth } from '@/auth'

function redirectIfGuest(){
  const auth = new Auth()
  if(!auth.isLoggedIn()){
    return '/login'
  }
}

function redirectIfAuthorized(){
  const auth = new Auth()
  if(auth.isLoggedIn()){
    return '/'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      beforeEnter: redirectIfGuest,
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: redirectIfAuthorized,
      component: () => import('@/components/LogIn.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      beforeEnter: redirectIfAuthorized,
      component: () => import('@/components/SignUp.vue')
    }
  ]
})

export default router
