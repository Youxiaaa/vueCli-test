// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Vue from 'vue'
import App from './App'
import router from './router'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import dollarSign from './components/filter/dollarSignFilter'
import filterDate from './components/filter/filterDate'
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import * as rules from 'vee-validate/dist/rules'

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
 
localize('zh_TW', TW);
 
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
 
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});


Vue.use(VueAxios , axios)
Vue.config.productionTip = false
Vue.component('Loading' , Loading)
Vue.filter('dollarSign' , dollarSign)
Vue.filter('filterDate' , filterDate)

axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to , from , next) => {
  console.log(to , from , next);
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((res) => {
      if(res.data.success){
        next();
      }else{
        console.log('這裡需要驗證');
        next({
          path : '/signin'
        })
      }
    })
  }else{
    next();
  }
})