<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">昨日消费</block>
		</cu-custom>

		<view class="qiun-columns">
			<view class="qiun-charts animation-scale-down">
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
				<canvas canvas-id="canvasColumn2" id="canvasColumn2" class="charts" @touchstart="touchColumn2"></canvas>
				<canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaPie = null;
	var canvaColumn2 = null;
	var canvaArea = null;
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
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
			getServerData() {

				// let Area = {
				// 	categories: [],
				// 	series: []
				// };
				// Area.categories = ['2012', '2013', '2014', '2015', '2016', '2017'],
				// 	Area.series = [{
				// 		name: '成交量A',
				// 		data: [100, 80, 95, 150, 112, 132],
				// 		color: '#facc14'
				// 	}, {
				// 		name: '成交量B',
				// 		data: [70, 40, 65, 100, 44, 68],
				// 		color: '#2fc25b'
				// 	}]
				// _self.showArea("canvasArea", Area);

				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();
				const _ = db.command
				const tagDayMoney = db.collection('tagDayMoney')
				tagDayMoney.where({
					year: year,
					month: month,
					day: day - 1,
					_openid: this.openid
				}).get().then(res => {
					let tmp = Object.entries(res.data[0].money)
					// console.log(tmp)
					for (let i = 0; i < tmp.length; i++) {
						let tmpObj = {
							name: tmp[i][0],
							data: tmp[i][1]
						}
						tmp[i] = tmpObj
					}
					let Pie = {
						series: []
					};
					Pie.series = tmp
					_self.showPie("canvasPie", Pie);
				})

				const tagDayMoney2 = db.collection('tagDayMoney')
				tagDayMoney2.where({
					year: year,
					month: month,
					day: _.or(day, day - 1),
					_openid: this.openid
				}).get().then(res => {
					console.log(res.data)
					if (res.data.length === 0) {
						let Area = {
							categories: [],
							series: []
						};
						Area.categories = [],
							Area.series = []
						_self.showArea("canvasArea", Area);
					} else if (res.data.length === 1) {
						if (res.data[0].day === day) {
							let tmpkey1 = Object.keys(res.data[0].money)
							let tmpvalue1 = Object.values(res.data[0].money)

							let Area = {
								categories: [],
								series: []
							};
							Area.categories = tmpkey1,
								Area.series = [{
									name: '昨天',
									data: tmpvalue1,
									color: '#2fc25b'
								}]
							_self.showArea("canvasArea", Area);
						} else {
							let tmpkey2 = Object.keys(res.data[0].money)
							let tmpvalue2 = Object.values(res.data[0].money)

							let Area = {
								categories: [],
								series: []
							};
							Area.categories = tmpkey2,
								Area.series = [{
									name: '今天',
									data: tmpvalue2,
									color: '#facc14'
								}]
							_self.showArea("canvasArea", Area);
						}

					} else if (res.data.length === 2) {
						// console.log(res.data)
						let tmpkey1 = Object.keys(res.data[0].money)
						let tmpvalue1 = Object.values(res.data[0].money)
						console.log(tmpkey1)
						console.log(tmpvalue1)
						let tmpkey2 = Object.keys(res.data[1].money)
						let tmpvalue2 = Object.values(res.data[1].money)
						console.log(tmpkey2)
						console.log(tmpvalue2)


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
						console.log(tmpkey11)
						console.log(tmpvalue11)
						console.log(tmpkey22)
						console.log(tmpvalue22)
						let Area = {
							categories: [],
							series: []
						};
						Area.categories = tmpkey11,
							Area.series = [{
								name: '昨天',
								data: tmpvalue11,
								color: '#facc14'
							}, {
								name: '今天',
								data: tmpvalue22,
								color: '#2fc25b'
							}]
						_self.showArea("canvasArea", Area);
					}

				})

				const onedayMoney = db.collection('onedayMoney')
				onedayMoney.where({
					year: year,
					month: month,
					day: day - 1,
					_openid: this.openid
				}).get().then((res) => {
					let Column2 = {
						categories: [],
						series: []
					};
					Column2.categories = res.data[0].date
					Column2.series = [{
						"name": "昨日消费金额",
						"data": res.data[0].money,
						"color": "#facc14"
					}]
					_self.showColumn2("canvasColumn2", Column2);
					console.log(res.data[0].money)

				})
			},

			showArea(canvasId, chartData) {
				canvaArea = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'area',
					fontSize: 11,
					legend: true,
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
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
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
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
			touchArea(e) {
				canvaArea.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
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
			touchPie(e) {
				canvaPie.showToolTip(e, {
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
