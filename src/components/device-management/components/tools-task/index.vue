<script lang="ts" setup>
import { executeTask } from '@/api/device';
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import type { PlantProps } from '@/models/farm.type';
import { toolsType } from '@/models/task.type';
import { getPlantIndex } from '@/utils/getPlantIndex';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { App, Form } from 'ant-design-vue';
import { onMounted, onUnmounted, ref, toRaw, unref, watch } from 'vue';
import classes from './style.module.css';

const props = defineProps<{
  toolType: number;
  seeds: boolean;
  activeKey: string;
  allowPicking?: boolean;
}>();

const queryClient = useQueryClient();

const data = ref<PlantProps[] | undefined>([]);

const { message } = App.useApp();

const { on, off } = useEventEmitter();

const { farmConfig, setSelected, setPicking } = useContext();

const selected = ref<any[]>([]);

const modalRef = ref({
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  soilPositionX: 0,
  soilPositionY: 0,
  speedX: 0,
  speedY: 0,
  speedZ: 0,
  toolType: props.toolType,
  seedId: undefined as number | undefined,
});

const rulesRef = ref({
  seedId: [{ required: true, message: '请选择任务执行区域' }],
  speedX: [{ required: true, message: '请输入工具速度' }],
  speedY: [{ required: true, message: '请输入工具速度' }],
  speedZ: [{ required: true, message: '请输入工具速度' }],
  positionX: [{ required: true, message: '请输入坐标' }],
  positionY: [{ required: true, message: '请输入坐标' }],
  positionZ: [{ required: true, message: '请输入坐标' }],
  soilPositionX: [{ required: true, message: '请输入坐标' }],
  soilPositionY: [{ required: true, message: '请输入坐标' }],
});

const { validate, validateInfos } = Form.useForm(modalRef, rulesRef);

const mutation = useMutation({
  mutationKey: [MUTATIONS.EXEC_TASK],
  mutationFn: executeTask,
  onSuccess() {
    message.success(toolsType[props.toolType as 1 | 2 | 3] + '任务执行成功');
    modalRef.value.seedId = undefined;

    queryClient.invalidateQueries({
      queryKey: [QUERIES.FARM_CROP_LIST],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERIES.SEED_GROUP_LIST],
    });

    setPicking(false);
    setSelected([]);
    selected.value = [];
  },
});

function onExecution() {
  validate().then((value) => {
    const data = value;
    data.farmId = farmConfig?.value?.id;
    data.toolType = props.toolType;
    mutation.mutate(data);
  });
}

function onSelected(_: unknown, val: unknown) {
  const plant = val as PlantProps;

  modalRef.value.positionX = plant.positionX;
  modalRef.value.positionY = plant.positionY;
  modalRef.value.positionZ = plant.positionZ;

  modalRef.value.soilPositionX = plant.soilPositionX;
  modalRef.value.soilPositionY = plant.soilPositionY;

  setSelected([
    {
      ...plant,
      no: getPlantIndex(plant.soilPositionX, plant.soilPositionY),
    },
  ]);
}

function onClear() {
  modalRef.value.positionX = 0;
  modalRef.value.positionY = 0;
  modalRef.value.positionZ = 0;

  modalRef.value.soilPositionX = 0;
  modalRef.value.soilPositionY = 0;

  setPicking(false);
  setSelected([]);
}

function onPicking() {
  message.info('请选择需要执行的土地');

  setPicking({
    multiple: false,
    seeds: false,
  });
}

function onPickConfirm(_selected: never[]) {
  selected.value = toRaw(unref(_selected));

  if (selected.value.length) {
    if (props.toolType !== 1) {
      modalRef.value.seedId = 0;
    }
    modalRef.value = {
      ...modalRef.value,
      ...selected.value[0],
    };
  } else {
    modalRef.value.seedId = undefined;
  }
}

function onRemove() {
  modalRef.value.seedId = undefined;
  selected.value = [];
}

function getFarmCord(open: boolean) {
  if (open) {
    data.value = queryClient.getQueryData([QUERIES.FARM_CROP_LIST]);
  }
}

function reset() {
  modalRef.value.seedId = undefined;
  onClear();

  setPicking(false);
  setSelected([]);

  selected.value = [];
}

watch(() => props.activeKey, reset);

onMounted(() => {
  on('PICK_CONFIRM', onPickConfirm);
});

onUnmounted(() => {
  reset();
  off('PICK_CONFIRM', onPickConfirm);
});
</script>

<template>
  <a-flex vertical>
    <a-form layout="inline">
      <a-typography-paragraph :class="classes.label">
        设置种植工具速度 (%)
      </a-typography-paragraph>
      <a-form-item label="x" v-bind="validateInfos.speedX">
        <a-input-number v-model:value="modalRef.speedX" />
      </a-form-item>
      <a-form-item label="y" v-bind="validateInfos.speedY">
        <a-input-number v-model:value="modalRef.speedY" />
      </a-form-item>
      <a-form-item label="z" v-bind="validateInfos.speedZ">
        <a-input-number v-model:value="modalRef.speedZ" />
      </a-form-item>
      <a-divider />
      <a-typography-paragraph :class="classes.label">
        设置目的坐标 (cm)
      </a-typography-paragraph>
      <a-form-item v-if="!props.allowPicking" v-bind="validateInfos.seedId">
        <a-select
          v-model:value="modalRef.seedId"
          :options="data"
          :field-names="{
            label: 'name',
            value: 'id',
          }"
          allow-clear
          style="min-width: 150px"
          placeholder="请选执行区域"
          @select="onSelected"
          @clear="onClear"
          @dropdown-visible-change="getFarmCord"
        />
      </a-form-item>
      <a-form-item v-if="props.allowPicking" v-bind="validateInfos.seedId">
        <a-space>
          <a-tag
            v-for="i in selected"
            :class="classes.tags"
            closable
            @close.prevent="onRemove"
          >
            {{ i.no }}
          </a-tag>
          <a-button @click="onPicking">选择区域</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="x" v-bind="validateInfos.positionX">
        <a-input-number
          v-model:value="modalRef.positionX"
          :max="farmConfig?.width"
          style="width: 50px"
        />
      </a-form-item>
      <a-form-item label="y" v-bind="validateInfos.positionY">
        <a-input-number
          v-model:value="modalRef.positionY"
          :max="farmConfig?.length"
          style="width: 50px"
        />
      </a-form-item>
      <a-form-item label="z" v-bind="validateInfos.positionZ">
        <a-input-number
          v-model:value="modalRef.positionZ"
          readonly
          style="width: 50px"
        />
      </a-form-item>
      <a-button html-type="submit" @click="onExecution">执行任务</a-button>
    </a-form>
  </a-flex>
</template>
