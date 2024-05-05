import './assets/main.css'

import 'tabler/dist/css/tabler.min.css'
import 'tabler/dist/js/tabler.min.js'

import VueApexCharts from "vue3-apexcharts";


import { createApp } from 'vue'
import App from './App.vue'


createApp(App).use(VueApexCharts).mount('#app')
