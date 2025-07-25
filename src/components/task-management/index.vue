<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import TaskCalendar from './components/task-calendar/index.vue';
import TaskPlan from './components/task-plan/index.vue';

const date = ref(dayjs());
</script>
<template>
  <a-flex vertical gap="middle">
    <task-calendar @change="(value) => (date = value)" />
    <task-plan :date="date" />
  </a-flex>
</template>
