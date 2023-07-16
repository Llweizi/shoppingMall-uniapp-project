<template>
	<scroll-view scroll-y class="scroll-view">
		<!-- 已登录: 显示购物车 -->
		<template v-if="isLogin">
			<!-- 购物车列表 -->
			<view class="cart-list" v-if="cartList.length">
				<!-- 优惠提示 -->
				<view class="tips">
					<text class="label">共{{cartList.length}}件商品</text>
				</view>
				<!-- 滑动操作分区 -->
				<uni-swipe-action>
					<!-- 滑动操作项 -->
					<uni-swipe-action-item v-for="(item,i) in cartList" :key="item.goods_id" class="cart-swipe">
						<!-- 商品信息 -->
						<view class="goods">
							<!-- 选中状态 -->
							<text class="checkbox" @click="onChangeSelected(item)" :class="{ checked: item.selected }"></text>
							<navigator :url="`/pages/detail/detail?id=${item.goods_id}`" hover-class="none" class="navigator">
								<image mode="aspectFill" class="picture" :src="item.goods.goods_image"></image>
								<view class="meta">
									<view class="name ellipsis">{{ item.goods.goods_name }}</view>

									<view class="price">{{ item.goods.goods_price_max }}</view>
								</view>
							</navigator>
							<!-- 商品数量 -->
							<view class="count">
								<uni-number-box :min="1" :max="item.goods.stock_total" :value="item.goods_num"
									@change="onChangeCount($event, item)" />
							</view>
						</view>
						<!-- 右侧删除按钮 -->
						<template #right>
							<view class="cart-swipe-right">
								<button @click="onDeleteCart(item)" class="button delete-button">
									删除
								</button>
							</view>
						</template>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<!-- 购物车空状态 -->
			<view class="cart-blank" v-else>
				<text class="text">购物车还是空的，快来挑选好货吧</text>
				<navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
					<button class="button">去首页看看</button>
				</navigator>
			</view>
			<!-- 吸底工具栏 -->
			<view class="toolbar">
				<text class="all" @click="onChangeSelectedAll" :class="{ checked: isSelectedAll }">全选</text>
				<text class="text">合计:</text>
				<text class="amount">{{ selectedCartListMoney }}</text>
				<view class="button-grounp">
					<view class="button payment-button" :class="{ disabled: selectedCartList.length === 0 }">
						去结算({{ selectedCartListCount }})
					</view>
				</view>
			</view>
		</template>
		<!-- 未登录: 提示登录 -->
		<view class="login-blank" v-else>
			<text class="text">登录后可查看购物车中的商品</text>
			<navigator url="/pages/login/login" hover-class="none">
				<button class="button">去登录</button>
			</navigator>
		</view>

	</scroll-view>
</template>


<script>
	// import request from '@/utils/request'
	export default {
		data() {
			return {
				// 购物车列表
				cartList: [],
			};
		},
		onShow() {
			console.log(this.$store.state.user.userInfo.token)
			this.getCartList()
		},
		computed: {
			isLogin() {
				return this.$store.state.user.userInfo.token
			},
			// 0. 计算选中单品列表
			selectedCartList() {
				return this.cartList.filter((v) => v.selected)
			},

			// 1. 计算选中总件数
			selectedCartListCount() {
				return this.selectedCartList.reduce((sum, item) => sum + item.goods_num, 0)
			},

			// 2. 计算选中总金额
			selectedCartListMoney() {
				return this.selectedCartList
					.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_max, 0)
					.toFixed(2)
			},
			// == 全选/反选 ==
			// 3. 计算全选状态
			isSelectedAll() {
				return this.cartList.length && this.cartList.every((v) => v.selected)
			}
		},
		methods: {
			// 获取购物车列表
			async getCartList() {
				const res = await this.request.get('cart/list')
				console.log('购物车列表：', res.data)
				if (res.status === 200) {
					// 设置页面数据
					this.cartList = res.data.list.map(item => {
						item.selected = false
						return item
					})
				}
			},
			// 删除商品
			onDeleteCart(item) {
				console.log(item)
				uni.showModal({
					title: '提示',
					content: '确认删除吗？',
					success: async (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							const res = await this.request.post('/cart/clear', {
								cartIds: [item.id],
							})
							if (res.status === 200) {

								setTimeout(() => {
									uni.showToast({
										title: '删除成功'
									})
								})
								this.getCartList()
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			// 商品数量修改
			async onChangeCount(ev, item) {
				const res = await this.request.post('/cart/update', {
					"goodsId": item.goods_id,
					"goodsSkuId": "0",
					"goodsNum": ev
				})
				if (res.status === 200) {
					item.goods_num = ev
				}
			},
			// 商品单选
			onChangeSelected(item) {
				item.selected = !item.selected
			},
			onChangeSelectedAll() {
				// 全选状态取反
				const _isSelectedAll = !this.isSelectedAll
				// 前端数据更新
				this.cartList.forEach((item) => {
					item.selected = _isSelectedAll
				})
			}
		},
	}
</script>

<style lang="scss">
	// 滚动容器
	.scroll-view {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background-color: #f7f7f8;
	}

	// 购物车列表
	.cart-list {
		padding: 0 20rpx;
		margin-bottom: 120rpx;

		// 优惠提示
		.tips {
			display: flex;
			align-items: center;
			line-height: 1;
			margin: 30rpx 10rpx;
			font-size: 26rpx;
			color: #666;

			.label {
				color: #333;
				padding: 7rpx 15rpx 5rpx;
				border-radius: 4rpx;
				font-size: 24rpx;
				margin-right: 10rpx;
			}
		}

		// 购物车商品
		.goods {
			display: flex;
			padding: 20rpx 20rpx 20rpx 80rpx;
			border-radius: 10rpx;
			background-color: #fff;
			position: relative;

			.navigator {
				display: flex;
			}

			.checkbox {
				position: absolute;
				top: 0;
				left: 0;

				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
				height: 100%;

				&::before {
					content: '\e6cd';
					font-family: 'erabbit' !important;
					font-size: 40rpx;
					color: #444;
				}

				&.checked::before {
					content: '\e6cc';
					color: rgb(250, 34, 9);
				}
			}

			.picture {
				width: 170rpx;
				height: 170rpx;
			}

			.meta {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20rpx;
			}

			.name {
				display: -webkit-box;
				word-break: break-all;
				text-overflow: ellipsis;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				line-height: 1.3;
				white-space: normal;
				font-size: 26rpx;
				color: #444;
			}

			.attrsText {
				line-height: 1.8;
				padding: 0 15rpx;
				font-size: 24rpx;
				align-self: flex-start;
				border-radius: 4rpx;
				color: #888;
				background-color: #f7f7f8;
			}

			.price {
				line-height: 1;
				font-size: 26rpx;
				color: #444;
				margin-bottom: 2rpx;
				color: #cf4444;

				&::before {
					content: '￥';
					font-size: 80%;
				}
			}

			// 商品数量
			.count {
				position: absolute;
				bottom: 20rpx;
				right: 5rpx;

				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 220rpx;
				height: 48rpx;

				.text {
					height: 100%;
					padding: 0 20rpx;
					font-size: 32rpx;
					color: #444;
				}

				.input {
					height: 100%;
					text-align: center;
					border-radius: 4rpx;
					font-size: 24rpx;
					color: #444;
					background-color: #f6f6f6;
				}
			}
		}

		.cart-swipe {
			display: block;
			margin: 20rpx 0;
		}

		.cart-swipe-right {
			display: flex;
			height: 100%;

			.button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 50px;
				padding: 6px;
				line-height: 1.5;
				color: #fff;
				font-size: 26rpx;
				border-radius: 0;
			}

			.delete-button {
				background-color: #cf4444;
			}
		}
	}

	// 空状态
	.cart-blank,
	.login-blank {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 60vh;

		.image {
			width: 400rpx;
			height: 281rpx;
		}

		.text {
			color: #444;
			font-size: 26rpx;
			margin: 20rpx 0;
		}

		.button {
			width: 240rpx !important;
			height: 60rpx;
			line-height: 60rpx;
			margin-top: 20rpx;
			font-size: 26rpx;
			border-radius: 60rpx;
			color: #fff;
			background-color: rgb(250, 34, 9);
		}
	}

	// 吸底工具栏
	.toolbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--window-bottom));
		z-index: 100;

		height: 100rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid #ededed;
		border-bottom: 1rpx solid #ededed;
		background-color: #fff;

		.all {
			margin-left: 25rpx;
			font-size: 14px;
			color: #444;
			display: flex;
			align-items: center;
		}

		.all::before {
			font-family: 'erabbit' !important;
			content: '\e6cd';
			font-size: 40rpx;
			margin-right: 8rpx;
		}

		.checked::before {
			content: '\e6cc';
			color: rgb(250, 34, 9);
		}

		.text {
			margin-right: 8rpx;
			margin-left: 32rpx;
			color: #444;
			font-size: 14px;
		}

		.amount {
			font-size: 20px;
			color: #cf4444;

			.decimal {
				font-size: 12px;
			}

			&::before {
				content: '￥';
				font-size: 12px;
			}
		}

		.button-grounp {
			position: absolute;
			right: 10rpx;
			top: 50%;

			display: flex;
			justify-content: space-between;
			text-align: center;
			line-height: 72rpx;
			font-size: 13px;
			color: #fff;
			transform: translateY(-50%);

			.button {
				width: 240rpx;
				margin: 0 10rpx;
				border-radius: 72rpx;
			}

			.payment-button {
				background-color: #fd1800;

				&.disabled {
					opacity: 0.6;
				}
			}
		}
	}
</style>