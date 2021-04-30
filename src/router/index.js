import Vue from 'vue'
import VueRouter from 'vue-router'
import AppMain from '@/components/AppMain'
import {get} from 'js-cookie'

Vue.use(VueRouter)

//解决重复点击路由报错的问题
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'Home',
    component: AppMain,
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: AppMain,
    children: [
      {
        path: '/login',
        component: () => import('@/views/Login')
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: AppMain,
    children: [
      {
        path: '/register',
        component: () => import('@/views/Register')
      }
    ]
  },
  {
    path: '/note',
    name: 'Note',
    component: AppMain,
    children: [
      {
        path: '/note',
        component: () => import('@/views/Note')
      }
    ]
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: AppMain,
    children: [
      {
        path: '/favorite',
        component: () => import('@/views/Favorite')
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: AppMain,
    children: [
      {
        path: '/profile',
        component: () => import('@/views/Profile/index')
      }
    ]
  },
  {
    path: '/discuss',
    name: 'Discuss',
    component: AppMain,
    children: [
      {
        path: '/discuss',
        component: () => import('@/views/Discuss/index')
      }
    ]
  },
  {
    path: '/course',
    name: 'Course',
    component: AppMain,
    children: [
      {
        path: '/course',
        component: () => import('@/views/Course/index')
      }
    ]
  },
  {
    path: '/404',
    name: 'Error',
    component: AppMain,
    children: [
      {
        path: '/404',
        component: () => import('@/views/Error/404')
      }
    ]
  },
  {
    path: '*',
    redirect: {
      path: "/404",
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  //console.log(to, from)
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }
  if (get('ticket')) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo && userInfo.type !== 1 && to.path === '/course') {
      next('/404')
      return
    }
    next()
  } else {
    next('/login')
  }
})

export default router
