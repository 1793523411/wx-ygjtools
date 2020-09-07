<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>
			<block slot="content">数据分析</block>
		</cu-custom>

		<view class="qiun-columns">
			<view class="qiun-charts">
				<view class="cu-bar bg-white animation-slide-rights">
					<view class="action">
						<text class="text-green"></text>
						<text>今日消费统计</text>
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
				<canvas canvas-id="canvasColumn2" id="canvasColumn2" class="charts" @touchstart="touchColumn2"></canvas>
				<view class="cu-bar bg-white margin-top animation-slide-right">
					<view class="action">
						<text class="text-green"></text>
						<text>近十天统计</text>
					</view>
				</view>
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
				<view class="cu-bar bg-white margin-top animation-slide-left">
					<view class="action">
						<text class="text-green"></text>
						<text>月消费统计</text>
					</view>
				</view>
				<!-- 				<view class="cu-form-group">
					<view class="title">普通选择</view>
					<picker @change="PickerChange" :value="index" :range="picker">
						<view class="picker">
							{{picker[index]}}
						</view>
					</picker>
				</view> -->
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaColumn = null;
	var canvaColumn2 = null;
	var canvaLineA = null;
	export default {
		data() {
			return {
				date: '未选择',
				// index:0,
				// picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				dayList: [],
				datListMoney: [],
				monthList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				monthMoneyList: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
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
			this.getDayList()
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
				console.log(query)
				let db = wx.cloud.database();
				const onedayMoney = db.collection('onedayMoney')
				onedayMoney.where({
					year: +query[0],
					month: +query[1],
					day: +query[2],
					_openid: this.openid
				}).get().then((res) => {
					console.log(res)
					// this.list = res.data
					// this.loadModal = false;
					let Column2 = {
						categories: [],
						series: []
					};
					if (res.data.length === 0) {
						Column2.categories = []
						Column2.series = []
					} else {
						Column2.categories = res.data[0].date
						Column2.series = [{
							"name": "消费金额",
							"data": res.data[0].money,
							"color": "#facc14"
						}]
					}


					_self.showColumn2("canvasColumn2", Column2);
				})
			},
			getDayList() {
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const monthMoney = db.collection('onedayMoney')
				monthMoney.where({
					year: year,
					month: month,
					day: day,
					_openid: this.openid
				}).get().then((res) => {
					console.log(res.data[0].money)
					// console.log(_self.datListMoney)
				})
			},
			getServerData() {

				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();

				const onedayMoney = db.collection('onedayMoney')
				onedayMoney.where({
					year: year,
					month: month,
					day: day,
					_openid: this.openid
				}).get().then((res) => {
					let Column2 = {
						categories: [],
						series: []
					};
					Column2.categories = res.data[0].date
					Column2.series = [{
						"name": "消费金额",
						"data": res.data[0].money,
						"color": "#facc14"
					}]
					_self.showColumn2("canvasColumn2", Column2);
					console.log(res.data[0].money)

				})

				const monthMoney = db.collection('monthMoney')
				monthMoney.where({
					_openid: this.openid
				}).get().then((res) => {
					// console.log(res.data)
					for (let i = 0; i < res.data.length; i++) {
						_self.monthList[res.data[i].month - 1] = res.data[i].totalMoney
					}
					_self.monthList[res.data[0].month - 1] = res.data[0].totalMoney
					// let max = Math.floor(Math.max(..._self.monthList))
					// _self.monthList.push({
					// 	"value": max + 2,
					// 	"color": "#ffffff"
					// })
					// console.log(_self.monthList)
					let Column = {
						categories: [],
						series: []
					};
					Column.categories = _self.monthMoneyList
					Column.series = [{
						"name": "消费金额",
						"data": _self.monthList
					}]
					_self.showColumn("canvasColumn", Column);
				})
				// let Column = {
				// 	categories: [],
				// 	series: []
				// };
				// Column.categories = ["1月", "2月", "3月", "4月", "5月", "6月","7月", "8月", "9月", "10月", "11月", "12月"]
				// Column.series = [{
				// 	"name": "消费金额",
				// 	"data": [15, 20, 45, 37, 43, 34,15, 20, 45, 37, 43, 34,{
				// 		"value": 45+2,
				// 		"color": "#ffffff"
				// 	}]
				// }]

				const totalMoney = db.collection('totalMoney')
				totalMoney.where({
					_openid: this.openid
				}).limit(10).get().then((res) => {
					// console.log(res.data)
					res.data.forEach(item => {
						let date = item.month + '.' + item.day
						_self.dayList.push(date)
						// let tmp = {
						// 	"value": item.totalMoney,
						// 	"color": "#f04864"
						// }
						_self.datListMoney.push(item.totalMoney)
					})
					// console.log(_self.dayList)
					// console.log(_self.datListMoney)
					let LineA = {
						categories: [],
						series: []
					}
					LineA.categories = _self.dayList
					LineA.series = [{
						name: '消费金额',
						data: _self.datListMoney,
						"color": "#f04864"
					}]
					_self.showLineA("canvasLineA", LineA);
				})
				// let LineA = {
				// 	categories: [],
				// 	series: []
				// };
				// // LineA.categories = ['12', '13', '14']
				// // LineA.series = [{
				// // 	name: '成交量C',
				// // 	data: [100, 80, 95]
				// // }]
				// LineA.categories = ['12.12', '13.11', '14.2', '15.4', '16.6', '17.4','18.8','19.4','20.2','21.8']
				// LineA.series = [{
				// 	name: '成交量C',
				// 	data: [100, 80, 95, 150, 112, 132,200,102,204,180]
				// }]
				// _self.showColumn("canvasColumn", Column);
				// _self.showLineA("canvasLineA", LineA);
			},
			showColumn2(canvasId, chartData) {
				canvaColumn2 = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});

			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						//disabled:true
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});

			},
			showLineA(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: this,
					canvasId: canvasId,
					type: 'area',
					fontSize: 11,
					legend: {
						show: true
					},
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: 1,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type: 'grid',
						gridColor: '#CCCCCC',
						gridType: 'dash',
						dashLength: 8
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						splitNumber: 5,
						min: 10,
						max: 180,
					},
					width: this.cWidth,
					height: this.cHeight,
					extra: {
						area: {
							type: 'straight',
							opacity: 0.2,
							addLine: true,
							width: 2
						}
					}
				});

			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
			touchColumn2(e) {
				canvaColumn2.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
		},
	}
</script>

<style>
	/* 	page {
		background: #F2F2F2;
		width: 750upx;
		overflow-x: hidden;
	} */@import "/colorui/animation.css";
	.qiun-charts {
		padding-top: 10rpx;
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
