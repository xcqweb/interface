import Vue from 'vue'

Vue.filter('number', function(val,count) {
  return val.toFixed(count)
})