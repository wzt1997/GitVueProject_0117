import ElementUI from 'element-ui' //新添加
import 'element-ui/lib/theme-chalk/index.css' //新添加，避免后期打包样式不同，要放在import App from './App';之前
import Vue from 'vue'
import App from './App'
import router from './router'

//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//axios挂载请求拦截器
axios.interceptors.request.use(config => {
    //console.log(config)
    //根据文档，为config添加Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
    //在最后必须return config
})

Vue.use(ElementUI)  //新添加
Vue.config.productionTip = false
Vue.prototype.$http = axios

//将Message组件挂载到Vue的原型上
//Vue.prototype.$message = ElementUI.Message

 
/* eslint-disable no-new */
new Vue({
 el: '#app',
 router,
 components: { App },
 template: '<App/>'
})