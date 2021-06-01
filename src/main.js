import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = true

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
      ? '/simon_says/'
      : '/'
}

new Vue({
  render: h => h(App),
}).$mount('#app')
