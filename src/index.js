import Vue from 'vue'
import Router from 'vue-router'

import App from './components/App.vue'

import { routeMap } from './router.js'

Vue.config.debug = true;

Vue.use(Router);

let router = new Router();
routeMap(router);

router.start(App, '#app');