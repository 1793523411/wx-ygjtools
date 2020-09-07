import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个 store
const store = new Vuex.Store({
	// (1)初始 state 对象
	state: {
		hasLogin: false,
		userInfo: {
			"nickName": "",
			"gender": 0,
			"city": "",
			"province": '',
			'country': '',
			'avatarUrl': ''
		},
		signature:"",
		company:"未知",
		openid:""
	},
	// (2)定义一些mutation
	mutations: {
		change(state, company) {
			state.company = company;
		},
		login(state, userInfo,signature) {
			state.hasLogin = true;
			state.userInfo = userInfo;
			state.signature = signature;
		},
		setOpenid(state,openid){
			state.openid = openid
		}
			
		// logout(state) {
		// 	state.hasLogin = false;
		// 	state.token = "";
		// },
		// celarUserInfo(state) {
		// 	state.userInfo = {
		// 		"name": "",
		// 		"role": "",
		// 		"age": 0
		// 	};
		// },
	}
})

// 导出该模块:以便其他文件可对其进行使用
export default store
