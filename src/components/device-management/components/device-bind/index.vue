<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import type { ModalProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import type { SelectValue } from 'ant-design-vue/es/select';
import type { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import { ref } from 'vue';
import { getAllDeviceList, getProjectList } from '../../../../api/industry';
import { QUERIES } from '../../../../data/queries';

const props = defineProps<ModalProps>();

const bindDevice = ref<any>({});

const modelRef = ref({
  projectId: undefined,
  deviceKey: undefined,
  deviceBindType: undefined,
});

const rulesRef = ref({
  projectId: [{ required: true, message: '请选择行业云项目' }],
  deviceKey: [{ required: true, message: '请选择行业云设备' }],
  deviceBindType: [{ required: true, message: '请选择设备类型' }],
});

const { validateInfos, validate, resetFields } = useForm(modelRef, rulesRef);

const projects = useQuery({
  queryKey: [QUERIES.PROJECT_LIST],
  queryFn: getProjectList,
  initialData: [],
});

const devices = useQuery({
  queryKey: [QUERIES.DEVICE_LIST, modelRef.value.projectId],
  queryFn: () => getAllDeviceList(modelRef.value.projectId ?? 0),
  initialData: [],
});

function onOk() {
  validate().then((_data) => {
    const data = {
      ...bindDevice.value,
      ..._data,
    };

    console.log(data);
  });
}

function onCancel() {
  props.onCancel?.call({}, {} as any);
  resetFields();
  bindDevice.value = {};
}

function onProjectChange(val: DefaultOptionType) {
  devices.refetch();
  modelRef.value.deviceKey = undefined;

  // Set submit value
  bindDevice.value.projectId = val.id;
}

function onDeviceChange(val: SelectValue) {
  const device = devices.data.value.filter((item) => item.id === val)[0];
  if (device) {
    bindDevice.value = {
      ...bindDevice.value,
      ...device,
    };
  }
}
</script>

<template>
  <a-modal title="绑定设备" :open="props.open" @ok="onOk" @cancel="onCancel">
    <a-form layout="vertical">
      <a-form-item
        v-bind="validateInfos.projectId"
        label="行业云项目"
        name="projectId"
      >
        <a-select
          v-model:value="modelRef.projectId"
          placeholder="请选择行业云项目"
          :options="projects.data.value"
          :field-names="{ label: 'name', value: 'id' }"
          @change="(_, val) => onProjectChange(val)"
        />
      </a-form-item>
      <a-form-item
        v-bind="validateInfos.deviceKey"
        label="行业云设备"
        name="deviceKey"
      >
        <a-select
          v-model:value="modelRef.deviceKey"
          placeholder="请选择行业云设备"
          :options="devices.data.value"
          :field-names="{ label: 'name', value: 'id' }"
          @change="onDeviceChange"
        />
      </a-form-item>
      <a-form-item
        v-bind="validateInfos.deviceBindType"
        label="设备类型"
        name="deviceBindType"
      >
        <a-select
          v-model:value="modelRef.deviceBindType"
          placeholder="请选择设备类型"
          :options="[
            { label: '鸿蒙网关', value: 1 },
            { label: '传感器', value: 2 },
            { label: '机械臂', value: 3 },
          ]"
          @change="onDeviceChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
