<template>
	<view style="overflow: scroll;width: 100%;height: 100vh;margin-bottom: 50px;">
		<navigator url="/pages/index/zuori/zuori" open-type="navigate">
			<view class="cu-card article animation-scale-down" :class="isCard?'no-card':''">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut">昨日消费</view>
					</view>
					<hr>
					<view class="content">
						<!-- <view class="circle">
							￥98
						</view> -->
						<view class="padding-sm">
							<view class="bg-gradual-blue padding radius text-center shadow-blur circle">
								<view class="text-bold" style="font-size: x-large;">￥{{totalMoney}}</view>
							</view>
						</view>
						<view class="desc">
							<view class="text-content">
								<view class="cu-tag bg-red light sm round margin-right">￥{{yesteaday[0].name !== undefined ? yesteaday[0].name : '无'}}</view>
								<text>
									￥{{yesteaday[0].data !== undefined ? yesteaday[0].data:'0'}}
								</text><br>
								<view class="cu-tag bg-purple light sm round margin-right">{{yesteaday[1].name !==undefined ? yesteaday[1].name : '无'}}</view>
								<text>
									￥{{yesteaday[1].data !== undefined ? yesteaday[1].data:'0'}}
								</text><br>
								<view class="cu-tag bg-olive light sm round margin-right">{{yesteaday[2].name !== undefined ? yesteaday[2].name : '无'}}</view>
								<text>
									￥{{yesteaday[2].data !== undefined ? yesteaday[2].data:'0'}}
								</text><br>
								<view class="cu-tag bg-mauve light sm round margin-right">{{yesteaday[3].name !== undefined ? yesteaday[3].name : '无'}}</view>
								<text>
									￥{{yesteaday[3].data !== undefined ? yesteaday[3].data:'0'}}
								</text><br>
								<view class="cu-tag bg-cyan light sm round margin-right">{{yesteaday[4].name !== undefined ? yesteaday[4].name : '无'}}</view><text>
									￥{{yesteaday[4].data !== undefined ? yesteaday[4].data:'0'}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</navigator>
		
		<view class="cu-bar bg-white solid-bottom margin-top" style="margin: 0 30rpx;">
			<view class="action">
				<text class=" text-orange "></text> 今日消费情况
			</view>
			<view class="action">
				<!-- 更多 -->
				<navigator url="/pages/index/list/list" open-type="navigate">
					<view class="cuIcon-more"> </view>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu-avatar" style="margin: 30rpx;margin-top: -30rpx; background-color: #fff;">
			<view class="cu-item animation-slide-bottom" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in list" :key="index"
			 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index" :style="[{animationDelay: (index%10 + 1)*0.1 + 's'}]">
				<view class="cu-avatar round lg" ></view>
				<view class="padding-sm cu-avatar round lg">
					<view class="bg-gradual-orange padding radius text-center shadow-blur circle2">
						<view class="text-lg" style="font-size: small;">￥{{item.money.padStart(3,'&nbsp;')}}</view>
					</view>
				</view>
				<view class="content">
					<view class="text-grey">{{item.title}}</view>
					<view class="text-gray text-sm">
						<text class="text-red  margin-right-xs"></text>{{item.conetnt}}</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">{{item.hour.toString().padStart(2,'0')}}:{{item.minutes.toString().padStart(2,'0')}}</view>
					<view class="sm">
						<view class="" v-for="(color,index) in ColorList" :key="index" v-if="index===0">
							<view class='cu-tag' :class="'line-' + ColorList[Math.floor(Math.random()*ColorList.length )-1].name">{{item.tag}}</view>
						</view>
					</view>
				</view>
				<view class="move">
					<!-- <view class="bg-grey">置顶</view> -->
					<view class="bg-red" @click="remoive(item._id)">删除</view>
				</view>
			</view>
		</view>
		<view class="flex flex-direction animation-scale-up" style="margin: 0 30rpx;">
			<button class="cu-btn bg-grey lg" @click="more">加载更多</button>
			<!-- <button class="cu-btn bg-red margin-tb-sm lg">嫣红</button> -->
		</view>
	</view>
</template>

<script>
	export default {
		name: "index",
		data() {
			return {
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				ColorList: this.ColorList
			}
		},
		props: {
			list: Array,
			totalMoney:Number,
			yesteaday:Array
		},
		methods: {
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			remoive(id) {
				wx.cloud.callFunction({
					name: 'dellist',
					data: {
						id: id
					}
				}).then(res => {
					this.$emit("update")
				})
				console.log(id)
			},
			more(){
				this.$emit("more")
			}
		},
	}
</script>

<style>
	@import "/colorui/animation.css";
	.circle {
		text-align: center;
		line-height: 120rpx;
		width: 234rpx;
		height: 175rpx;
		background-image: linear-gradient(#1cbbb4, #0081ff, );
		/* background-color: #1cbbb4; */
		border-radius: 50%;
	}

	.circle2 {
		padding: 23rpx;
		text-align: left;
		line-height: 58rpx;
		width: 150rpx;
		/* min-width: 100rpx;
		max-width: 150px; */
		height: 100rpx;
		/* background-image: linear-gradient(#1cbbb4, #0081ff, ); */
		/* background-color: #1cbbb4; */
		background-color: #fff;
		border-radius: 50%;
	}
	.cu-card.article>.cu-item .content .text-content{
		    height: 7.8em;
	}
</style>
