<template>
	<view class="box">
		<!-- 账号信息 -->
		<view class="profile">
			<image class="bg" src="../../static/background/user-header2.png" mode=""></image>
			<view class="info">
				<image class="tx" src="../../static/default-avatar.png" mode=""></image>
				<view class="account">
					<text>{{user.mobile || '--'}}</text>
					<text>{{user.nick_name || '--'}}</text>
				</view>
			</view>
		</view>
		<!-- 退出登录 -->
		<view class="ot" v-if="isLogin">
			<button class="logout" @click="logout">退出</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {}
			}
		},
		onShow() {
			this.getUser()
		},
		computed: {
			isLogin() {
				return this.$store.state.user.userInfo.token
			},
		},
		methods: {
			async getUser() {
				const res = await this.request.get('/user/info')
				console.log('用户信息：', res.data.userInfo)
				if (res.status === 200) {
					this.user = res.data.userInfo
				}
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确认退出智慧商城吗，亲？',
					success: async (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.$store.commit('user/delToken')
							this.user = {}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.profile {
		position: relative;
		height: 260rpx;
		display: flex;
		padding: 30rpx;
		align-items: center;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.info {
			position: relative;
			display: flex;
			z-index: 100;

			.tx {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100rpx;
				margin-right: 20rpx;
			}


			.account {
				display: flex;
				flex-direction: column;
				color: #c59a46;

				text:first-child {
					font-size: 34rpx;
					font-weight: 800;
				}

				text:last-child {
					margin-top: 14rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.ot {
		padding: 20rpx;

		.logout {
			margin-top: 30rpx;
		}
	}
</style>