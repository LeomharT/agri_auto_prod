<script lang="ts" setup>
import DeviceManage from './components/device-manage/index.vue';
import ToolsManage from './components/tools-manage/index.vue';
</script>

<template>
  <a-flex gap="middle" vertical>
    <device-manage />
    <tools-manage />
  </a-flex>
</template>
