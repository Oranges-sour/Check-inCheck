<script setup>
let props = defineProps({
    room: Number,
    year: Number,
    month: Number,
    day: Number,
    required: true
});
let emits = defineEmits([
    "load_finish",
    "close"
]);


import { ref, computed } from 'vue'
import { web_get_name_list, web_get_check_list, web_update_check_list } from '@/net/Net.js'

const idx = ref(0);
const name_list = ref([]);
const name_mark = ref([]);

let load_finish = ref(false);

let load_count = ref(0);
const max_load_count = ref(2);

let class_list_group_item = ref("list-group-item");

let half_name_list_idx = computed(() => {
    return Math.ceil((name_list.value.length - 1) / 2);
});

let half_name_list_first = computed(() => {
    return name_list.value.slice(0, half_name_list_idx.value);
});

let half_name_list_second = computed(() => {
    return name_list.value.slice(half_name_list_idx.value, name_list.value.length - 1);
});

let view_all = ref(false);
let toggle_view_all_text = computed(() => {
    if (view_all.value) {
        return "关闭总览";
    }
    return "显示总览";
});

let end = ref(false);

web_get_name_list(props.room, (data) => {
    name_list.value = data;
    name_list.value.push("结束");
    load_count.value += 1;

    check_load_finish();
});

web_get_check_list(props.room, props.year, props.month, props.day, (data) => {
    for (let i = 0; i < data.length; ++i) {
        name_mark.value[i] = data[i];
    }

    load_count.value += 1;

    check_load_finish();
});

function check_load_finish() {
    if (load_count.value == max_load_count.value) {
        emits("load_finish");
        load_finish.value = true;

        update_leave();
    }
}

//请假的人，不显示在最上方的 签到缺勤 上
function update_leave() {
    while (name_mark.value[idx.value] == 2) {
        idx.value += 1;

        if (idx.value >= name_list.value.length - 1) {
            end.value = true;
            idx.value = name_list.value.length - 1;
            return;
        }
    }
}

function update_check_list() {
    web_update_check_list(props.room, props.year, props.month, props.day, name_mark.value, () => { });

    emits("close");
}



function increament(set_v) {

    name_mark.value[idx.value] = set_v;
    idx.value += 1;

    while (name_mark.value[idx.value] == 2) {
        idx.value += 1;

        if (idx.value >= name_list.value.length - 1) {
            end.value = true;
            idx.value = name_list.value.length - 1;
            return;
        }
    }

    if (idx.value >= name_list.value.length - 1) {
        end.value = true;
        idx.value = name_list.value.length - 1;
        return;
    }


}

function is_checked(idx, tar) {
    return name_mark.value[idx] == tar;
}

</script>

<template>
    <div style="text-align: center; font-size: calc(2vw + 12px);">
        教室 {{ props.room }}
    </div>
    <div class="card" style="width: 100%; height:60%; padding-top: 10%; padding-left: 5%; padding-right: 5%;">
        <!-- 加载转圈 -->
        <div id="loading" class="spinner-border" role="status" v-if="!load_finish">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div v-if="!load_finish" style="text-align: center;">从服务器获取数据 {{ load_count }} / {{ max_load_count }}</div>
        <!-- ################################# -->
        <h5 v-if="load_finish" class="card-head"
            style="margin-bottom:5%;font-size: calc(5vw + 12px);text-align: center;">
            {{ name_list[idx] }}
        </h5>
        <div class="card-body">
            <button type="button" class="btn btn-success" v-if="!end && load_finish" @click="increament(1)"
                style="width:45%;margin-right:10%;font-size: calc(5vw + 12px);">签到</button>
            <button type="button" class="btn btn-danger" v-if="!end && load_finish" @click="increament(0)"
                style="width:45%;right:0;font-size: calc(5vw + 12px);">缺勤</button>
        </div>


        <button v-if="load_finish" type="button" class="btn btn-info" @click="view_all = !view_all"
            style="width:65%;margin: auto;margin-bottom:2%;font-size: calc(1vw + 5px);">{{ toggle_view_all_text
            }}</button>
        <div v-if="view_all">
            <ul class="list-group" id="listg" style="float: left;">

                <li v-for="(item, idx) in half_name_list_first " :class="class_list_group_item">
                    {{ idx + 1 }}. {{ item }}
                    <span style="float: right;">
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx" :id="String(idx) + 'a'"
                                :checked="is_checked(idx, 1)" @click="name_mark[idx] = 1">
                            <label class="form-check-label" :for="String(idx) + 'a'">
                                签到
                            </label>
                        </span>
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx" :id="String(idx) + 'b'"
                                :checked="is_checked(idx, 0)" @click="name_mark[idx] = 0">
                            <label class="form-check-label" :for="String(idx) + 'b'">
                                缺勤
                            </label>
                        </span>
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx" :id="String(idx) + 'c'"
                                :checked="is_checked(idx, 2)" @click="() => { name_mark[idx] = 2; update_leave(); }">
                            <label class="form-check-label" :for="String(idx) + 'c'">
                                请假
                            </label>
                        </span>
                    </span>

                </li>

            </ul>

            <ul class=" list-group" id="listg" style="float: left; margin-left: 2%;">

                <li v-for="(item, idx) in half_name_list_second" :class="class_list_group_item">
                    {{ idx + 1 + half_name_list_idx }}. {{ item }}
                    <span style="float: right;">
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx + half_name_list_idx"
                                :id="String(idx + half_name_list_idx) + 'a'"
                                :checked="is_checked(idx + half_name_list_idx, 1)"
                                @click="name_mark[idx + half_name_list_idx] = 1">
                            <label class="form-check-label" :for="String(idx + half_name_list_idx) + 'a'">
                                签到
                            </label>
                        </span>
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx + half_name_list_idx"
                                :id="String(idx + half_name_list_idx) + 'b'"
                                :checked="is_checked(idx + half_name_list_idx, 0)"
                                @click="name_mark[idx + half_name_list_idx] = 0">
                            <label class="form-check-label" :for="String(idx + half_name_list_idx) + 'b'">
                                缺勤
                            </label>
                        </span>
                        <span class="form-check-inline">
                            <input class="form-check-input" type="radio" :name="idx + half_name_list_idx"
                                :id="String(idx + half_name_list_idx) + 'c'"
                                :checked="is_checked(idx + half_name_list_idx, 2)"
                                @click="() => { name_mark[idx + half_name_list_idx] = 2; update_leave(); }">
                            <label class="form-check-label" :for="String(idx + half_name_list_idx) + 'c'">
                                请假
                            </label>
                        </span>
                    </span>

                </li>

            </ul>

        </div>
        <button v-if="view_all" type="button" class="btn btn-info" @click="view_all = !view_all"
            style="width:65%;margin: 0 auto;margin-bottom:5%;font-size: calc(1vw + 5px);">
            {{ toggle_view_all_text }}</button>

        <div class="update_btn">
            <button style="width: 100%;" v-if="load_finish" class="btn btn-success" @click="update_check_list">
                记录当前签到结果.<span style="color: crimson; font-weight: bold;">若中途结束，未轮到的人将保持状态不变！</span>
            </button>
        </div>

    </div>


</template>

<style scoped>
#loading {
    width: 3rem;
    height: 3rem;
    margin: auto;
}

#listg {
    width: 49%;
    margin-bottom: 2%;
}

.update_btn {
    width: 60%;
    margin: auto;
    margin-bottom: 2%;
}
</style>