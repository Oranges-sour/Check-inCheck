<script setup>
import { ref } from 'vue'

const emit = defineEmits(
    ["sel"]
);

function sel(num) {
    emit("sel", num);
}
</script>



<template>

    <div id="c" >
        <div class="btn-group" style="width: 100%;">
            <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                选择教室
            </button>
            <ul class="dropdown-menu" style="width: 100%;">
                <li><button class="dropdown-item" @click="sel(329)">329</button></li>
                <li><button class="dropdown-item" @click="sel(32501)">325_01 (数学类)</button></li>
                <li><button class="dropdown-item" @click="sel(32502)">325_02 (中外)</button></li>
                <li><button class="dropdown-item" @click="sel(321)">321</button></li>
            </ul>
        </div>
    </div>


</template>


<style scoped>
#c {
    margin: 0 auto;
    width: 50%;
    height: 60%;
}
</style>