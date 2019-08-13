
const state = {
    type:0,
    // 弹窗样式
    dialogStyle:{
        desc:'',
        width:'',
        height:'',
        title:{
            fontSize:'',
            fonWeight:'bold',
            color:'',
            textAlign:'center',
            verticalAlign:''
        }
    }
}

const mutations = {
    pageTabIndex(state,type) {
        return state.type = type
    }
}

const actions = {
    pageTabIndex({commit}, type = 0) {
        return commit('pageTabIndex', type)
    },
}

export default {
    state,
    mutations,
    actions
}
