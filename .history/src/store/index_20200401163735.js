import Vue from'vue'
import Vuex from'vuex'
import getters from'./getters'
import state from'./state'
import action from'./action'
import mutations from'./mutations'
import createLogger from'vuex/dist/logger'

Vue.use(Vuex)

constdebug=process.env.NODE_ENV!=='production'


export default newVuex.Store({
    getters,
    state,
    action,
    mutations,
    strict:debug,
    plugins:debug?[createLogger()]:[]
});