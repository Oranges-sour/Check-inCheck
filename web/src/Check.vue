<script setup>
import CheckName from './components/CheckName.vue'
import SelectRoom from './components/SelectRoom.vue'
import { ref } from 'vue'
import { web_get_active_date } from './net/Net';

let room = ref(0);
let is_sel = ref(false);
let is_load_finish = ref(false);

let year = ref(0);
let mon = ref(0);
let day = ref(0);

web_get_active_date((result) => {
  year.value = result[0];
  mon.value = result[1];
  day.value = result[2];

});


function sel(num) {
  is_sel.value = true;
  room.value = num;
}

function reset_sel() {
  is_load_finish.value = false;
  is_sel.value = false;
  room.value = 0;
}

</script>


<template>


  <div id="container">

    <div id="title">晚自习点名器</div>

    <div id="date">日期：{{ year }}/{{ mon }}/{{ day }}</div>
    <div id="d1">如日期出现错误，请联系管理员更改</div>

    <div id="sel_room">
      <SelectRoom v-if="!is_sel" @sel="(num) => { sel(num); }" />
    </div>


    <div id="card">
      <CheckName v-if="is_sel" :room="room" :year="year" :month="mon" :day="day" @load_finish="is_load_finish = true"
        @close="reset_sel()">
      </CheckName>
    </div>


    <!-- <div class="rbbtn">
      <button style="width: 100%;" v-if="is_load_finish" class="btn btn-success" @click="">
        记录当前签到结果.<span style="color: crimson; font-weight: bold;">若中途结束，未轮到的人将保持状态不变！</span>
      </button>
    </div> -->
    <div class="rbbtn">
      <button style="width: 100%;" v-if="is_load_finish" class="btn btn-danger" @click="reset_sel">
        不记录当前签到结果，重新选择教室
      </button>
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

#date {
  text-align: center;
  font-size: 2vw;
  margin-bottom: 1%;
}

#d1 {
  text-align: center;
  font-size: 1.5vw;
  margin-bottom: 4%;
}

@media (max-width: 600px) {
  #title {
    margin-bottom: 0;
  }

}

.rbbtn {
  width: 60%;
  margin: auto;
  margin-bottom: 2%;
}



#card,
#sel_room,
#crbtn {
  width: 100%;
  height: 100%;
}
</style>
