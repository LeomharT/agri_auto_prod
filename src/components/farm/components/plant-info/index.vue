<script setup lang="ts">
import { addOrUpdateCrop, deleteCrop } from '@/api/farm';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import type { PlantProps } from '@/models/farm.type';
import { IconTrash } from '@tabler/icons-vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { App, Form, message, type ModalProps } from 'ant-design-vue';
import { ref, watch } from 'vue';

const props = defineProps<
  ModalProps & {
    initialValue: Partial<PlantProps>;
  }
>();

const { modal } = App.useApp();

const queryClient = useQueryClient();

const { farmConfig } = useContext();

const modalRef = ref<Partial<PlantProps>>({
  name: '',
  seedId: undefined,
  growStatus: 1,
  seedSlot: 1,
  positionX: undefined,
  positionY: undefined,
});

const rulesRef = ref({
  name: [{ required: true, message: '请输入植物名称' }],
  seedId: [{ required: true, message: '请输入种子ID' }],
  growStatus: [{ required: true, message: '请选择种子状态' }],
  seedSlot: [{ required: true, message: '请选择种子插槽' }],
  positionX: [{ required: true, message: '请选择X的坐标' }],
  positionY: [{ required: true, message: '请选择Y的坐标' }],
});

const { validate, validateInfos } = Form.useForm(modalRef, rulesRef);

const mutation = useMutation({
  mutationKey: [MUTATIONS.PLANTING],
  mutationFn: addOrUpdateCrop,
  onSuccess() {
    // Message
    message.success('种子种植成功');
    // Close modal
    props.onCancel?.call({}, {} as MouseEvent);
    // Refetch queries
    queryClient.invalidateQueries({
      queryKey: [QUERIES.FARM_CROP_LIST],
    });
  },
});

const _delete = useMutation({
  mutationKey: [MUTATIONS.DELETE_PLANT],
  mutationFn: deleteCrop,
  onSuccess() {
    // Message
    message.success({ content: '植物删除成功' });
    // Close
    onCancel({} as MouseEvent);
    // Refetch queries
    queryClient.invalidateQueries({
      queryKey: [QUERIES.FARM_CROP_LIST],
    });
  },
});

function onOk() {
  validate().then((_data) => {
    const config = farmConfig;

    const xCoord =
      (config!.value.width / config!.value.rowCount) * _data.positionX;

    const yCoord =
      (config!.value.length / config!.value.columnCount) * _data.positionY;

    const data = {
      ..._data,
      farmId: config?.value.id,
      soilPositionX: Math.floor(xCoord),
      soilPositionY: Math.floor(yCoord),
    };

    if (props.initialValue.id) {
      data['id'] = props.initialValue.id;
    }

    mutation.mutate(data);
  });
}

function onCancel(e: MouseEvent) {
  props.onCancel?.call({}, e);

  modalRef.value = {
    name: '',
    seedId: undefined,
    growStatus: 1,
    seedSlot: 1,
    positionX: undefined,
    positionY: undefined,
  };
}

function onDelete() {
  modal.confirm({
    title: '删除植物',
    content: '您确定要删除当前的植物吗?',
    onOk: () => {
      _delete.mutate(props.initialValue.id!);
    },
  });
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      modalRef.value = {
        ...modalRef.value,
        ...props.initialValue,
      };
    }
  }
);
</script>

<template>
  <a-modal
    title="植物信息"
    :open="props.open"
    :confirm-loading="mutation.isPending.value"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form layout="vertical">
      <a-form-item label="植物名称" v-bind="validateInfos.name">
        <a-input v-model:value="modalRef.name" placeholder="请输入植物名称" />
      </a-form-item>
      <a-form-item hidden label="种子ID" v-bind="validateInfos.seedId">
        <a-input
          readonly
          v-model:value="modalRef.seedId"
          placeholder="请输入种子ID"
        />
      </a-form-item>
      <p>当前植物状态</p>
      <a-space>
        <a-form-item v-bind="validateInfos.growStatus">
          <a-select
            v-model:value="modalRef.growStatus"
            placeholder="请选择种子状态"
            style="width: 200px"
            :disabled="!Boolean(props.initialValue.plantStatus === 2)"
            :options="[
              { value: 1, label: '种子期' },
              { value: 2, label: '生长期' },
              { value: 3, label: '收获期' },
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.seedSlot">
          <a-select
            v-model:value="modalRef.seedSlot"
            placeholder="请选择种子插槽"
            style="width: 200px"
            :options="[
              { value: 1, label: '1号种子槽' },
              { value: 2, label: '2号种子槽' },
            ]"
          />
        </a-form-item>
      </a-space>
      <p>植物坐标</p>
      <a-space size="large">
        <a-space align="start">
          <p style="margin-top: 6px">X :</p>
          <a-form-item v-bind="validateInfos.x">
            <a-select
              v-model:value="modalRef.positionX"
              style="width: 100px"
              :options="[
                { value: 0, label: '1' },
                { value: 1, label: '2' },
                { value: 2, label: '3' },
              ]"
            />
          </a-form-item>
        </a-space>
        <a-space align="start">
          <p style="margin-top: 6px">Y :</p>
          <a-form-item v-bind="validateInfos.y">
            <a-select
              v-model:value="modalRef.positionY"
              style="width: 100px"
              :options="[
                { value: 0, label: '1' },
                { value: 1, label: '2' },
                { value: 2, label: '3' },
                { value: 3, label: '4' },
                { value: 4, label: '5' },
                { value: 5, label: '6' },
              ]"
            />
          </a-form-item>
        </a-space>
      </a-space>
    </a-form>
    <a-button
      v-if="props.initialValue.id"
      block
      danger
      type="dashed"
      @click="onDelete"
    >
      <template #icon>
        <icon-trash size="16px" style="transform: translate(-2px, 2px)" />
      </template>
      删除
    </a-button>
  </a-modal>
</template>
