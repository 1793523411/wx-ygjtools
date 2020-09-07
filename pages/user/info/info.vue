<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<navigator url="/pages/home/home">
				<block slot="backText">返回</block>
			</navigator>

			<block slot="content">小程序信息</block>
		</cu-custom>

		<view class="cu-bar bg-white">
			<view class="action sub-title">
				<text class="text-xl text-bold text-green">关于小程序</text>
				<text class="text-ABC text-blue">about</text>
			</view>
		</view>
		<view class="padding bg-white">
			<view class="text-left padding">这个微信小小程序是怎么来的呢？需要的工具如下：微信开发者工具，HbuilderX编辑器(尽管我觉得很不好用)，注册一个微信小小程序账号并开通小程序端的云开发环境，最后就是一台电脑了，这些工具共同造就了该微信小小程序</view>
			<view class="text-left padding">该微信小小程序并不是基于原生小程序开发，而是使用一种名为uniapp的跨端解决方案，使用uniapp写小程序跟有种使用vue的感觉，但并不是完全一样，依然有许多规则需要遵循微信小程序的规则，然后使用到了名为colorUi来让这个微信小程序变得好看起来，这个小程序使用到了许多图表，没错该图表是使用名为uchart插件画出来的，哈哈哈(*^▽^*),我觉得这个UI颜值还蛮高的，就跟我一样🤪</view>
			<view class="text-left padding">吐槽一下：我有点感觉开发小程序对电脑伤害很大，事情是这样的：我用vue开发网站时，使用官方cli默认的配置，改完代码，浏览器很快渲染完毕，并不怎么影响我的开发体验，改代码，浏览器刷新，这一系类过程只要没有报错，很正常，不慢，不卡，但是在写小程序时，当代码越来越多时，改完代码刷新，uniapp编译很快，毕竟基于vue的，但微信开发者工具，要等好长一段时间才渲染完毕，还好几回渲染不出来（不排除我写有死循环），就感觉，心疼我的电脑，ε=(´ο｀*)))，那肯定有人问，你这个不是使用了uniapp，基于浏览器开发不好嘛，最后在运行在小程序端，我的回答是，我的整个后端用的小程序端的云开发，浏览器没有，所以...</view>
		</view>

		<view class="cu-bar bg-white">
			<view class="action sub-title">
				<text class="text-xl text-bold text-green">关于我</text>
				<text class="text-ABC text-blue">about</text>
				<!-- last-child选择器-->
			</view>
		</view>
		<view class="padding bg-white">
			<view class="text-left padding">我叫杨国杰，河南理工大学 软件工程1801 的 一名普通本科生，喜欢用代码创造有意思的事物，热爱技术，喜欢学习新技术，虽然我很菜，但并不影响我的热情，哈哈哈~~~</view>

			<view class="text-left padding">目前还处于比较菜的阶段，在写这个应用时，写着写着就发现了bug然后去修补bug，这些都在<text class="text-bold text-red" @click="go">开发记录</text>中有记录，虽然有的bug发现了，但一定还有隐藏的bug没有被发现，嘤嘤嘤</view>
			<view class="text-left padding">还有就是代码质量问题，写完整个应用之后，最大的感觉是代码冗余量比较大，比如，在做上拉获取新数据时，写了两块基本一模一样的代码，扩展性的话，额外添加新功能还好，但若是基于原来的功能修改，那就比较那个啥了，改bug的我深有体会（说不定是我有代码这方面的洁癖，哈哈哈），原谅我基本没一行注释都没写</view>
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
			go() {
				uni.navigateTo({
					url: '/pages/user/history/history'
				})
			}
		}
	}
</script>

<style>

</style>
