<template>
	<view class="goods-detail-container">
		<!-- 商品详情 -->
		<view class="goods-detail" v-if="goodsDetail">
			<swiper class="swiper-box" :indicator-dots="true" :autoplay="true" :circular="true"
				@change="handleSwiperItemChange">
				<swiper-item v-for="(item, index) in goodsDetail.goods_images" :key="index">
					<view class="slide-image">
						<image class="image" mode="widthFix" :src="item.preview_url" />
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper-count">
				<text>{{ currentIndex }}</text>
				<text>/</text>
				<text>{{ goodsDetail.goods_images.length }}</text>
			</view>
		</view>
		<!-- 商品介绍 -->
		<view class="content" v-html="goodsDetail.content"></view>
		<!-- 底部操作 -->
		<uni-goods-nav class="detail-btn" :fill="true" :options="options" :button-group="customButtonGroup" @click="onClick"
			@buttonClick="buttonClick" />
	</view>
</template>

<script>
	// import request from '@/utils/request';
	export default {
		data() {
			return {
				// 商品Id
				goodsId: null,
				// 商品详情
				goodsDetail: null,
				// 轮播图索引
				currentIndex: 1,
				options: [{
					icon: 'shop',
					text: '首页',
					infoBackgroundColor: '#007aff',
					infoColor: "#f5f5f5"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
						color: '#fff'
					}
				],
				customButtonGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #60F3FF, #088FEB)',
						color: '#fff'
					}
				],
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			console.log('详情页', options);
			this.goodsId = options.id;
			this.getDetailAndCartTotal();
		},

		methods: {
			async getDetailAndCartTotal() {
				const res = await Promise.all([
					this.request.get('goods/detail', {
						goodsId: this.goodsId
					}),
					this.request.get('cart/total'),
				]);
				console.log('详情和购物车数量', res);
				this.goodsDetail = res[0].data.detail;
				// 显示购物车商品数量
				console.log('num:', res[1].data.cartTotal)
				this.options[1].info = res[1].data.cartTotal
			},

			handleSwiperItemChange(item) {
				// console.log(item);
				this.currentIndex = item.detail.current + 1;
			},

			onClick(e) {
				console.log(e)
				if (e.index === 0) {
					uni.switchTab({
						url: '/pages/index/index'
					})

				} else {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			async buttonClick(e) {
				console.log(e)
				if (e.index === 0) {
					// 加入购物车
					const res = await this.request.post('/cart/add', {
						"goodsId": this.goodsDetail.goods_id,
						"goodsSkuId": "0",
						"goodsNum": 1
					})
					if (res.status === 200) {
						uni.showToast({
							title: '加入成功！'
						})
						this.options[1].info++
					}

				}
			}
		},
	};
</script>

<style lang="scss" scoped>
	.goods-detail-container {

		// 商品详情
		.goods-detail {
			position: relative;

			.swiper-box {
				height: 300px;

				.image {
					width: 100%;
				}
			}

			.swiper-count {
				position: absolute;
				top: 250px;
				right: 30px;
				background-color: gray;
				color: white;
				border-radius: 16px;
				padding: 0 8px;
			}
		}


		.detail-btn {
			width: 100%;
			position: fixed;
			bottom: 0;
		}

	}
</style>