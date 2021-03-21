<template>
	<view style="width: 100%;height: 100vh;position: fixed;">
		<view class="bg-img bg-mask flex align-center" style="background-image: url('https://wx-xly-1301545895.cos.ap-beijing.myqcloud.com/wx-login.jpg');height: 100%;">
			<view class="center">
				<view class="padding center2">
					<view class="cu-avatar xl round margin-left" :style="{backgroundImage:avator}"></view>
					<!-- https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg -->
				</view>
				<view class="padding flex flex-direction" style="padding-right: 10rpx;">
					<button class="cu-btn bg-grey lg" open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">登录</button>
				</view>
			</view>
			<view class="" style="color: #FFFFFF;position: fixed;bottom: 200rpx;font-size: large;left: 30rpx;padding: 15rpx;">
				该小程序用于帮助用户记录日常的消费情况<br>登录后在该小程序中记录自己的消费记录
			</view>
			<br>
			<view class="">
				
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
		data() {
			return {
				avator:"url('https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg')"
			};
		},
		// computed:{
		//     ...mapState(['userInfo','signature'])
		// },
		methods: {
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					lang: 'zh_CN',
					success: function(infoRes) {
						_this.avator = `url(${infoRes.userInfo.avatarUrl})`
						console.log(infoRes)
						console.log(infoRes.signature)
						_this.$store.commit('login', {
							userInfo: infoRes.userInfo,
							signature: infoRes.signature
						});
						console.log('成功')
						uni.navigateTo({
							url: '/pages/home/home'
						});

						let user = {
							userInfo: infoRes.userInfo,
							signature: infoRes.signature
						}

						//数据库操作

						wx.cloud.callFunction({
							name: "adduser",
							data: {
								userInfo: user,
							}
						}).then(res => {
							console.log(res)
							// db.collection('todo').where({
							// 	_openid: this.data._openid,
							// 	day: date.getDate(),
							// 	remove: false
							// }).get().then(res => {
							// 	this.setData({
							// 		todos: res.data
							// 	})
							// 	//  console.log(this.data.todos)
							// })
						})
						// let nickName = infoRes.userInfo.nickName; //昵称
						// let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						// try {
						// 	uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
						// 	_this.updateUserInfo();
						// } catch (e) {}
					},
					fail(res) {}
				});
			}, //登录
			toUser() {
				console.log('1111')
				uni.navigateTo({
					url: '/pages/home/home'
				});
			}
		},
		onLoad() { //默认加载
		wx.cloud.callFunction({
			name:"getOpenid"
		}).then(res => {
			console.log('+++++++')
			console.log(res.result.openid)
			this.$store.commit('setOpenid', res.result.openid);
		})
			let db = wx.cloud.database();
			const users = db.collection('users')
			this.wxGetUserInfo()
		}
	}
</script>

<style>
	.center {
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0)
	}

	.cente {
		position: absolute;
	}
</style>
