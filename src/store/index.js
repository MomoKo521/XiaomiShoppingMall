import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
    // mutations模块
import mutations from './mutations'
// getter 模块
import * as getters from './getter'
// state 模块
import state from './state'
//acitons模块
import actions from './actions'
export default new Vuex.Store({
    getters,
    state,
    mutations,
    actions
})