<script setup lang="ts">
import { deleteTask, getTaskItem, getTaskList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import { compareSymbol, toolsType, type Task } from '@/models/task.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { App, type TableProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import dayjs, { Dayjs } from 'dayjs';
import { computed, ref } from 'vue';
import TaskInfo from '../task-info/index.vue';
import classes from './style.module.css';

const props = withDefaults(defineProps<{ date: Dayjs; selected: Key[] }>(), {
  date: () => dayjs(),
  selected: () => [],
});

const emit = defineEmits<{
  (e: 'selected', value: Key[]): void;
}>();

const queryClient = useQueryClient();

const { message, modal } = App.useApp();

const { farmConfig, picking } = useContext();

const open = ref(false);

const task = ref<Task>();

const params = computed(() => ({
  FarmId: farmConfig?.value?.id,
  QueryDate: props.date.format('YYYY-MM-DD HH:mm:ss'),
  PageSize: 100,
}));

const columns: TableProps['columns'] = [
  { key: 'name', dataIndex: 'name', title: '任务事件' },
  { key: 'toolType', dataIndex: 'toolType', title: '工具' },
  { key: 'thingsPropName', dataIndex: 'thingsPropName', title: '数据源' },
  { key: 'compareValueX', dataIndex: 'compareValueX', title: '触发规则' },
  { key: 'nextExecuteTime', dataIndex: 'nextExecuteTime', title: '执行时间' },
  { key: 'options', title: '操作' },
];

const query = useQuery({
  queryKey: [QUERIES.TASK_LIST],
  queryFn: () => getTaskList(params.value),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: {
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
  },
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.DELETE_TASK],
  mutationFn: deleteTask,
  onSuccess() {
    message.success('任务删除成功');
    emit('selected', []);

    query.refetch();
    queryClient.invalidateQueries({
      queryKey: [QUERIES.TASK_CALENDAR],
    });
  },
});

const mutationTask = useMutation({
  mutationKey: [MUTATIONS.TASK_DETAIL],
  mutationFn: getTaskItem,
  onSuccess(data) {
    task.value = data;
    onOpen();
  },
});

const rowSelection = computed(() => {
  return {
    hideSelectAll: true,
    selectedRowKeys: props.selected,
    onChange(selectedRowKeys) {
      emit('selected', selectedRowKeys);
    },
  } as TableProps['rowSelection'];
});

function onOpen() {
  open.value = true;
}

function onCancel() {
  open.value = false;
  task.value = undefined;
}

function onDelete(ids: number[]) {
  modal.confirm({
    title: '删除任务',
    content: '您确定要删除所选的任务吗?',
    onOk() {
      mutation.mutate(ids);
    },
  });
}
</script>

<template>
  <a-card title="计划任务" :body-style="{ padding: 0 }">
    <task-info
      :open="open"
      :initial-value="task"
      @confirm="onOpen"
      @cancel="onCancel"
    />
    <template #extra>
      <a-button type="primary" :disabled="!!picking" @click="onOpen">
        添加任务
      </a-button>
    </template>
    <div v-if="!!props.selected.length" :class="classes.alert">
      <span> 选中 {{ props.selected.length }} 条目 </span>
      <a-space>
        <a-button
          danger
          size="small"
          type="text"
          @click="onDelete(props.selected as number[])"
        >
          删除任务
        </a-button>
        <a-button size="small" type="text" @click="emit('selected', [])">
          取消选中
        </a-button>
      </a-space>
    </div>
    <a-table
      size="small"
      row-key="id"
      :columns="columns"
      :loading="query.isFetching.value"
      :data-source="query.data.value.items"
      :row-selection="rowSelection"
      :pagination="{
        pageSize: query.data.value.pageSize,
        total: query.data.value.total,
      }"
    >
      <template #bodyCell="{ text, column, record }">
        <span v-if="column.key === 'toolType'">
          {{ toolsType[text as '1' | '2' | '3'] }}
        </span>
        <span v-if="column.key === 'compareValueX'">
          {{
            `${record?.compareValueY ? `${record?.compareValueY}%` : ''}
             ${compareSymbol[record.compareType - 1]}
             ${record?.compareValueX}%`
          }}
        </span>
        <a-button
          v-if="column.key === 'options'"
          size="small"
          type="link"
          style="color: #00b96b"
          :loading="mutationTask.isPending.value"
          @click="mutationTask.mutate(record.id)"
        >
          编辑
        </a-button>
      </template>
    </a-table>
  </a-card>
</template>
