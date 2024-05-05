<script setup>

import { computed, ref } from 'vue';

import {
    web_get_active_date,
    web_set_active_date,
    web_get_all_list,
    web_insert_check_list,
    web_drop_check_list,
    web_get_check_list,
    web_get_name_list,
} from './net/Net';

let chartOptions = ref({
    chart: {
        id: 'area',
        fontFamily: 'inherit',
        parentHeightOffset: 0,
        animations: {
            enabled: false
        },
        toolbar: {
            show: false,
        }

    },
    dataLabels: {
        enabled: false,
    },
    fill: {
        opacity: .16,
        type: 'solid'
    },
    stroke: {
        width: 2,
        lineCap: "round",
        curve: "smooth",
    },
    tooltip: {
        theme: 'light'
    },
    grid: {
        padding: {
            top: -20,
            right: 0,
            left: -4,
            bottom: -4
        },
        strokeDashArray: 4,
    },
    legend: {
        show: true,
        position: 'bottom',
        offsetY: 12,
        markers: {
            width: 10,
            height: 10,
            radius: 100,
        },
        itemMargin: {
            horizontal: 8,
            vertical: 8
        }
    },
    xaxis: {
        labels: {
            padding: 0,
        },
        tooltip: {
            enabled: false
        },
        axisBorder: {
            show: false,
        },

        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    },
    yaxis: {
        labels: {
            padding: 4
        },
    },
});

let series = ref([{
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
}]);

let on_list_detail = ref(false);
let detail_list_name = ref([]);
let detail_list_data = ref([]);
let detail_idx_mid = computed(() => { return Math.ceil((detail_list_name.value.length - 1) / 2); });
let detail_date = ref([2000, 1, 1]);

let update_date_waiting = ref(true);
let all_list_waiting = ref(true);

let year = ref(0);
let mon = ref(0);
let day = ref(0);

let sel_year = ref(0);
let sel_mon = ref(0);
let sel_day = ref(0);

let all_list = ref([]);

update_date();

update_all_list();

function update_all_list() {
    all_list_waiting.value = true;

    web_get_all_list((result) => {
        all_list_waiting.value = false;

        all_list.value = result;

        all_list.value.sort((a, b) => {

            if (a[0] > b[0]) {
                return -1;
            } else if (a[1] > b[1]) {
                return -1;
            } else if (a[2] > b[2]) {
                return -1;
            }
            return 1;

        });
    });
}

function update_date() {
    update_date_waiting.value = true;

    web_get_active_date((result) => {
        update_date_waiting.value = false;
        year.value = result[0];
        mon.value = result[1];
        day.value = result[2];
    });
}

function set_date() {
    update_date_waiting.value = true;
    all_list_waiting.value = true;

    web_set_active_date(sel_year.value, sel_mon.value, sel_day.value, () => {
        update_date();
    });

    web_insert_check_list(sel_year.value, sel_mon.value, sel_day.value, () => {
        update_all_list();
    });
}

function look_column(column_name) {
    on_list_detail.value = true;
    detail_date.value = column_name;

    web_get_name_list(-1, (result) => {

        detail_list_name.value = result;

    });
    web_get_check_list(-1, column_name[0],
        column_name[1],
        column_name[2],
        (result) => {
            detail_list_data.value = result;
        });
}

function erase_column(column_name) {
    all_list_waiting.value = true;
    web_drop_check_list(column_name[0],
        column_name[1],
        column_name[2], () => {

            update_all_list();

        });
}


</script>

<template>
    <div id="container">
        <div id="title">管理员</div>
        <div class="card">
            <div class="card-body">
                <div class="card-title">设置今日签到日期</div>
                <select v-model="sel_year" class="form-select sel_date" aria-label="year">
                    <option selected>年</option>
                    <option :value="2024">2024年</option>
                </select>
                <select v-model="sel_mon" class="form-select sel_date" aria-label="month">
                    <option selected>月</option>
                    <option v-for="idx in (1, 12)" :value="idx">{{ idx }}月</option>
                </select>
                <select v-model="sel_day" class="form-select sel_date" style="float: left;" aria-label="day">
                    <option selected>日</option>
                    <option v-for="idx in (1, 31)" :value="idx">{{ idx }}日</option>
                </select>
                <button id="sel_date_btn" class="btn btn-info" @click="set_date()">设置</button>
            </div>

            <div class="card-footer text-muted">
                <div style="float: left;">当前今日签到日期：{{ year }} / {{ mon }} / {{ day }}</div>
                <div v-if="update_date_waiting" style="float: right;" class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

        </div>

        <div class="card">
            <div class="card-body">
                <div class="card-title">数据统计</div>
                <apexchart :width="'100%'" type="area" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div v-if="!on_list_detail">
                    <div class="card-title">所有的签到表</div>
                    <div class="card-subtitle mb-2 text-muted">请通过设置新的签到日期来增加新表</div>
                    <div v-if="all_list_waiting" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <ul class="list-group">

                        <li v-for="item in all_list" class="list-group-item">
                            <div style="float: left;">{{ item[0] }} / {{ item[1] }} / {{ item[2] }}</div>
                            <div style="float: right;" class="btn-group" role="group">
                                <button class="btn btn-outline-info btn-sm" @click="look_column(item)">查看</button>
                                <button class="btn btn-outline-danger btn-sm" @click="erase_column(item)">删除</button>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-if="on_list_detail">
                    <div class="card-title">
                        签到表预览
                        <button @click="on_list_detail = false;" style="float: right;" type="button" class="btn-close"
                            aria-label="Close"></button>
                    </div>
                    <div class="card-subtitle mb-2 text-muted">
                        日期 {{ detail_date[0] }} / {{ detail_date[1] }} / {{ detail_date[2] }}
                    </div>

                    <!-- <div v-if="true" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div> -->

                    <ul style="width: 50%; float: left;" class="list-group">
                        <li v-for="idx in detail_idx_mid" class="list-group-item">
                            <div style="float: left;"  class="text-sm-start">{{ idx }} {{ detail_list_name[idx - 1] }}
                            </div>
                            <button v-if="detail_list_data[idx - 1] == 1" style="float: right;"
                                class="btn btn-success btn-sm">签到</button>
                            <button v-if="detail_list_data[idx - 1] == 0" style="float: right;"
                                class="btn btn-danger btn-sm">缺勤</button>
                            <button v-if="detail_list_data[idx - 1] == 2" style="float: right;"
                                class="btn btn-warning btn-sm">请假</button>
                        </li>
                    </ul>
                    <ul style="width: 50%; float: right;" class="list-group">
                        <li v-for="idx in detail_idx_mid" class="list-group-item">
                            <div style="float: left;" class="text-sm-start">{{ detail_idx_mid + idx }} {{
                                detail_list_name[detail_idx_mid +
                                idx -
                                1] }}</div>
                            <button v-if="detail_list_data[detail_idx_mid + idx - 1] == 1" style="float: right;"
                                class="btn btn-success btn-sm">签到</button>
                            <button v-if="detail_list_data[detail_idx_mid + idx - 1] == 0" style="float: right;"
                                class="btn btn-danger btn-sm">缺勤</button>
                            <button v-if="detail_list_data[detail_idx_mid + idx - 1] == 2" style="float: right;"
                                class="btn btn-warning btn-sm">请假</button>
                        </li>
                    </ul>
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

#title {

    text-align: center;
    font-size: 4vw;
    margin-bottom: 8%;

}

@media (max-width: 600px) {
    #title {
        margin-bottom: 0;
    }

}

.sel_date {
    width: 40%;
    margin-bottom: 1%;

}

#sel_date_btn {
    width: 30%;
    margin-bottom: 1%;
    float: right;
}
</style>

<!-- <script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/libs/apexcharts/dist/apexcharts.min.js"
    defer></script> -->