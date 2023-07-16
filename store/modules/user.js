const user_key = 'zh-user'
const user = {
	namespaced: true,
	state: {
		// 用户信息
		userInfo: uni.getStorageSync(user_key) || {
			token: '',
			userId: null
		}
	},

	mutations: {
		setToken: (state, value) => {
			state.userInfo = value
			uni.setStorageSync(user_key, value)
		},
		delToken(state) {
			state.userInfo = {
				token: '',
				userId: null
			}
			uni.removeStorageSync(user_key)
		}
	}
}

export default user