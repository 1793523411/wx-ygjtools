<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">添加</block>
		</cu-custom>

		<!-- 数据：金额，简单描述，分类，详细描述，时.间（年月日时分） -->
		<view class="cu-form-group">
			<view class="title">标题</view>
			<input placeholder="消费/收获标题" name="input" @input="titleInput"></input>
		</view>

		<view class="cu-form-group">
			<view class="title">金额</view>
			<input placeholder="消费/收获金额(带上+-号)" name="input" @input="moneyInput"></input>
		</view>

		<view class="cu-form-group align-start">
			<view class="title">其他想表达的</view>
			<textarea maxlength="-1" :disabled="modalName!=null" @input="textareaBInput" placeholder="emmmm...(选填)"></textarea>
		</view>

		<view class="cu-form-group ">
			<view class="title">分类</view>
			<navigator url="/pages/user/sort/sort" open-type="navigate">
				<button class="cu-btn round">添加分类</button>
			</navigator>
			<picker @change="PickerChange" :value="index" :range="picker">
				<view class="picker">
					{{index>-1?picker[index]:'选择您的自定义分类'}}
				</view>
			</picker>
		</view>
			<view class="cu-bar btn-group margin-top">
				<button class="cu-btn bg-green shadow-blur round lg" @click="submit">提交</button>
			</view>
		
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">情将信息填写完整</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
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
				money: 0,
				title: '',
				conetnt: '',
				tag: '',
				year: '',
				day: '',
				month: "",
				hour: '',
				minite: '',
				index: -1,
				picker: [],
				modalName:null
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid;
			}
		},
		methods: {
			showModal(e) {
				this.modalName = 'Modal'
			},
			hideModal(e) {
				this.modalName = null
			},
			PickerChange(e) {
				this.index = e.detail.value
				this.tag = this.picker[this.index]
				console.log(this.tag)
			},
			gettag() {
				let db = wx.cloud.database();
				const sort = db.collection('sort')
				sort.where({
					_openid: this.openid
				}).get().then((res) => {
					res.data.forEach(item => {
						this.picker.push(item.tag)
					})
				})
			},
			titleInput(e) {
				this.title = e.target.value
			},
			moneyInput(e) {
				this.money = e.target.value
			},
			textareaBInput(e) {
				this.conetnt = e.target.value
			},
			submit() {
				if(!this.title||!this.money||!this.tag){
					this.modalName = 'Modal'
					return
				}
				console.log(this.title)
				console.log(this.money)
				console.log(this.conetnt)
				console.log(this.tag)
				let myDate = new Date();
				let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				let day = myDate.getDate(); //获取当前日(1-31)
				let hour = myDate.getHours(); //获取当前小时数(0-23)
				let minutes = myDate.getMinutes(); //获取当前分钟数(0-59)
				console.log(year)
				console.log(month)
				console.log(day)
				console.log(hour)
				console.log(minutes)
				wx.cloud.callFunction({
					name: "addlist",
					data: {
						title: this.title,
						money: this.money,
						conetnt: this.conetnt,
						tag: this.tag,
						year: year,
						month: month,
						day: day,
						hour: hour,
						minutes: minutes
					}
				}).then(res => {
					console.log(res)
					uni.redirectTo({
						url:'/pages/home/home'
					})
				}, err => {
					console.log((err))
				})
			}
		},
		onLoad() {
			this.gettag()
		}
	}
</script>

<style>

</style>
