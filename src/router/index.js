import Vue from 'vue'
import Router from 'vue-router'
import Emotion from '@/components/Emotion'
import ImageInfo from '@/components/ImageInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Emotion',
      component: Emotion
    },
    {
      path: '/ImageInfo',
      name: 'ImageInfo',
      component: ImageInfo
    }
  ]
})
