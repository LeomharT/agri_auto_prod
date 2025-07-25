<script setup lang="ts">
import { compareSymbol } from '@/models/task.type';
import type { ModalProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import { ref } from 'vue';
import classes from './style.module.css';

const props = defineProps<ModalProps>();

const modalRef = ref({
  name: '',
  toolType: undefined,
  deviceTaskCronType: undefined,
  compareValueX: undefined,
  compareValueY: undefined,
  compareType: 1,
});

const rulesRef = ref({
  name: [{ required: true, message: '请输入任务名称' }],
  toolType: [{ required: true, message: '请选择工具类型' }],
  deviceTaskCronType: [{ required: true, message: '请选择任务类型' }],
  compareValueX: [{ required: true, message: '请输入比较值X' }],
  compareType: [{ required: true, message: '请输入比较值类型' }],
});

const { validate, validateInfos } = useForm(modalRef, rulesRef);

function onOk() {
  validate().then((data) => {
    console.log(data);
  });
}

function onCancel() {
  modalRef.value = {
    name: '',
    toolType: undefined,
    deviceTaskCronType: undefined,
    compareValueX: undefined,
    compareValueY: undefined,
    compareType: 1,
  };

  props.onCancel?.call({}, {} as MouseEvent);
}
</script>

<template>
  <a-modal :open="props.open" @ok="onOk" @cancel="onCancel" title="任务信息">
    <a-form layout="vertical">
      <a-form-item v-bind="validateInfos.name" name="name" label="任务名称">
        <a-input v-model:value="modalRef.name" placeholder="请输入任务名称" />
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
            { value: 1, label: '种植' },
            { value: 2, label: '浇水' },
            { value: 3, label: '除草' },
          ]"
        />
      </a-form-item>
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
    </a-form>
  </a-modal>
</template>
