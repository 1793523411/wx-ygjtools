<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">留言板</block>
		</cu-custom>

		<view class="cu-card dynamic">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar comment solids-top">
					<view class="cu-item animation-slide-bottom" v-for="(item ,index) in chatList" :key="item._id" :style="[{animationDelay: (index%10 + 1)*0.1 + 's'}]">
						<view class="cu-avatar round" :style="'background-image:url('+item.avturl+');'"></view>
						<view class="content">
							<view class="text-grey">{{item.nickName}}</view>
							<view class="text-gray text-content text-df">
								{{item.city}}
								{{!item.gender?'女':'男'}}
							</view>
							<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
								<view class="flex">
									<view class="flex-sub">{{item.msg}}</view>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">{{item.year}}年{{item.month}}月{{item.day}}日
									{{item.hour.toString().padStart(2,'0')}}:{{item.minutes.toString().padStart(2,'0')}}</view>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>

		<view class="addSort" @tap="showModal" data-target="Modal">
			<view class="cuIcon-add pos">
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="z-index: 99;">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<textarea maxlength="100" @input="textareaAInput" :value="value" ></textarea>
				</view>
				<button class="cu-btn bg-blue lg" style="width: 100%;" @click="addSort">确定</button>
			</view>
		</view>

		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				inputValue: '',
				loadModal: false,
				chatList: [],
				skip: 0,
				value:''
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			textareaAInput: function(event) {
				// this.inputValue = event.target.value
				this.value = event.target.value
			},
			hideModal(e) {
				this.modalName = null
			},
			addSort() {
				let db = wx.cloud.database();
				const users = db.collection('users')
				users.where({
					_openid: this.openid
				}).get().then(res => {
					let myDate = new Date();
					let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
					let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
					let day = myDate.getDate(); //获取当前日(1-31)
					let hour = myDate.getHours(); //获取当前小时数(0-23)
					let minutes = myDate.getMinutes(); //获取当前分钟数(0-59)
					console.log(res.data[0].userInfo)
					let tmp = res.data[0].userInfo
					wx.cloud.callFunction({
						name: 'addChart',
						data: {
							avturl: tmp.avatarUrl,
							nickName: tmp.nickName,
							city: tmp.city,
							gender: tmp.gender,
							msg: this.value,
							year: year,
							month: month,
							day: day,
							hour: hour,
							minutes: minutes
						}
					}).then(res => {
						this.getChart()
						wx.pageScrollTo({
							scrollTop: 0
						})
						this.skip = 0
					})
					this.hideModal()
					this.value = ''
				})


			},
			getChart() {
				this.loadModal = true
				let db = wx.cloud.database();
				const chat = db.collection('chat')
				chat.orderBy('year', 'desc')
					.orderBy('month', 'desc')
					.orderBy('day', 'desc')
					.orderBy('hour', 'desc')
					.orderBy('minutes', 'desc')
					.limit(10).get().then((res) => {
						console.log(res)
						this.chatList = res.data
						this.loadModal = false
					})
			}
		},
		onReachBottom() {
			let step
			this.loadModal = true
			this.skip++
			step = this.skip * 10
			let db = wx.cloud.database();
			const chat = db.collection('chat')
			chat.orderBy('year', 'desc')
				.orderBy('month', 'desc')
				.orderBy('day', 'desc')
				.orderBy('hour', 'desc')
				.orderBy('minutes', 'desc')
				.skip(step)
				.limit(10).get().then((res) => {
					// if(res.data.length === 0){this.skip--}
					console.log(res)
					this.chatList.push(...res.data)
					this.loadModal = false
				})
		},
		onLoad() {
			this.getChart()
		}
	}
</script>

<style>
	@import "/colorui/animation.css";
	.addSort {
		position: fixed;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		bottom: 30rpx;
		right: 30rpx;
		background-color: #0081FF;
		font-size: 80rpx;
		color: #aaffff;
	}

	.pos {
		margin-left: 10rpx;
		margin-top: 2rpx;
	}
</style>
