<template>
	<view class="diy-search">
		<uni-search-bar @confirm="handleSearchClick" :focus="true" :radius="100" :cancelButton="false"
			v-model="searchValue">
		</uni-search-bar>
	</view>
</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				searchValue: ''
			};
		},
		methods: {
			handleSearchClick() {
				console.log('跳转到搜索页面')
			}
		}
	}
</script>

<style lang="scss">
	.diy-search {
		background: #f1f1f2;
		// padding: 10rpx 0;
		font-size: 26rpx;
	}
</style>