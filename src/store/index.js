import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import getters from './getters'
import vuexAlong from 'vuex-along'

import createLogger from 'vuex/dist/logger';//查看vuex日志

Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        cart
    },
    getters,
    plugins:[vuexAlong({
        name:'vuex',
        local:false
    }),process.env.NODE_ENV !== 'production'?createLogger():'']
})

export default store