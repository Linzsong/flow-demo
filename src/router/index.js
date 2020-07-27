import Vue from 'vue'
import Router from 'vue-router'
import FlowComponent from '@/components/FlowComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FlowComponent',
      component: FlowComponent
    }
  ]
})
