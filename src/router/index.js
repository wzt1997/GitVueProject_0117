import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import { createContext } from 'vm';
Vue.use(Router)


const router = new Router({
    routes: [
        {
            path:'/',
            redirect:'/login'
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/home',
            component: home,
            //welcome是home的子路由
            redirect:'/welcome',
            children:[
                {
                    path:'/welcome',
                    component: welcome
                },
                {
                    path:'/users',
                    component: users
                },
                {
                    path:'/rights',
                    component: rights
                },
                {
                    path:'/roles',
                    component: roles
                },
                {
                    path:'/categories',
                    component: cate
                },
                {
                    path:'/params',
                    component: params
                }
            ]
        }
    ]
})

//挂在路由导航守卫
router.beforeEach((to,from,next)=>{
    //to 表示要访问的链接
    //from表示从哪个路径跳转而来
    //next是个函数，表示放行; 带参数表示强制跳转

    if(to.path == '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login')
    next()

})

export default router;