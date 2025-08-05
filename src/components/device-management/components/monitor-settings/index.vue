<script setup lang="ts">
import { getUserConfig, updateUserConfig } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import type { DaHuaConfig } from '@/models/device.type';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { Form, message, type ModalProps } from 'ant-design-vue';
import { computed, ref, watch } from 'vue';

const props = defineProps<ModalProps>();

const { farmConfig } = useContext();

const query = useQuery({
  queryKey: [QUERIES.USER_CONFIG],
  queryFn: () => getUserConfig(farmConfig?.value?.id!),
  enabled:
    computed(() => Boolean(farmConfig?.value?.id)) &&
    computed(() => props.open),
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.USER_CONFIG_SAVE],
  mutationFn: updateUserConfig,
  onSuccess() {
    message.success('配置更新成功');
    props.onCancel?.call({}, {} as MouseEvent);
  },
});

const modelRef = ref({
  // 大华产品Id
  daHuaProductId: '',
  // 大华AccessKey
  daHuaAccessKey: '',
  // 大华AccessSecrect
  daHuaAccessSecrect: '',
  // 大华监控设备码
  daHuaMonitorSn: '',
  // 大华监控设备密码
  daHuaMonitorPassword: '',
  // 大华监控设备品类
  daHuaMonitorCategory: '',
});

const rulesRef = ref({
  daHuaProductId: [{ required: true, message: '请输入大华产品Id' }],
  daHuaAccessKey: [{ required: true, message: '请输入大华AccessKey' }],
  daHuaAccessSecrect: [{ required: true, message: '请输入大华AccessSecrect' }],
  daHuaMonitorSn: [{ required: true, message: '请输入大华监控设备码' }],
  daHuaMonitorPassword: [{ required: true, message: '请输入大华监控设备密码' }],
  daHuaMonitorCategory: [{ required: true, message: '请输入大华监控设备品类' }],
});

const { validate, validateInfos } = Form.useForm(modelRef, rulesRef);

function onOk() {
  validate().then((data) => {
    mutation.mutate({
      ...data,
      farmId: farmConfig?.value?.id,
    });
  });
}

watch(
  () => query.data.value,
  (data: DaHuaConfig | undefined) => {
    if (data) {
      modelRef.value = {
        ...data,
      };
    }
  }
);
</script>

<template>
  <a-modal
    title="监控设置"
    :open="props.open"
    :confirm-loading="mutation.isPending.value"
    @ok="onOk"
    @cancel="props.onCancel"
  >
    <a-spin :spinning="query.isFetching.value">
      <a-form layout="vertical">
        <a-form-item v-bind="validateInfos.daHuaProductId" label="大华产品Id">
          <a-input
            v-model:value="modelRef.daHuaProductId"
            placeholder="请输入大华产品Id"
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.daHuaAccessKey"
          label="大华AccessKey"
        >
          <a-input
            v-model:value="modelRef.daHuaAccessKey"
            placeholder="请输入请输入大华AccessKey"
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.daHuaAccessSecrect"
          label="大华AccessSecrect"
        >
          <a-input
            v-model:value="modelRef.daHuaAccessSecrect"
            placeholder="请输入大华AccessSecrect"
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.daHuaMonitorSn" label="监控设备码">
          <a-input
            v-model:value="modelRef.daHuaMonitorSn"
            placeholder="请输入监控设备码"
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.daHuaMonitorPassword"
          label="大华监控设备密码"
        >
          <a-input
            v-model:value="modelRef.daHuaMonitorPassword"
            placeholder="请输入大华监控设备密码"
          />
        </a-form-item>
        <a-form-item
          v-bind="validateInfos.daHuaMonitorCategory"
          label="大华监控设备品类"
        >
          <a-input
            v-model:value="modelRef.daHuaMonitorCategory"
            placeholder="请输入大华监控设备品类"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
