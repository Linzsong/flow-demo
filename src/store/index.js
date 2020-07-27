import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        canvasData: {
            scale: 1,
            lineName: 'curve',
            fromArrowType: '',
            toArrowType: 'triangleSolid',
            locked: 0
        }
    },
    mutations: {
        setCanvas(state, data) {
            state.data = data
        }
    },
})