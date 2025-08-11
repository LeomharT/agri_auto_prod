<script setup lang="ts">
import { getDailyTaskCountList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import dayjs, { Dayjs } from 'dayjs';
import { computed, ref } from 'vue';
import classes from './style.module.css';

const emit = defineEmits<{
  (e: 'change', value: Dayjs): void;
}>();

const { farmConfig } = useContext();

const queryClient = useQueryClient();

const value = ref<Dayjs>(dayjs());

const search = computed(() => ({
  FarmId: farmConfig!.value.id.toString(),
  Year: value.value.get('y').toString(),
  Month: (value.value.get('M') + 1).toString(),
}));

const query = useQuery({
  queryKey: [QUERIES.TASK_CALENDAR],
  queryFn: () => getDailyTaskCountList(search.value),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

function onChange(value: Dayjs | string) {
  value = dayjs(value);
  search.value.Year = value.get('y').toString();
  search.value.Month = (value.get('M') + 1).toString();

  query.refetch();
}

function onSelect(value: Dayjs | string) {
  emit('change', dayjs(value));

  queryClient.invalidateQueries({
    queryKey: [QUERIES.TASK_LIST],
  });
}
</script>

<template>
  <a-card title="任务日期" :body-style="{ padding: '1px 0 0' }">
    <a-spin :spinning="query.isFetching.value">
      <a-calendar
        v-model:value="value"
        mode="month"
        :fullscreen="false"
        :class="classes.calendar"
        @select="onSelect"
        @panel-change="onChange"
      >
        <template #dateCellRender="{ current }">
          <a-badge
            :count="
              query.data.value.filter((item) =>
                dayjs(item.date).isSame(current, 'day')
              )[0]?.count
            "
            size="small"
            :class="classes.badge"
          />
        </template>
      </a-calendar>
    </a-spin>
  </a-card>
</template>
