<script setup>

import { ref, watch } from 'vue';

import { web_check_admin_password } from './net/Net';

import Admin from './Admin.vue';

let input_password = ref('');

let show_password_state = ref(false);
let is_password_correct = ref(0);

watch(input_password, () => {
    show_password_state.state = false;
});

function check_p() {
    web_check_admin_password(input_password.value, (result) => {
        show_password_state.state = true;
        if (result[0] == 'correct') {
            is_password_correct.value = 1;
        }
        if (result[0] == 'incorrect') {
            is_password_correct.value = 2;
        }
        if (result[0] == 'busy') {
            is_password_correct.value = 3;
        }

    });
}

</script>

<template>

    <div id="container">

        <div v-if="is_password_correct == 1">
            <Admin />
        </div>

        <div v-if="is_password_correct != 1">
            <div class="card">
                <div class="card-body">
                    <div class="card-title">请输入管理员密码</div>

                    <div v-if="is_password_correct == 2" style="color: red;">密码不正确</div>
                    <div v-if="is_password_correct == 3" style="color: red;">尝试过于频繁</div>
                    <div class="input-group mb-3">
                        <input @keypress.enter="check_p()" v-model="input_password" type="password" class="form-control"
                            placeholder="管理员密码" aria-label="admin_password" aria-describedby="button-addon2">

                        <button @click="check_p()" class="btn btn-outline-info" type="button"
                            id="button-addon2">确定</button>

                    </div>
                </div>
            </div>
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