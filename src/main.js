import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBo7bGaEkoB45d5TQzelkIu39a23Em4HSM",
    libraries: "places"
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
