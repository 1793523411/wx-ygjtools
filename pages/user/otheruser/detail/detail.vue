<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">其他用户数据</block>
		</cu-custom>
		<view class="qiun-columns">
			<view class="qiun-charts">
				<view class="cu-bar bg-white margin-top animation-slide-left">
					<view class="action">
						<text class="text-green"></text>
						<text>近十天统计</text>
					</view>
				</view>
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
				<view class="cu-bar bg-white margin-top animation-slide-right">
					<view class="action">
						<text class="text-green"></text>
						<text>({{month}}月)</text>
					</view>
					
				</view>
				<canvas canvas-id="canvasPie2" id="canvasPie2" class="charts" @touchstart="touchPie2"></canvas>
				<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaLineA = null;
	var canvaWord = null;
	var canvaPie2 = null;
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				openid: "",
				dayList: [],
				datListMoney: [],
				month:0
			}
		},
		methods: {
			toJSON() {

			},
			getServerData() {
				// console.log(this.openid)
				let myDate = new Date();
				let year = myDate.getFullYear();
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let db = wx.cloud.database();

				
				const totalMoney = db.collection('totalMoney')
				totalMoney.where({
					_openid: this.openid
				}).limit(10).get().then((res) => {
					console.log(res.data)
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
				
				const sort = db.collection('sort')
				sort.where({
					_openid: this.openid
				}).get().then(res => {
					// console.log(res.data)
					// console.log(tmp)
					let wordArr = []
					res.data.forEach(item => {
						let random = (Math.ceil(Math.random()*10)+1)*4
						console.log(random)
						let tmp = {
							name:item.tag,
							textSize: random <15 ? 15 : random
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
			touchPie2(e) {
				canvaPie2.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
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
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			getTenDat(id) {
				this.openid = id
				// console.log(this.openid)
			}
		},
		onLoad(e) {
			_self = this;
			this.getTenDat(e.id)
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
			console.log(e)
			
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
