<script lang="ts" setup>
import { ref } from 'vue';
import DeviceManage from './components/device-manage/index.vue';
import Monitor from './components/monitor/index.vue';
import ToolsManage from './components/tools-manage/index.vue';

const isMonitor = ref<boolean>(false);

function switchPanel() {
  isMonitor.value = !isMonitor.value;
}
</script>

<template>
  <div>
    <a-flex vertical gap="middle" v-if="!isMonitor">
      <device-manage />
      <tools-manage @siwtch="switchPanel" />
    </a-flex>
    <div v-if="isMonitor">
      <monitor @back="switchPanel" />
    </div>
  </div>
</template>
