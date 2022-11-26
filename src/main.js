import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//把接口地址全局挂载在vue原型上
import api from "@/api/index.js";
Vue.prototype.$api = api

import '@/assets/font_icon/iconfont.css'


Vue.config.productionTip = false
new Vue({
    router,
    store,
    // 全局事件总线
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
    render: h => h(App)
}).$mount('#app')