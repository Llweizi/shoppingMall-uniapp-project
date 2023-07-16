// ajax.js

// 引入 uni-ajax 模块
import ajax from '@/uni_modules/u-ajax'
import store from '@/store'

// 创建请求实例
const instance = ajax.create({
	// 初始配置
	baseURL: 'http://cba.itlike.com/public/index.php?s=/api/'
})

// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		// 打开加载动画
		uni.showLoading({
			title: '加载中...',
			mask: true,
		})
		// 在发送请求前做些什么
		const {
			token
		} = store.state.user.userInfo
		// console.log('tk:', token, config)
		// 平台标识
		config.header['platform'] = 'MP-WEIXIN'
		// config.header['platform'] = 'H5'
		if (token) {
			config.header['Access-Token'] = token
		}
		return config
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
instance.interceptors.response.use(
	response => {
		uni.hideLoading();
		// 对响应数据做些什么
		// console.log(1, response)
		if (response.data.status === 401) {
			uni.showModal({
				title: '温馨提示',
				content: '此时此刻需要您登录喔~',
				// showCancel: false,
				confirmText: "去登录",
				cancelText: "再逛会",
				success: res => {
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/login/login"
						})
					}
				}
			})
		}
		if (response.data.status === 500) {
			uni.showToast({
				title: '服务器错误！'
			})
		}
		return response.data
	},
	error => {
		uni.hideLoading();
		// 对响应错误做些什么
		return Promise.reject(error)
	}
)

// 导出 create 创建后的实例
export default instance