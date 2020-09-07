<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>
			<block slot="content">开发记录</block>
		</cu-custom>
		
		<view class="cu-timeline">
			<view class="cu-time">9月7日</view>
			<view class="cu-item text-red cuIcon-favorfill animation-slide-left">
				<view class="content bg-grey shadow-blur">
					基本完成，准备发布，后续发现bug再改吧！
				</view>
			</view>
			<view class="cu-item cur cuIcon-noticefill animation-slide-right">
				<view class="content bg-green shadow-blur">
					为应用添加动画，并完成了最后一个有趣的页面
				</view>
			</view>
			<view class="cu-item text-red cuIcon-attentionforbidfill animation-slide-left">
				<view class="content bg-red shadow-blur">
					修补bug：获取两组数据后，对数据分析合并，将位置的对应调整正确
				</view>
			</view>
			<view class="cu-item text-yellow cuIcon-likefill animation-slide-right">
				<view class="content bg-blue shadow-blur">
					完成小程序信息页
				</view>
			</view>
			<view class="cu-item text-grey cuIcon-evaluate_fill animation-slide-left">
				<view class="content bg-grey shadow-blur">
					完成小程序信息功能
				</view>
			</view>
			<view class="cu-item text-blue animation-slide-right">
				<view class="bg-cyan content">
					完成留言板功能
				</view>
			</view>
		</view>
		
		<view class="cu-timeline">
			<view class="cu-time">9月6日</view>
			<view class="cu-item text-red cuIcon-noticefill animation-slide-left">
				<view class="content bg-pink shadow-blur">
					完成留言板基本布局
				</view>
			</view><view class="cu-item text-red cuIcon-favorfill animation-slide-right">
				<view class="content bg-grey shadow-blur">
					修补bug：小程序端所有属于该用户的数据获取时没指定标识符
				</view>
			</view>
			<view class="cu-item cur cuIcon-noticefill animation-slide-left">
				<view class="content bg-green shadow-blur">
					修补bug：获取数据没指定用户标识
				</view>
			</view>
			<view class="cu-item text-red cuIcon-attentionforbidfill animation-slide-right">
				<view class="content bg-red shadow-blur">
					完成查看其它用户数据功能
				</view>
			</view>
			<view class="cu-item text-yellow cuIcon-likefill animation-slide-left">
				<view class="content bg-blue shadow-blur">
					完成主要消费功能
				</view>
			</view>
			<view class="cu-item text-grey cuIcon-evaluate_fill animation-slide-right">
				<view class="content bg-grey shadow-blur">
					完成昨日消费面板
				</view>
			</view>
			<view class="cu-item text-blue animation-slide-left">
				<view class="bg-cyan content">
					完成分类统计，完善数据统计
				</view>
			</view>
		</view>
		
		<view class="cu-timeline">
			<view class="cu-time">9月5日</view>
			<view class="cu-item text-yellow cuIcon-likefill">
				<view class="content bg-blue shadow-blur">
					完成数据统计功能，顺便学习了插件市场的uchart插件
				</view>
			</view><view class="cu-item text-red cuIcon-favorfill">
				<view class="content bg-grey shadow-blur">
					修补昨日消费金额的bug，新增一个数据集合
				</view>
			</view>
			<view class="cu-item cur cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					修补首页获取数据的bug改为点击加载更多
				</view>
			</view>
			<view class="cu-item text-red cuIcon-attentionforbidfill">
				<view class="content bg-red shadow-blur">
					完成列表页面，下拉刷新，无限加载
				</view>
			</view>
			<view class="cu-item text-grey cuIcon-evaluate_fill">
				<view class="content bg-pink shadow-blur">
					用户页布局完成，首页布局完成
				</view>
			</view>
			<view class="cu-item text-blue">
				<view class="bg-cyan content">
					完成删除功能
				</view>
			</view>
		</view>

		<view class="cu-timeline">
			<view class="cu-time">9月4日</view>
			<view class="cu-item text-red cuIcon-favorfill">
				<view class="content bg-red shadow-blur">
					完善首页的数据渲染部分，并修补布局上的bug
				</view>
				<view class="content bg-grey shadow-blur">
					开发添加记录功能，哈哈哈哈
				</view>
			</view>
			<view class="cu-item cur cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					完成记录费用的基本逻辑
				</view>
			</view>
			<view class="cu-item text-red cuIcon-attentionforbidfill">
				<view class="content bg-red shadow-blur">
					完成添加分类功能的逻辑
				</view>
			</view>
			<view class="cu-item text-grey cuIcon-evaluate_fill">
				<view class="content bg-grey shadow-blur">
					用户页布局完成，首页布局完成
				</view>
			</view>
			<view class="cu-item text-blue">
				<view class="bg-blue content">
					完成登录布局，完善登录逻辑
				</view>
				<view class="bg-cyan content">
					完成底部导航栏，实现主要的路由切换
				</view>
			</view>
		</view>

		<view class="cu-timeline">
			<view class="cu-time">9月3日</view>
			<view class="cu-item cur cuIcon-noticefill">
				<view class="content bg-green shadow-blur">
					完成登录的逻辑
				</view>
			</view>
			<view class="cu-item text-red cuIcon-attentionforbidfill">
				<view class="content bg-red shadow-blur">
					开始写代码，初始化整个项目，采用colorui
				</view>
			</view>
			<view class="cu-item text-grey cuIcon-evaluate_fill">
				<view class="content bg-grey shadow-blur">
					完成所有页面的规划
				</view>
			</view>
			<view class="cu-item text-blue">
				<!-- 	<view class="bg-blue content">
					<text>20:00</text> 【月球】快件已到达月球，准备发往地球
				</view> -->
				<view class="bg-cyan content">
					看下官网的对uniapp的介绍，并简单学习一下
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
@import "/colorui/animation.css";
</style>
