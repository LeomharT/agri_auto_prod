<script setup lang="ts">
import { exportTaskLog, getTaskRecordList } from '@/api/data';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { compareSymbol, toolsType } from '@/models/task.type';
import { useQuery } from '@tanstack/vue-query';
import type { TableProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import dayjs, { Dayjs } from 'dayjs';
import { computed, h, ref } from 'vue';
import classes from './style.module.css';
const { farmConfig } = useContext();

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
  { key: 'executeTime', dataIndex: 'executeTime', title: '执行时间' },
];

const params = ref({
  Name: '',
  ToolType: undefined,
  DateRange: [dayjs().subtract(1, 'week'), dayjs()] as [Dayjs, Dayjs],
  PageSize: 100,
});

const query = useQuery({
  queryKey: [QUERIES.TASK_LOG],
  queryFn: () =>
    getTaskRecordList(
      computed(() => ({
        ...params.value,
        FarmId: farmConfig?.value?.id,
      })).value
    ),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: {
    items: [],
    page: 1,
    pageSize: 20,
    total: 8,
  },
});

const selectedRowKeys = ref<Key[]>([]);

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange(_selectedRowKeys) {
      selectedRowKeys.value = _selectedRowKeys;
    },
  } as TableProps['rowSelection'];
});

async function onExport() {
  await exportTaskLog(
    computed(() => ({
      ...params.value,
      FarmId: farmConfig?.value?.id,
    })).value
  );
}

function onSubmit() {
  selectedRowKeys.value = [];

  query.refetch();
}

function onReset() {
  params.value.DateRange = [dayjs().subtract(1, 'week'), dayjs()];
  params.value.Name = '';
  params.value.ToolType = undefined;

  selectedRowKeys.value = [];

  query.refetch();
}
</script>
<template>
  <a-card title="任务日志" :body-style="{ padding: 0 }">
    <template #extra>
      <a-button @click="onExport">导出日志</a-button>
    </template>
    <a-form
      layout="inline"
      :model="params"
      :class="classes.filter"
      @finish="onSubmit"
    >
      <a-form-item name="Name">
        <a-input
          v-model:value="params.Name"
          style="width: 100px"
          type="text"
          placeholder="请输入任务名称"
        />
      </a-form-item>
      <a-form-item name="ToolType">
        <a-select
          v-model:value="params.ToolType"
          style="width: 100px"
          placeholder="请选择工具"
          :allow-clear="false"
          :options="[
            { value: 1, label: '种植' },
            { value: 2, label: '浇水' },
            { value: 3, label: '除草' },
          ]"
        />
      </a-form-item>
      <a-form-item name="DateRange">
        <a-range-picker
          v-model:value="params.DateRange"
          style="width: 200px"
          :allow-clear="false"
        />
      </a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit"> 搜索 </a-button>
        <a-button html-type="reset" @click="onReset"> 重置 </a-button>
      </a-space>
    </a-form>
    <a-table
      row-key="id"
      size="small"
      :columns="columns"
      :loading="query.isFetching.value"
      :data-source="query.data.value.items"
      :row-selection="rowSelection"
      :pagination="{
        pageSize: query.data.value.pageSize,
        total: query.data.value.total,
      }"
    />
  </a-card>
</template>
