import Vue from 'vue'
import Vuex from 'vuex'
import main from './main-store'
import datasource from './datasource'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        main, //未加 namespaced: true, 表示全局的actions/mutations
        datasource,
    }
})