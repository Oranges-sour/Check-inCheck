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

        <h1 v-if="page_on == 0"  style="text-align: center;">主页</h1>

        <div class="card text-center" v-if="page_on == 0">
            <div class="card-body">
                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button type="button" class="btn btn-primary btn-lg" @click="to_check()">进入点名</button>
                    <button type="button" class="btn btn-primary btn-lg" @click="to_admin()">进入管理员</button>
                </div>
            </div>

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
    width: min(95%, 600px);
    height: 100%;
    margin: 0 auto;
}
</style>