<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@font-face {
		font-family: 'erabbit';
		src: url('https://at.alicdn.com/t/c/font_4009193_lnbhmo3yos.woff?t=1681201348304') format('woff'),
			url('https://at.alicdn.com/t/c/font_4009193_lnbhmo3yos.ttf?t=1681201348304') format('truetype'),
			url('https://at.alicdn.com/t/c/font_4009193_lnbhmo3yos.svg?t=1681201348304#erabbit') format('svg');
	}

	page {
		background: #fafafa;
	}
</style>