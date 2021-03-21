<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="false">
			<block slot="content">ygjtools</block>
		</cu-custom>
		<index v-if="PageCur=='index'" :list="list" :totalMoney="totalMoney" :yesteaday="yesteaday" @update="update" @more="getlist"></index>
		<user v-if="PageCur=='user'" :sortMost="sortMost" :usersimg="usersimg" :usersize="usersize"></user>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="index">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/basics' + [PageCur=='index'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='index'?'text-green':'text-gray'">首页</view>
			</view>
			<view class="action text-gray add-action">
				<navigator url="/pages/index/add/add">
					<button class="cu-btn cuIcon-add bg-green shadow"></button>
				</navigator>
			</view>
			<view class="action" @click="NavChange" data-cur="user">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/component' + [PageCur == 'user'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='user'?'text-green':'text-gray'">用户</view>
			</view>
			<view class="cu-load load-modal" v-if="loadModal">
				<!-- <view class="cuIcon-emojifill text-orange"></view> -->
				<image src="/static/logo.png" mode="aspectFit"></image>
				<view class="gray-text">加载中...</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PageCur: 'index',
				list: [],
				totalMoney: 0,
				skip: 0,
				loadModal: false,
				yesteaday: [],
				sortMost: [],
				usersimg: [],
				usersize: 0
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			update() {
				this.setOnedayMoney()
				this.skip--
				let step = this.skip * 10

				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
					year: year,
					month: month,
					day: day,
					_openid: this.openid
				}).orderBy('hour', 'desc').orderBy('minutes', 'desc').skip(step).limit(10).get().then((res) => {
					console.log(res)
					this.list.splice(0 * this.skip, 10, ...res.data)
					this.skip++
					this.setTotalMoney()
					// this.list = res.data
					// this.list.forEach(item => {
					// 	this.totalMoney += +item.money
					// })
				})
			},
			getlist() {
				this.loadModal = true
				console.log('more')
				let step = this.skip * 10
				this.skip++
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const list = db.collection('list')
				list.where({
					year: year,
					month: month,
					day: day,
					_openid: this.openid
				}).orderBy('hour', 'desc').orderBy('minutes', 'desc').skip(step).limit(10).get().then((res) => {
					console.log(res)
					this.list.push(...res.data)
					this.loadModal = false
					// this.list.forEach(item => {
					// 	this.totalMoney += +item.money
					// })
				})
			},
			setTotalMoney() {

				// let skip2 = 0
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)

				wx.cloud.callFunction({
					name: "totalmonry",
					data: {
						year: year,
						month: month,
						day: day,
					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})

				// let db = wx.cloud.database();
				// const list = db.collection('list')
				// list.where({
				// 	year: year,
				// 	month: month,
				// 	day: day
				// }).count().then(res => {
				// 	// console.log('==========' + skip2)
				// 	console.log(res)
				// 	// skip2++
				// 	// if (res.data.length === 0) {
				// 	// 	return
				// 	// }
				// 	for (let i = 0; i < res.total / 20 + 1; i++) {
				// 		list.where({
				// 			year: year,
				// 			month: month,
				// 			day: day
				// 		}).skip(i * 20).limit(10).get().then(res => {
				// 			console.log('+++++++')
				// 			console.log(res)
				// 		})
				// 	}
				// })

			},
			getTotalMoney() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const totalMoney = db.collection('totalMoney')
				totalMoney.where({
					year: year,
					month: month,
					day: day - 1,
					_openid: this.openid
				}).get().then(res => {
					console.log(res)
					this.totalMoney = res.data[0].totalMoney
				})
			},
			setMonthMoney() {
				console.log('调用setMonthMoney')
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)

				wx.cloud.callFunction({
					name: "monthMoney",
					data: {
						year: year,
						month: month,
					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})
			},
			setOnedayMoney() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)

				wx.cloud.callFunction({
					name: "onedayMoney",
					data: {
						year: year,
						month: month,
						day: day,
					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})
			},
			setTagMoney() {
				wx.cloud.callFunction({
					name: "tagMoney",
					data: {

					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})
			},
			setTagMonthMoney() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				wx.cloud.callFunction({
					name: "tagMonthMoney",
					data: {
						year: year,
						month: month,
					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})
			},
			setTagDayMoney() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				wx.cloud.callFunction({
					name: "tagDayMoney",
					data: {
						year: year,
						month: month,
						day: day
					}
				}).then(res => {
					console.log(res)
				}, err => {
					console.log((err))
				})
			},
			getTagDayMoney() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const tagDayMoney = db.collection('tagDayMoney')
				tagDayMoney.where({
					year: year,
					month: month,
					day: day-1,
					_openid: this.openid
				}).get().then(res => {
					let tmp = Object.entries(res.data[0].money)
					console.log(tmp)
					for (let i = 0; i < tmp.length; i++) {
						let tmpObj = {
							name: tmp[i][0],
							data: tmp[i][1]
						}
						tmp[i] = tmpObj
					}
					console.log(tmp)
					tmp.sort((a, b) => b.data - a.data)
					console.log(tmp)
					this.yesteaday = tmp.slice(0, 5)
					console.log(this.yesteaday)
				})
			},
			getSortMost() {
				let db = wx.cloud.database();
				const tagMoney = db.collection('tagMoney')
				tagMoney.where({
					_openid: this.openid
				}).get().then(res => {
					console.log('=================')
					let tmp = Object.entries(res.data[0].money)
					console.log(tmp)
					for (let i = 0; i < tmp.length; i++) {
						let tmpObj = {
							name: tmp[i][0],
							data: tmp[i][1]
						}
						tmp[i] = tmpObj
					}
					console.log(tmp)
					tmp.sort((a, b) => b.data - a.data)
					console.log(tmp)
					this.sortMost = tmp.slice(0, 3)
				})
			},
			getUser() {
				let db = wx.cloud.database();
				const users = db.collection('users')
				users.get().then(res => {
					console.log(res)
					let tmparr = []
					res.data.forEach(item => {
						tmparr.push(item.userInfo.avatarUrl)
					})
					this.usersize = tmparr.length
					this.usersimg = tmparr.slice(0, 4)

				})
			}

		},

		// onReachBottom() {
		// 	console.log('hahah')
		// 	this.getlist()
		// },
		onLoad() {
			console.log("!!!!!" + this.openid)
			if(!this.openid){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
			this.getlist()
			this.setTotalMoney()
			this.getTotalMoney()
			this.setMonthMoney()
			this.setOnedayMoney()
			this.setTagMoney()
			this.setTagMonthMoney()
			this.setTagDayMoney()
			this.getTagDayMoney()
			this.getSortMost()
			this.getUser()
		},
	}
</script>

<style>

</style>
