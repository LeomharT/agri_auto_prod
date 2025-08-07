<script setup lang="ts">
import { addOrUpdateTask, getSensorDevicePropList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import { compareSymbol } from '@/models/task.type';
import { IconPlus } from '@tabler/icons-vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { App, type ModalProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
import { computed, onMounted, onUnmounted, ref, toRaw, unref } from 'vue';
import classes from './style.module.css';

const props = defineProps<ModalProps>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

const queryClient = useQueryClient();

const { message } = App.useApp();

const { farmConfig, setPicking, setSelected } = useContext();

const { on, off } = useEventEmitter();

const modalRef = ref({
  name: '',
  toolType: undefined,
  deviceKey: undefined,
  thingsProp: undefined,
  deviceTaskCronType: 1,
  compareValueX: undefined,
  compareValueY: undefined,
  compareType: 1,
  onceExecuteTime: dayjs(),
  setTime: dayjs(),
  weekRange: [],
  positionList: [],
  dateRange: [dayjs(), dayjs()] as [Dayjs, Dayjs],
});

const rulesRef = ref({
  name: [{ required: true, message: '请输入任务名称' }],
  toolType: [{ required: true, message: '请选择工具类型' }],
  deviceKey: [{ required: true, message: '请选择设备' }],
  thingsProp: [{ required: true, message: '请选择数据源' }],
  deviceTaskCronType: [{ required: true, message: '请选择任务类型' }],
  compareValueX: [{ required: true, message: '请输入比较值X' }],
  compareValueY: [{ required: false }],
  compareType: [{ required: true, message: '请输入比较值类型' }],
  onceExecuteTime: [{ required: false }],
  setTime: [{ required: false }],
  weekRange: [{ required: false }],
  positionList: [{ required: true, message: '请选择执行区域', type: 'array' }],
  dateRange: [{ required: true, message: '请选择起始时间', type: 'array' }],
});

const { validate, validateInfos } = useForm(modalRef, rulesRef);

const query = useQuery({
  queryKey: [QUERIES.TASK_DEVICE],
  queryFn: () => getSensorDevicePropList(farmConfig!.value!.id),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.CREATE_TASK],
  mutationFn: addOrUpdateTask,
  onSuccess() {
    queryClient.invalidateQueries({
      queryKey: [QUERIES.TASK_LIST],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERIES.TASK_CALENDAR],
    });
    message.success('任务信息更新成功');
    onCancel();
  },
});

const deviceItems = computed(() => {
  return query.data.value.reduce((prev, curr) => {
    const key = prev.filter((item) => item.deviceKey === curr.deviceKey);
    if (!key.length) prev.push(curr);
    return prev;
  }, [] as typeof query.data.value);
});

const thingsItems = computed(() => {
  return query.data.value.filter(
    (item) => item.deviceKey === modalRef.value.deviceKey
  );
});

function onOk() {
  validate().then((data) => {
    const _data = {
      ...data,
      onceExecuteTime: data.onceExecuteTime.format('YYYY-MM-DD HH:mm:ss'),
      setTime: data.setTime.format('HH:mm:ss'),
      farmId: farmConfig?.value?.id,
    };
    if (_data.deviceTaskCronType !== 1) {
      delete _data.onceExecuteTime;
    }
    if (_data.deviceTaskCronType === 1) {
      delete _data.setTime;
      delete _data.weekRange;
      delete _data.dateRange;
    }
    if (_data.deviceTaskCronType === 2) {
      delete _data.weekRange;
    }

    mutation.mutate(_data);
  });
}

function onCancel() {
  modalRef.value = {
    name: '',
    toolType: undefined,
    deviceKey: undefined,
    thingsProp: undefined,
    deviceTaskCronType: 1,
    compareValueX: undefined,
    compareValueY: undefined,
    compareType: 1,
    onceExecuteTime: dayjs(),
    setTime: dayjs(),
    weekRange: [],
    positionList: [],
    dateRange: [dayjs(), dayjs()],
  };

  props.onCancel?.call({}, {} as MouseEvent);
}

function onPicking(e: MouseEvent) {
  message.info('请选择需要执行的土地');

  props.onCancel?.call({}, e);
  setPicking(true);

  if (modalRef.value.positionList.length) {
    setSelected(modalRef.value.positionList);
  }
}

function onDelete(index: number) {
  modalRef.value.positionList.splice(index, 1);
}

onMounted(() => {
  on('PICK_CONFIRM', (_selected) => {
    const selected = toRaw(unref(_selected));
    modalRef.value.positionList = selected;
    emit('confirm');
  });
});

onUnmounted(() => {
  off('PICK_CONFIRM');
});
</script>

<template>
  <a-modal
    title="任务信息"
    :open="props.open"
    :confirm-loading="mutation.isPending.value"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form layout="vertical">
      <a-form-item v-bind="validateInfos.name" name="name" label="任务名称">
        <a-input v-model:value="modalRef.name" placeholder="请输入任务名称" />
      </a-form-item>
      <a-form-item
        v-bind="validateInfos.positionList"
        name="positionList"
        label="执行区域"
      >
        <div :class="classes.area">
          <a-tag
            v-for="({ no }, index) in modalRef.positionList"
            :class="classes.tags"
            closable
            @close.prevent="onDelete(index)"
          >
            {{ no }}
          </a-tag>
          <a-button
            ghost
            type="primary"
            :class="classes.button"
            @click="onPicking"
          >
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
        </div>
      </a-form-item>
      <a-form-item
        v-bind="validateInfos.toolType"
        name="toolType"
        label="工具类型"
      >
        <a-select
          v-model:value="modalRef.toolType"
          placeholder="请选择工具类型"
          :options="[
            // { value: 1, label: '种植' },
            { value: 2, label: '浇水' },
            { value: 3, label: '除草' },
          ]"
        />
      </a-form-item>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            v-bind="validateInfos.deviceKey"
            name="deviceKey"
            label="任务设备"
          >
            <a-select
              v-model:value="modalRef.deviceKey"
              placeholder="请选择设备"
              :options="deviceItems"
              :field-names="{ label: 'deviceName', value: 'deviceKey' }"
              @change="modalRef.thingsProp = undefined"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-bind="validateInfos.thingsProp"
            name="thingsProp"
            label="设备数据源"
          >
            <a-select
              v-model:value="modalRef.thingsProp"
              placeholder="请选择数据源"
              :options="thingsItems"
              :field-names="{ label: 'propName', value: 'propKey' }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div :class="classes.compare">
        <a-form-item
          v-bind="validateInfos.compareValueX"
          name="compareValueX"
          label="比较值X"
        >
          <a-input-number
            v-model:value="modalRef.compareValueX"
            placeholder="请输入比较值X"
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.compareType"
          name="compareType"
          label="比较类型"
        >
          <a-select
            v-model:value="modalRef.compareType"
            placeholder="请选择比较类型"
            :options="
              compareSymbol.map((item, index) => ({
                label: item,
                value: index + 1,
              }))
            "
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.compareValueY"
          name="compareValueY"
          label="比较值Y"
        >
          <a-input-number
            v-model:value="modalRef.compareValueY"
            placeholder="请输入比较值Y"
          />
        </a-form-item>
      </div>
      <a-form-item
        v-bind="validateInfos.deviceTaskCronType"
        name="deviceTaskCronType"
        label="任务类型"
      >
        <a-select
          v-model:value="modalRef.deviceTaskCronType"
          placeholder="请选择任务类型"
          :options="[
            { value: 1, label: '单次任务' },
            { value: 2, label: '每日任务' },
            { value: 3, label: '每周任务' },
          ]"
        />
      </a-form-item>
      <div :class="classes.date">
        <a-form-item
          v-if="modalRef.deviceTaskCronType === 1"
          label="执行日期"
          name="onceExecuteTime"
          v-bind="validateInfos.onceExecuteTime"
        >
          <a-date-picker
            v-model:value="modalRef.onceExecuteTime"
            show-time
            :allow-clear="false"
            placeholder="请选择任务执行日期"
          />
        </a-form-item>
        <a-space
          v-if="
            modalRef.deviceTaskCronType === 2 ||
            modalRef.deviceTaskCronType === 3
          "
        >
          <a-form-item
            v-bind="validateInfos.setTime"
            label="执行日期"
            name="setTime"
          >
            <a-time-picker
              v-model:value="modalRef.setTime"
              :allow-clear="false"
              placeholder="请选择任务执行日期"
            />
          </a-form-item>
          <a-form-item
            v-bind="validateInfos.dateRange"
            name="dateRange"
            label="起始日期"
          >
            <a-range-picker
              v-model:value="modalRef.dateRange"
              :allow-clear="false"
            />
          </a-form-item>
        </a-space>
        <a-form-item v-if="modalRef.deviceTaskCronType === 3">
          <a-checkbox-group
            v-model:value="modalRef.weekRange"
            name="checkboxgroup"
            :options="[
              { value: 1, label: '周一' },
              { value: 2, label: '周二' },
              { value: 3, label: '周三' },
              { value: 4, label: '周四' },
              { value: 5, label: '周五' },
              { value: 6, label: '周六' },
              { value: 7, label: '周日' },
            ]"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
