<script setup lang="ts">
import { getTaskList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { compareSymbol, toolsType } from '@/models/task.type';
import { useQuery } from '@tanstack/vue-query';
import type { TableProps } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { computed, h } from 'vue';

const props = withDefaults(defineProps<{ date: Dayjs }>(), {
  date: () => dayjs(),
});

const { farmConfig } = useContext();

const params = computed(() => ({
  FarmId: farmConfig?.value?.id,
  QueryDate: props.date.format('YYYY-MM-DD hh:mm:ss'),
}));

const columns: TableProps['columns'] = [
  { key: 'name', dataIndex: 'name', title: '任务事件' },
  {
    key: 'toolType',
    dataIndex: 'toolType',
    title: '工具',
    customRender(opt) {
      return h('span', {}, `${toolsType[opt.text as '1' | '2' | '3']}`);
    },
  },
  { key: 'thingsPropName', dataIndex: 'thingsPropName', title: '数据源' },
  {
    key: 'compareValueX',
    dataIndex: 'compareValueX',
    title: '触发规则',
    customRender(opt) {
      return h(
        'span',
        {},
        `${opt.record?.compareValueY ? `${opt.record?.compareValueY}%` : ''}
        ${compareSymbol[opt.record.compareType - 1]}
        ${opt.record?.compareValueX}%`
      );
    },
  },
  { key: 'nextExecuteTime', dataIndex: 'nextExecuteTime', title: '执行时间' },
];

const query = useQuery({
  queryKey: [QUERIES.TASK_LIST],
  queryFn: () => getTaskList(params.value),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: {
    items: [],
    page: 1,
    pageSize: 20,
    total: 8,
  },
});

const rowSelection = computed(() => {
  return {
    hideSelectAll: true,
  } as TableProps['rowSelection'];
});
</script>

<template>
  <a-card title="计划任务" :body-style="{ padding: 0 }">
    <a-table
      size="small"
      :columns="columns"
      :loading="query.isFetching.value"
      :data-source="query.data.value.items"
      :row-selection="rowSelection"
      :pagination="{
        current: query.data.value.page,
        pageSize: query.data.value.pageSize,
        total: query.data.value.total,
      }"
    />
  </a-card>
</template>
