<template>
	<view style="background-color: #fff;">
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">所有消费</block>
		</cu-custom>

		<view class="cu-form-group" style="position: fixed;z-index: 99; width: 100%;">
			<view class="title">日期选择</view>
			<picker mode="date" :value="date" start="2015-09-01" end="2050-09-01" @change="DateChange">
				<view class="picker">
					{{date}}
				</view>
			</picker>
		</view>
		<view style="width: 2px;height: 100rpx;background-color: #0081FF;">
		</view>
		<view class="cu-timeline  animation-slide-bottom" v-for="(item,index) in list" :key="item._id" :style="[{animationDelay: (index%10 + 1)*0.1 + 's'}]">
			<!-- <view v-for="(item,index) in list" :key="item._id"> -->
			<view class="cu-time" v-if="list[index].day!==list[index-1].day">{{item.year}}-{{item.month}}-{{item.day}}</view>
			<view class="cu-item">
				<view class="content">
					<view class="cu-capsule radius">
						<view class="cu-tag bg-cyan">{{item.hour.toString().padStart(2,'0')}}:{{item.minutes.toString().padStart(2,'0')}}</view>
						<view class="cu-tag line-cyan">￥{{item.money.padStart(3,'&nbsp;')}}</view>
						<view class="" style="padding-left: 30rpx;">
							{{item.title}}
						</view>
					</view>
					<view class="margin-top">{{item.conetnt}}</view><br>
					<view class='cu-tag light bg-purple margin-top'>{{item.tag}}</view>
				</view>
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
				list: [],
				skip: 0,
				loadModal: false,
				date: '未选择',
				limit: false
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		methods: {
			getlist() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
					_openid: this.openid
				}).orderBy('year', 'desc')
					.orderBy('month', 'desc')
					.orderBy('day', 'desc').limit(10).get().then((res) => {
						console.log(res)
						this.list = res.data
					})
			},
			LoadModal(e) {
				this.loadModal = true;
				setTimeout(() => {
					this.loadModal = false;
				}, 2000)
			},
			DateChange(e) {
				wx.pageScrollTo({
					scrollTop: 0
				})
				this.limit = true
				this.date = e.detail.value
				this.skip = 0
				let query = e.detail.value.split('-')
				console.log(query)
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
						year: +query[0],
						month: +query[1],
						day: +query[2],
						_openid: this.openid
					}).orderBy('year', 'desc')
					.orderBy('month', 'desc')
					.orderBy('day', 'desc').limit(10).get().then((res) => {
						console.log(res)
						this.list = res.data
						// this.loadModal = false;
					})
			},
		},
		onReachBottom() {
			let step
			if (!this.limit) {
				this.LoadModal()
				this.skip++
				step = this.skip * 10
				console.log(('bbb'))
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
					_openid: this.openid
				}).orderBy('year', 'desc')
					.orderBy('month', 'desc')
					.orderBy('day', 'desc').skip(step).limit(10).get().then((res) => {
						console.log(res)
						this.list.push(...res.data)
						this.loadModal = false;
					})
			} else {
				this.LoadModal()
				this.skip++
				step = this.skip * 10
				let query = this.date.split('-')
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
						year: +query[0],
						month: +query[1],
						day: +query[2],
						_openid: this.openid
					}).orderBy('year', 'desc')
					.orderBy('month', 'desc')
					.orderBy('day', 'desc').skip(step).limit(10).get().then((res) => {
						console.log(res)
						this.list.push(...res.data)
						this.loadModal = false;
					})
			}

		},

		onLoad() {
			this.getlist()
		},
	}
</script>

<style>
@import "/colorui/animation.css";
</style>
