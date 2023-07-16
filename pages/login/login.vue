<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<view class="title">
				<text>手机号登录</text>
			</view>
			<view class="sub-title">
				<text>未注册的手机号登录后将自动注册</text>
			</view>
		</view>

		<!-- 表单 -->
		<view class="login-form">
			<uni-forms ref="fm" :rules="rules" :modelValue="formData">
				<uni-forms-item class="form-item" name="mobile">
					<uni-easyinput :clearable="false" class="form-item--input" v-model="formData.mobile" placeholder="请输入手机" />
				</uni-forms-item>
				<uni-forms-item class="form-item" name="smsCode">
					<uni-easyinput :clearable="false" class="form-item--input" v-model="formData.smsCode" placeholder="请输入验证码" />
					<view class="form-item--parts">
						<view class="captcha-sms">
							<text class="activate">获取验证码</text>
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<!-- 登录按钮 -->
			<view class="login-button" @click="submitLogin">
				<text>登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},

		data() {
			return {
				formData: {
					// 手机号
					mobile: '15800000000',
					// 短信验证码
					smsCode: '246810',
				},
				rules: {
					mobile: {
						rules: [{
								required: true,
								errorMessage: '手机号不能为空'
							},
							// pattern属性说明			
							// 在小程序中，json 中不能使用正则对象，如：/^\S+?@\S+?\.\S+?$/，使用正则对象会被微信序列化，导致正则失效。
							// 所以建议统一使用字符串的方式来使用正则 ，如'^\\S+?@\\S+?\\.\\S+?$' ，需要注意 \ 需要使用 \\ 来转译。
							{
								pattern: '^(?:(?:\\+|00)86)?1[3-9]\\d{9}$',
								errorMessage: '请输入正确的手机号'
							}
						]
					},
					smsCode: {
						rules: [{
							required: true,
							errorMessage: '验证码不能为空'
						}]
					}
				},
			}
		},

		methods: {

			// 确认登录
			submitLogin() {

				this.$refs.fm.validate().then(async rt => {
					console.log('success', rt);
					const res = await this.request.post('/passport/login', {
						form: {
							...this.formData,
							// 先写死
							isParty: false,
							partyData: {},
						}
					})
					console.log('login:', res)
					if (res.status === 200) {
						uni.showToast({
							title: '登录成功！'
						})
						// 存储token
						this.$store.commit('user/setToken', res.data)
						// 跳转回原页面
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				}).catch(err => {
					console.log('err', err);
				})

			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 100rpx 60rpx;
		min-height: 100vh;
		background-color: #fff;
	}

	// 页面头部
	.header {
		margin-bottom: 60rpx;

		.title {
			color: #191919;
			font-size: 54rpx;
		}

		.sub-title {
			margin-top: 20rpx;
			color: #b3b3b3;
			font-size: 28rpx;
		}
	}

	// 输入框元素
	::v-deep .uni-forms-item__content {
		display: flex;
		padding: 18rpx;
		border-bottom: 1rpx solid #f3f1f2;
		margin-bottom: 30rpx;
		height: 96rpx;

		.is-input-border {
			border: 0;
		}

		.uni-easyinput__content-input {
			font-size: 28rpx;
			letter-spacing: 1rpx;
			flex: 1;
			height: 100%;
			border: none;
		}

		&--parts {
			min-width: 100rpx;
			height: 100%;
		}

		// 图形验证码
		.captcha {
			height: 100%;

			.image {
				display: block;
				width: 192rpx;
				height: 100%;
			}
		}

		// 短信验证码
		.captcha-sms {
			font-size: 28rpx;
			line-height: 50rpx;
			padding-right: 20rpx;

			.activate {
				color: #cea26a;
			}

			.un-activate {
				color: #9e9e9e;
			}
		}
	}


	// 登录按钮
	.login-button {
		width: 100%;
		height: 86rpx;
		margin-top: 80rpx;
		background: linear-gradient(to right, #ecb53c, #ff9211);
		color: #fff;
		border-radius: 80rpx;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
		letter-spacing: 5rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>