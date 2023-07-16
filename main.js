import App from './App'
import store from './store'
import search from '@/components/search/search.vue'
import request from '@/utils/request';
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

// 注册全局组件
Vue.component('search', search)
// 注册全局方法
Vue.prototype.request = request
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif