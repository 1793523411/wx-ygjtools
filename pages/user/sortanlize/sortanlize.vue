<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>
			<block slot="content">分类统计</block>
		</cu-custom>

		<view class="qiun-columns">
			<view class="qiun-charts">
				<view class="cu-bar bg-white animation-slide-right">
					<view class="action">
						<text class="text-green"></text>
						<text>按天统计</text>
					</view>
				</view>
				<view class="cu-form-group animation-slide-left">
					<view class="title">日期选择</view>
					<picker mode="date" :value="date" start="2015-09-01" end="2050-09-01" @change="DateChange">
						<view class="picker">
							{{date===undefined?'今天':date}}
						</view>
					</picker>
				</view>
				<canvas canvas-id="canvasRadar" id="canvasRadar" class="charts"></canvas>

				<view class="cu-bar bg-white margin-top animation-slide-right">
					<view class="action">
						<text class="text-green"></text>
						<text>全部分类统计</text>
					</view>
				</view>
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
				<view class="cu-bar bg-white margin-top animation-slide-left">
					<view class="action">
						<text class="text-green"></text>
						<text>按月统计({{month}}月)</text>
					</view>

				</view>
				<view class="cu-form-group">
					<!-- <view class="title">普通选择</view>
					<picker @change="PickerChange" :value="index" :range="picker">
						<view class="picker">
							{{index>-1?picker[index]:'禁止换行，超出容器部分会以 ... 方式截断'}}
						</view>
					</picker> -->
				</view>
				<canvas canvas-id="canvasPie2" id="canvasPie2" class="charts" @touchstart="touchPie2"></canvas>

			</view>
		</view>

	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaPie = null;
	var canvaPie2 = null;
	var canvaRadar = null;
	export default {
		data() {
			return {
				date: '未选择',
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				index: -1,
				picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
				month: 0
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			toJSON() {

			},
			PickerChange(e) {
				this.index = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
				let query = e.detail.value.split('-')
				let db = wx.cloud.database();
				const _ = db.command
				const tagDayMoney = db.collection('tagDayMoney')
				tagDayMoney.where({
					year: +query[0],
					month: +query[1],
					day: _.or(+query[2], +query[2] - 1),
					_openid: this.openid
				}).get().then(res => {
					console.log(res.data)
					if (res.data.length === 0) {
						let Radar = {
							categories: [],
							series: []
						};
						Radar.categories = []
						Radar.series = []
						_self.showRadar("canvasRadar", Radar);
					} else if (res.data.length === 1) {
						if (res.data[0].day === +query[2]) {
							let tmpkey1 = Object.keys(res.data[0].money)
							let tmpvalue1 = Object.values(res.data[0].money)

							let Radar = {
								categories: [],
								series: []
							};
							Radar.categories = tmpkey1
							Radar.series = [{
								name: '前一天(无)',
								data: [],
								"color": "#e54d42"
							}, {
								name: '当前',
								data: tmpvalue1,
								"color": "#39b54a"
							}]
							_self.showRadar("canvasRadar", Radar);
						} else {
							let tmpkey2 = Object.keys(res.data[0].money)
							let tmpvalue2 = Object.values(res.data[0].money)

							let Radar = {
								categories: [],
								series: []
							};
							Radar.categories = tmpkey2
							Radar.series = [{
								name: '前一天',
								data: tmpvalue2,
								"color": "#e54d42"
							}, {
								name: '当前(无)',
								data: [],
								"color": "#39b54a"
							}]
							_self.showRadar("canvasRadar", Radar);
						}

					} else if (res.data.length === 2) {
						let tmpkey1 = Object.keys(res.data[0].money)
						let tmpvalue1 = Object.values(res.data[0].money)
						// console.log(tmpkey1)
						// console.log(tmpvalue1)
						let tmpkey2 = Object.keys(res.data[1].money)
						let tmpvalue2 = Object.values(res.data[1].money)


						let unionSet = Array.from(new Set([...tmpkey1, ...tmpkey2]));
						// console.log(unionSet)

						let tmpkey11 = []
						let tmpvalue11 = []
						let tmpkey22 = []
						let tmpvalue22 = []
						for (let i = 0; i < unionSet.length; i++) {
							if (!tmpkey1.includes(unionSet[i])) {
								tmpkey11.push(unionSet[i])
								tmpvalue11.push(1)
							}else{
								// console.log(res.data[0].money[unionSet[i]])
								tmpkey11.push(unionSet[i])
								tmpvalue11.push(res.data[0].money[unionSet[i]])
							}
							if (!tmpkey2.includes(unionSet[i])) {
								tmpkey22.push(unionSet[i])
								tmpvalue22.push(1)
							}else{
								// console.log(res.data[0].money[unionSet[i]])
								tmpkey22.push(unionSet[i])
								tmpvalue22.push(res.data[1].money[unionSet[i]])
							}
						}
						let Radar = {
							categories: [],
							series: []
						};
						Radar.categories = tmpkey11
						Radar.series = [{
							name: '当前',
							data: tmpvalue22,
							"color": "#e54d42"
						}, {
							name: '前一天',
							data: tmpvalue11,
							"color": "#39b54a"
						}]
						_self.showRadar("canvasRadar", Radar);
					}

				})
			},
			getServerData() {
				let db = wx.cloud.database();
				const _ = db.command
				const tagMoney = db.collection('tagMoney')
				tagMoney.where({
					_openid: this.openid
				}).get().then(res => {
					// console.log(res.data[0])
					let tmp = Object.entries(res.data[0].money)
					// console.log(tmp)
					for (let i = 0; i < tmp.length; i++) {
						let tmpObj = {
							name: tmp[i][0],
							data: tmp[i][1]
						}
						tmp[i] = tmpObj
					}
					// console.log(tmp)
					let Pie = {
						series: []
					};
					Pie.series = tmp
					_self.showPie("canvasPie", Pie);
				})

				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				const tagMonthMoney = db.collection('tagMonthMoney')
				tagMonthMoney.where({
					year: year,
					month: month,
					_openid: this.openid
				}).get().then(res => {
					// console.log(res.data[0])
					this.month = res.data[0].month
					let tmp = Object.entries(res.data[0].money)
					// console.log(tmp)
					for (let i = 0; i < tmp.length; i++) {
						let tmpObj = {
							name: tmp[i][0],
							data: tmp[i][1]
						}
						tmp[i] = tmpObj
					}
					// console.log(tmp)
					let Pie2 = {
						series: []
					};
					Pie2.series = tmp
					_self.showPie2("canvasPie2", Pie2);
				})

				let day = myDate.getDate(); //获取当前日(1-31)
				const tagDayMoney = db.collection('tagDayMoney')
				tagDayMoney.where({
					year: year,
					month: month,
					day: _.or(day, day - 1),
					_openid: this.openid
				}).get().then(res => {
					console.log(res.data)
					if (res.data.length === 0) {
						let Radar = {
							categories: [],
							series: []
						};
						Radar.categories = []
						Radar.series = []
						_self.showRadar("canvasRadar", Radar);
					} else if (res.data.length === 1) {
						if (res.data[0].day === +query[2]) {
							let tmpkey1 = Object.keys(res.data[0].money)
							let tmpvalue1 = Object.values(res.data[0].money)
					
							let Radar = {
								categories: [],
								series: []
							};
							Radar.categories = tmpkey1
							Radar.series = [{
								name: '前一天(无)',
								data: [],
								"color": "#e54d42"
							}, {
								name: '当前',
								data: tmpvalue1,
								"color": "#39b54a"
							}]
							_self.showRadar("canvasRadar", Radar);
						} else {
							let tmpkey2 = Object.keys(res.data[0].money)
							let tmpvalue2 = Object.values(res.data[0].money)
					
							let Radar = {
								categories: [],
								series: []
							};
							Radar.categories = tmpkey2
							Radar.series = [{
								name: '前一天',
								data: tmpvalue2,
								"color": "#e54d42"
							}, {
								name: '当前(无)',
								data: [],
								"color": "#39b54a"
							}]
							_self.showRadar("canvasRadar", Radar);
						}
					
					} else if (res.data.length === 2) {
						let tmpkey1 = Object.keys(res.data[0].money)
						let tmpvalue1 = Object.values(res.data[0].money)
						// console.log(tmpkey1)
						// console.log(tmpvalue1)
						let tmpkey2 = Object.keys(res.data[1].money)
						let tmpvalue2 = Object.values(res.data[1].money)
					
					
						let unionSet = Array.from(new Set([...tmpkey1, ...tmpkey2]));
						// console.log(unionSet)
					
						let tmpkey11 = []
						let tmpvalue11 = []
						let tmpkey22 = []
						let tmpvalue22 = []
						for (let i = 0; i < unionSet.length; i++) {
							if (!tmpkey1.includes(unionSet[i])) {
								tmpkey11.push(unionSet[i])
								tmpvalue11.push(1)
							}else{
								// console.log(res.data[0].money[unionSet[i]])
								tmpkey11.push(unionSet[i])
								tmpvalue11.push(res.data[0].money[unionSet[i]])
							}
							if (!tmpkey2.includes(unionSet[i])) {
								tmpkey22.push(unionSet[i])
								tmpvalue22.push(1)
							}else{
								// console.log(res.data[0].money[unionSet[i]])
								tmpkey22.push(unionSet[i])
								tmpvalue22.push(res.data[1].money[unionSet[i]])
							}
						}
						let Radar = {
							categories: [],
							series: []
						};
						Radar.categories = tmpkey11
						Radar.series = [{
							name: '当前',
							data: tmpvalue22,
							"color": "#e54d42"
						}, {
							name: '前一天',
							data: tmpvalue11,
							"color": "#39b54a"
						}]
						_self.showRadar("canvasRadar", Radar);
					}
				})

			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			showPie2(canvasId, chartData) {
				canvaPie2 = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			showRadar(canvasId, chartData) {
				canvaRadar = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'radar',
					fontSize: 11,
					legend: {
						show: true
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					dataLabel: true,
					categories: chartData.categories,
					series: chartData.series,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						radar: {
							max: 200 //雷达数值的最大值
						}
					}
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			touchPie2(e) {
				canvaPie2.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
		}
	}
</script>

<style>
	@import "/colorui/animation.css";
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
