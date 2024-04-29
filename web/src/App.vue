<script setup>
import { ref } from 'vue';


import Check from './Check.vue';
import AdminEnter from './AdminEnter.vue'


let page_on = ref(0);

function to_check() {
    page_on.value = 1;
}

function to_admin() {
    page_on.value = 2;
}
</script>

<template>
    <div id="container">


        <div v-if="page_on == 0">
            <button class="btn btn-default" @click="to_check()">进入点名</button>
            <button class="btn btn-default" @click="to_admin()">进入管理员</button>
        </div>

        <div v-if="page_on == 1">
            <Check />
        </div>

        <div v-if="page_on == 2">
            <AdminEnter />
        </div>
    </div>

</template>

<style scoped>
#container {
    width: min(98%, 600px);
    height: 100%;
    margin: 0 auto;
}
</style>