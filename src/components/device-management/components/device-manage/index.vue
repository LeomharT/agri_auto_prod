<script lang="ts" setup>
import { MUTATIONS } from '@/data/mutations';
import { IconEdit, IconTrash } from '@tabler/icons-vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { App, message, type TableProps } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { deleteBindDevice, getBindDeviceList } from '../../../../api/device';
import useContext from '../../../../app/composables/useContext';
import { QUERIES } from '../../../../data/queries';
import type { Device } from '../../../../models/device.type';
import DeviceBind from '../device-bind/index.vue';
const { farmConfig } = useContext();

const open = ref(false);

const queryClient = useQueryClient();

const { modal } = App.useApp();

const selected = ref<Device | undefined>();

const columns: TableProps<Device>['columns'] = [
  { key: 'deviceName', dataIndex: 'deviceName', title: '已绑定设备' },
  { key: 'productName', dataIndex: 'productName', title: '归属产品' },
  { key: 'deviceStatus', dataIndex: 'deviceStatus', title: '设备状态' },
  { key: 'options', title: '操作', fixed: 'right' },
];

const query = useQuery({
  queryKey: [QUERIES.BIND_DEVICES],
  queryFn: () => getBindDeviceList(farmConfig?.value.id!),
  enabled: computed(() => Boolean(farmConfig?.value)),
  initialData: [],
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.DELETE_DEVICE],
  mutationFn: deleteBindDevice,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: [QUERIES.BIND_DEVICES] });
    message.success('设备删除成功');
    onCancel();
  },
});

function onDelete(id: number) {
  modal.confirm({
    title: '删除设备',
    content: '您确定删除这个设备吗?',
    onOk() {
      mutation.mutate(id);
    },
  });
}

function onCancel() {
  open.value = false;
  selected.value = undefined;
}

function onEdit(record: Device) {
  open.value = true;
  selected.value = record;
}
</script>

<template>
  <a-card title="设备管理" :body-style="{ padding: 0 }">
    <device-bind :open="open" :initial-data="selected" @cancel="onCancel" />
    <template #extra>
      <a-button type="primary" @click="open = true"> 绑定设备 </a-button>
    </template>
    <a-table
      size="small"
      :columns="columns"
      :scroll="{ x: 'max-content' }"
      :loading="query.isFetching.value"
      :data-source="query.data.value"
    >
      <template #bodyCell="{ column, text, record }">
        <a-space v-if="column.key === 'options'">
          <a-button
            size="small"
            type="link"
            style="color: #00b96b"
            @click="onEdit(record as Device)"
          >
            <template #icon>
              <icon-edit size="18px" />
            </template>
          </a-button>
          <a-button
            danger
            size="small"
            type="link"
            @click="onDelete(record.id)"
          >
            <template #icon>
              <icon-trash size="18px" />
            </template>
          </a-button>
        </a-space>
        <div v-if="column.dataIndex === 'deviceStatus'">
          <a-tag v-if="!!text" color="green">在线</a-tag>
          <a-tag v-if="!text">离线</a-tag>
        </div>
      </template>
    </a-table>
  </a-card>
</template>
