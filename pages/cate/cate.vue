<template>
	<view class="viewport">
		<!-- 搜索框 -->
		<view class="search">
			<search></search>
		</view>
		<!-- 分类 -->
		<view class="categories">
			<!-- 左侧：一级分类 -->
			<scroll-view class="primary" scroll-y>
				<view class="item" v-for="(item, index) in list" :key="item.category_id"
					:class="{ active: index === activeIndex }" @click="changeIndex(index)">
					{{ item.name }}
				</view>
			</scroll-view>
			<!-- 右侧：二级分类 -->
			<scroll-view class="secondary" scroll-y>
				<!-- 内容区域 -->
				<view class="panel">
					<view class="section">
						<view class="goods" v-for="goods in subList" :key="goods.category_id" hover-class="none">
							<image class="image" :src="goods.image.preview_url"></image>
							<view class="name ellipsis">{{ goods.name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>



<script>
	// 导入网络请求函数
	// import request from '@/utils/request';

	export default {
		// 页面数据
		data() {
			return {
				// 一级分类列表
				list: [],
				// 当前页面选中一级分类（默认选中第一个）
				activeIndex: 0,
			};
		},
		computed: {
			// 当前选中子分类
			subList() {
				return this.list[this.activeIndex]?.children || []
			}

		},
		onLoad(options) {
			// 发起获取分类数据请求
			this.getCategoryData()
		},
		methods: {
			// 获取分类数据
			async getCategoryData() {
				console.log('获取分类页数据')
				const categoryPageRes = await this.request.get('/category/list')
				console.log('categoryPageRes', categoryPageRes)
				// 设置页面数据
				this.list = categoryPageRes.data.list
			},
			changeIndex(i) {
				this.activeIndex = i
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		overflow: hidden;
	}

	.viewport {
		height: 100%;
		display: flex;
		flex-direction: column;
	}



	.icon-search {
		&::before {
			margin-right: 10rpx;
		}
	}

	/* 分类 */
	.categories {
		flex: 1;
		min-height: 400rpx;
		display: flex;
	}

	/* 一级分类 */
	.primary {
		overflow: hidden;
		width: 180rpx;
		flex: none;
		background-color: #f6f6f6;

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 96rpx;
			font-size: 26rpx;
			color: #595c63;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				left: 42rpx;
				bottom: 0;
				width: 96rpx;
				border-top: 1rpx solid #e3e4e7;
			}
		}

		.active {
			background-color: #fff;
			color: #fa2209;
			// &::before {
			// 	content: '';
			// 	position: absolute;
			// 	left: 0;
			// 	top: 0;
			// 	width: 8rpx;
			// 	height: 100%;
			// 	background-color: #27ba9b;
			// }
		}
	}

	.primary .item:last-child::after,
	.primary .active::after {
		display: none;
	}

	/* 二级分类 */
	.secondary {
		background-color: #fff;

		.carousel {
			height: 200rpx;
			margin: 0 30rpx 20rpx;
			border-radius: 4rpx;
			overflow: hidden;
		}

		.panel {
			margin: 0 30rpx 0rpx;
		}

		.title {
			height: 60rpx;
			line-height: 60rpx;
			color: #333;
			font-size: 28rpx;
			border-bottom: 1rpx solid #f7f7f8;

			.more {
				float: right;
				padding-left: 20rpx;
				font-size: 24rpx;
				color: #999;
			}
		}

		.more {
			&::after {
				font-family: 'erabbit' !important;
				content: '\e6c2';
			}
		}

		.section {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx 0;

			.goods {
				width: 150rpx;
				margin: 0rpx 30rpx 20rpx 0;

				&:nth-child(3n) {
					margin-right: 0;
				}

				image {
					width: 150rpx;
					height: 150rpx;
				}

				.name {
					padding: 5rpx;
					font-size: 22rpx;
					color: #333;
					text-align: center;
				}

				.price {
					padding: 5rpx;
					font-size: 18rpx;
					color: #cf4444;
				}

				.number {
					font-size: 24rpx;
					margin-left: 2rpx;
				}
			}
		}
	}
</style>