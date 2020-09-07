<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">管理分类</block>
		</cu-custom>
		<view class="qiun-columns">
			<view class="qiun-charts">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<view class="cu-bar bg-white">
			<view class='action'>
				<text class='text-blue'></text>所有分类(点击进行更多操作)
			</view>
		</view>
		<view class='padding-sm flex flex-wrap'>
			<view class="padding-xs animation-slide-bottom" v-for="(item,index) in tag" :key="item._id" :style="[{animationDelay: (index + 1)*0.1 + 's'}]">
				<view class="padding-xs" v-for="(color,index) in ColorList" :key="index" v-if="index===0">
					<view class='cu-tag' :class="'line-' + ColorList[Math.floor(Math.random()*ColorList.length )-1].name" @click="showModalb('bottomModal',item._id)"
					 data-target="bottomModal">{{item.tag}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="cu-tag" :class="color">
			{{ColorList[Math.floor(Math.random()*ColorList.length )-1].name}}
		</view> -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green" @tap="remove">确定</view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<view class="padding-xl">
					删除点击的标签？🤪
				</view>
			</view>
		</view>
		<view class="addSort" @tap="showModal" data-target="Modal">
			<view class="cuIcon-add pos">
			</view>
		</view>
		

		<!-- 		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="text-orange "></text> 添加标签
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @tap="showModal" data-target="Modal">点我添加</button>
			</view>
		</view> -->
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" style="z-index: 99;">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">输入标签名</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">标签名</view>
					<input placeholder="输入内容" name="input" @input="onKeyInput"></input>
				</view>
				<button class="cu-btn bg-green lg" style="width: 100%;" @click="addSort">确定</button>
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
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaWord = null;
	export default {
		data() {
			return {
				loadModal: false,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				ColorList: this.ColorList,
				modalName: null,
				inputValue: '',
				tag: [],
				currentId: "",
				color: 'line-red'
				// color: 'line-' + this.ColorList[Math.floor(Math.random() * ColorList.length) - 1].name
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		methods: {
			toJSON() {

			},
			getServerData() {

				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const sort = db.collection('sort')
				sort.where({
					_openid: this.openid
				}).get().then(res => {
					// console.log(res.data)
					// console.log(tmp)
					let wordArr = []
					res.data.forEach(item => {
						let random = (Math.ceil(Math.random() * 10) + 1) * 4
						console.log(random)
						let tmp = {
							name: item.tag,
							textSize: random < 15 ? 15 : random
						}
						wordArr.push(tmp)
					})
					console.log(wordArr)
					let Pie = {
						series: []
					};
					Pie.series = wordArr
					_self.showPie("canvasPie", Pie);
				})
			},

			showPie(canvasId, chartData) {
				canvaWord = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'word',
					background: '#000000',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						word: {
							type: 'normal'
						}
					}
				});
			},
			touchPie(e) {
				canvaWord.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			addSort(e) {
				if (!this.inputValue) {
					this.modalName = null
					return
				}
				this.loadModal = true;
				let tag = this.inputValue
				wx.cloud.callFunction({
					name: "addsort",
					data: {
						tag: tag,
					}
				}).then(res => {
					console.log(res)
					this.modalName = null
					this.loadModal = false;
					this.gettag()
					this.getServerData()
				}, err => {
					console.log((err))
				})

			},
			gettag() {
				this.loadModal = true;
				let db = wx.cloud.database();
				const sort = db.collection('sort')
				sort.where({
					_openid: this.openid
				}).get().then((res) => {
					this.tag = res.data
					console.log(this.tag)
					this.loadModal = false;
				})
			},
			remove() {
				this.loadModal = true;
				console.log(this.currentId)
				// let db = wx.cloud.database();
				// const sort = db.collection('sort')
				// sort.doc(this.currentId).remove({
				// 	success: function(res) {
				// 		console.log(res)
				// 		setTimeout(this.gettag(),2000)
				// 	}
				// })
				wx.cloud.callFunction({
					name: "delsort",
					data: {
						id: this.currentId,
					}
				}).then(res => {
					console.log(res)
					this.modalName = null
					this.loadModal = false;
					this.gettag()
					this.getServerData()
				}, err => {
					console.log((err))
				})
			},
			onKeyInput: function(event) {
				this.inputValue = event.target.value
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			showModalb(e, id) {
				this.currentId = id
				this.modalName = e
				console.log(id)
			},
			hideModal(e) {
				this.modalName = null
			},
		},
		onLoad() { //默认加载
			this.gettag()
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
			console.log(this.ColorList)
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

	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
