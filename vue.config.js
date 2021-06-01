import Vue from "vue";

Vue.config.devtools = true

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/simon_says/'
        : '/'
}
