<script lang="ts" setup>
import { ref } from 'vue';
import DeviceManage from './components/device-manage/index.vue';
import Monitor from './components/monitor/index.vue';
import classes from './style.module.css';
const isMonitor = ref<boolean>(false);

function switchPanel() {
  isMonitor.value = !isMonitor.value;
}
</script>

<template>
  <div :class="classes.layout">
    <div v-if="!isMonitor" :class="classes.grid">
      <device-manage />
      <tools-manage @siwtch="switchPanel" />
    </div>
    <div v-if="isMonitor">
      <monitor @back="switchPanel" />
    </div>
  </div>
</template>
