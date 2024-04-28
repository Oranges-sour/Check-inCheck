<script setup>

import { ref } from 'vue';

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

</script>

<template>
    <div id="container">
        <div id="title">管理员</div>
        <div class="card">
            <div class="card-body">
                <div class="card-title">设置可更改的签到日期</div>
                <select class="form-select sel_date" aria-label="year">
                    <option selected>年</option>
                    <option value="2024">2024年</option>
                </select>
                <select class="form-select sel_date" aria-label="month">
                    <option selected>月</option>
                    <option v-for="idx in (1, 12)" :value="idx">{{ idx }}月</option>
                </select>
                <select class="form-select sel_date" aria-label="day">
                    <option selected>日</option>
                    <option v-for="idx in (1, 31)" :value="idx">{{ idx }}日</option>
                </select>
            </div>
            <div class="card-footer text-muted">
                当前日期：未设置
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="card-title">数据统计</div>
                <apexchart width="400" type="area" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>


</template>

<style scoped>
#container {
    width: min(90%, 600px);
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
</style>

<!-- <script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/libs/apexcharts/dist/apexcharts.min.js"
    defer></script> -->