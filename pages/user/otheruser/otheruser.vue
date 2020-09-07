<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>
		
			<block slot="content">其他用户消费</block>
		</cu-custom>
			<view class="cu-card case animation-scale-up" v-for="(item,index) in users" :key="index" @click="go(item._openid)">
				<view class="cu-item shadow">
					<view class="image">
						<image :src="'https://ossweb-img.qq.com/images/lol/web201310/skin/big100'+(index%10).toString().padStart(2,'0')+'.jpg'"
						 mode="widthFix"></image>
						<view class="cu-bar bg-shadeBottom"> </view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="'background-image:url('+item.userInfo.avatarUrl+');'"></view>
							<view class="content flex-sub">
								<view class="text-grey">{{item.userInfo.nickName}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.userInfo.city}} {{item.userInfo.gender?'女':'男'}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				users:[]
			}
		},
		methods: {
			getUser(){
				let db = wx.cloud.database();
				const users = db.collection('users')
				users.get().then(res => {
					console.log(res)
					this.users = res.data
				})
			},
			go(id){
				console.log(id)
				// uni.navigateTo({
				// 	url:"../detail/detail?id="+id
				// })
				uni.navigateTo({
					url:"./detail/detail?id="+id
				})
			}
		},
		onLoad() {
			this.getUser()
		}
	}
</script>

<style>
@import "/colorui/animation.css";
</style>
