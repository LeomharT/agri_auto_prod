<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/_util/type';
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
import TaskCalendar from './components/task-calendar/index.vue';
import TaskPlan from './components/task-plan/index.vue';

const date = ref(dayjs());
const selected = ref<Key[]>([]);

function onCalendarChange(value: Dayjs) {
  date.value = value;
  selected.value = [];
}
</script>
<template>
  <a-flex vertical gap="middle">
    <task-calendar @change="onCalendarChange" />
    <task-plan
      :date="date"
      :selected="selected"
      @selected="(keys) => (selected = keys)"
    />
  </a-flex>
</template>
