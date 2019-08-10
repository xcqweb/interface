
const state = {
    type:0,
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
