<script setup lang="ts">
import DataHistory from './components/data-history/index.vue';
import TaskLog from './components/task-log/index.vue';
import classes from './style.module.css';
</script>
<template>
  <div :class="classes.layout">
    <task-log />
    <data-history />
  </div>
</template>
