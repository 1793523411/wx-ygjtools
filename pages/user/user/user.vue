<template>
	<view style="overflow: scroll;width: 100%;height: 100vh;">
		<view class="padding animation-slide-top">
			<view class="bg-white">
				<view class="flex solid-bottom padding justify-start">
					<!-- <view class="cu-avatar xl round margin-left" style="{background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);}"></view> -->
					<view class="cu-avatar xl round margin-left" :style="{backgroundImage:avator}"></view>

					<view class=" text-xl padding" style="margin-left: 30rpx;">
						<text class="text-black">{{userInfo.userInfo.nickName}}</text><br>
						<view class="text-gray" style="font-size: xx-small;">{{userInfo.userInfo.city}}
							{{!userInfo.userInfo.gender?'女':'男'}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']"> -->
		<view class="cu-list menu card-menu">
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/sort/sort" open-type="navigate">
					<text class="cuIcon-list text-yellow"></text>
					<text class="text-grey">管理分类</text>
				</navigator>
			</view>
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/sortanlize/sortanlize" open-type="navigate">
					<text class="cuIcon-sort text-mauve"></text>
					<text class="text-grey">分类统计</text>
				</navigator>
			</view>
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/anylize/anylize" open-type="navigate">
					<text class="cuIcon-rankfill text-mauve"></text>
					<text class="text-grey">数据分析</text>
				</navigator>
			</view>
			<view class="cu-item animation-scale-up" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-emojiflashfill text-pink"></text>
					<text class="text-grey">其他用户消费情况</text>
				</view>
				<view class="action animation-scale-up">
					<navigator url="/pages/user/otheruser/otheruser" open-type="navigate">
						<view class="cu-avatar-group">
							<view class="cu-avatar round sm" v-for="(item,index) in usersimg" :key="index" :style="'background-image:url('+item+');'"></view>
						</view>

						<text class="text-grey text-sm">{{usersize}}</text>
					</navigator>
				</view>
			</view>

			<view class="cu-item animation-scale-up">
				<view class="content">
					<text class="cuIcon-tagfill text-red  margin-right-xs"></text>
					<text class="text-grey">主要消费</text>
				</view>
				<view class="action">
					<view class="cu-tag round bg-orange light">{{sortMost[0].name !== undefined ? sortMost[0].name: '无'}}</view>
					<view class="cu-tag round bg-olive light">{{sortMost[1].name !== undefined ? sortMost[1].name: '无'}}</view>
					<view class="cu-tag round bg-blue light">{{sortMost[2].name !== undefined ? sortMost[2].name: '无'}}</view>
				</view>
			</view>
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/look/look" open-type="navigate">
					<text class="cuIcon-rechargefill text-olive"></text>
					<text class="text-grey">一些有趣的事</text>
				</navigator>
			</view>
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/chat/chat" open-type="navigate">
					<text class="cuIcon-commentfill text-blue"></text>
					<text class="text-grey">留言板</text>
				</navigator>
			</view>	
			<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/info/info" open-type="navigate">
					<text class="cuIcon-discoverfill text-orange"></text>
					<text class="text-grey">小程序信息</text>
				</navigator>
			</view>		<view class="cu-item arrow animation-scale-up">
				<navigator class="content" hover-class="none" url="/pages/user/history/history" open-type="navigate">
					<text class="cuIcon-timefill text-olive"></text>
					<text class="text-grey">开发记录😀</text>
				</navigator>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		name: "user",
		data() {
			return {

			};
		},
		props: {
			sortMost:Array,
			usersimg:Array,
			usersize:String
		},
		// computed:{
		//     ...mapState(['company'])
		// },
		computed: {
			...mapState(['userInfo', 'signature']),
			avator: function() {
				return `url(${this.userInfo.userInfo.avatarUrl})`
			}
			//    mapState({
			// 	userInfo,
			// 	signature
			// })
		},
		methods: {
			onChange: function() {
				console.log(this.userInfo.userInfo)
				console.log(this.userInfo.signature)
				// this.$store.commit('change', 'jk');//通过 store.commit 方法触发状态变更
			},
			back() {
				uni.navigateBack({
					url: '/pages/user/sort/sort'
				})
			},
			upload() {
				uni.chooseImage({
					success(res) {
						console.log(res)
						wx.cloud.uploadFile({
							cloudPath: "poster/abc.jpg",
							filePath: res.tempFilePaths[0]
						}).then(res => {
							console.log(res)
						})
					}
				})
			},
			toSort(){
				uni.navigateTo({
					
				})
			},
		},
		onShow() {
			// this.avator = `url(${this.userInfo.userInfo.avatarUrl})`
			console.log(`url(${this.userInfo.userInfo.avatarUrl})`)
		},
		onLoad() {
		}
	}
</script>

<style>
@import "/colorui/animation.css";
</style>
