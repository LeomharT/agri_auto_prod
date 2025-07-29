<script setup lang="ts">
import DataHistory from './components/data-history/index.vue';
import TaskLog from './components/task-log/index.vue';
</script>
<template>
  <a-flex vertical gap="middle">
    <task-log />
    <data-history />
  </a-flex>
</template>
