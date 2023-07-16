<template>
	<view class="container">
		<!-- 搜索跳转组件 -->
		<search />
		<!-- 轮播图 -->
		<view class="diy-banner">
			<!-- 图片轮播 -->
			<swiper class="swiper-box" indicator-dots="true" autoplay="true" :duration="800" :circular="true"
				:interval="1000">
				<swiper-item v-for="item in swiperImageList" :key="item.imgUrl">
					<image mode="widthFix" class="slide-image" :src="item.imgUrl" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 店铺公告 -->
		<view class="diy-notice">
			<uni-notice-bar showIcon single scrollable :text="notice"></uni-notice-bar>
		</view>
		<!-- 导航组 -->
		<view class="nav-list">
			<navigator open-type="switchTab" url="/pages/cate/cate" class="nav-item" v-for="(item, i) in navList" :key="i">
				<image class="image" mode="widthFix" :src="item.imgUrl"></image>
				<view class="item-text oneline-hide">{{item.text}}</view>
			</navigator>
		</view>
		<!-- 广告图片 -->
		<view>
			<image class="ad-image" mode="widthFix" :src="adImageList[0] && adImageList[0].imgUrl" />
		</view>
		<!-- 广告文字 -->
		<view class="adb" v-html="adText">
		</view>
		<!-- 首页商品列表 -->
		<view class="goods-list">
			<navigator :url="`/pages/detail/detail?id=${item.goods_id}`" class="goods-item" v-for="(item, i) in goodsList"
				:key="i">
				<view class="item-left">
					<image class="left-image" mode="widthFix" :src="item.goods_image" />
				</view>
				<view class="item-right">
					<view class="goods_title">{{item.goods_name}}</view>
					<view class="goods_price">{{item.goods_price_min}}</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	// 导入网络请求函数
	// import request from '@/utils/request'

	export default {
		data() {
			return {
				// 轮播图数据
				swiperImageList: [],
				// 店铺公告
				notice: '',
				// 导航数据
				navList: [],
				// 广告图片
				adImageList: [],
				// 广告文字
				adText: '',
				// 首页商品
				goodsList: [],
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 发起获取首页数据请求
			this.getIndexData()
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {},

		methods: {
			// 获取首页数据
			async getIndexData() {
				const res = await this.request.get('page/detail', {
					pageId: 0
				})
				console.log('首页数据：', res.data)
				// 轮播图
				this.swiperImageList = res.data.pageData.items.find(item => item.name === '图片轮播').data
				// 公告
				this.notice = res.data.pageData.items.find(item => item.name === '店铺公告').params.text
				// 导航组
				this.navList = res.data.pageData.items.find(item => item.name === '导航组').data
				// 广告图片
				this.adImageList = res.data.pageData.items.find(item => item.name === '图片').data
				// 广告文字
				this.adText = res.data.pageData.items.find(item => item.name === '富文本').params.content
				// 商品列表
				this.goodsList = res.data.pageData.items.find(item => item.name === '商品组').data
			},
		},

	}
</script>

<style lang="scss" scoped>
	.container {
		color: #333;

		.diy-banner {

			.slide-image {
				width: 100%;
			}

		}

		.nav-list {
			display: flex;
			flex-wrap: wrap;

			.nav-item {
				width: 20%;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 8rpx;
				margin-bottom: 20rpx;

				.image {
					width: 88rpx;
					height: 88rpx;
				}

				.item-text {
					font-size: 26rpx;
				}
			}
		}

		.ad-image {
			width: 100%;
		}

		.adb {
			padding: 20rpx;
			background-color: #fff;
			margin-bottom: 8rpx;
		}

		.goods-list {

			.goods-item {
				display: flex;
				margin-bottom: 20rpx;
				background-color: #fff;
				padding: 20rpx;

				.item-left {
					flex: 2;
					margin-right: 20rpx;

					.left-image {
						width: 100%;
						// 解决图片基线对其的bug
						vertical-align: middle;
					}
				}

				.item-right {
					flex: 3;

					.goods_title {
						display: -webkit-box;
						word-break: break-all;
						text-overflow: ellipsis;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						line-height: 1.3;
						white-space: normal;
						color: #484848;
						font-size: 26rpx;
					}

					.goods_price {
						margin-top: 20rpx;
						color: #f03c3c;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>