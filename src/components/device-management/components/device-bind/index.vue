<script lang="ts" setup>
import { addOrUpdateBindDevice } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import type { Device } from '@/models/device.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { App, type ModalProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import type { SelectValue } from 'ant-design-vue/es/select';
import type { DefaultOptionType } from 'ant-design-vue/es/vc-cascader';
import { ref, watch } from 'vue';
import { getAllDeviceList, getProjectList } from '../../../../api/industry';
import { QUERIES } from '../../../../data/queries';

const props = defineProps<ModalProps & { initialData?: Device }>();

const bindDevice = ref<any>({});

const queryClient = useQueryClient();

const { message } = App.useApp();

const { farmConfig } = useContext();

const modelRef = ref<{
  projectId?: number;
  deviceId?: number;
  deviceBindType?: number;
}>({
  projectId: undefined,
  deviceId: undefined,
  deviceBindType: undefined,
});

const rulesRef = ref({
  projectId: [{ required: true, message: '请选择行业云项目' }],
  deviceId: [{ required: true, message: '请选择行业云设备' }],
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

const mutation = useMutation({
  mutationKey: [MUTATIONS.BIND_DEVICE],
  mutationFn: addOrUpdateBindDevice,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: [QUERIES.BIND_DEVICES] });
    queryClient.invalidateQueries({ queryKey: [QUERIES.SENSOR_DATA] });

    message.success('设备信息更新成功');
    onCancel();
  },
});

function onOk() {
  validate().then((_data) => {
    const data = {
      ...bindDevice.value,
      ..._data,
      farmId: farmConfig?.value.id,
      id: props.initialData?.id,
    };

    mutation.mutate(data);
  });
}

function onCancel() {
  props.onCancel?.call({}, {} as any);
  resetFields();
  bindDevice.value = {};
}

async function onProjectChange(val: DefaultOptionType) {
  await devices.refetch();
  modelRef.value.deviceId = undefined;

  // Set submit value
  bindDevice.value.projectId = val.id;
}

function onDeviceChange(val: SelectValue) {
  modelRef.value.deviceId = val as number;

  const device = devices.data.value.filter((item) => item.id === val)[0];
  if (device) {
    bindDevice.value = {
      ...bindDevice.value,
      deviceId: device.id,
      deviceKey: device.deviceKey,
      deviceName: device.name,
      productId: device.productId,
      productName: device.productName,
    };
  }
}

watch(props, async () => {
  if (props.open) {
    if (props.initialData) {
      modelRef.value = {
        projectId: props.initialData.projectId,
        deviceBindType: props.initialData.deviceBindType,
      };

      await onProjectChange({ id: props.initialData.productId });
      onDeviceChange(props.initialData.deviceId);
    }
  }
});
</script>

<template>
  <a-modal
    title="绑定设备"
    :destroy-on-close="true"
    :open="props.open"
    :confirm-loading="mutation.isPending.value"
    @ok="onOk"
    @cancel="onCancel"
  >
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
        v-bind="validateInfos.deviceId"
        label="行业云设备"
        name="deviceId"
      >
        <a-select
          v-model:value="modelRef.deviceId"
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
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
