<script lang="ts" setup>
import { deleteAllCrop, deleteCrop, getCropItem } from '@/api/farm';
import { getCropGroups } from '@/api/plant';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import type { PlantProps } from '@/models/farm.type';
import { getPlantIndex } from '@/utils/getPlantIndex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { App, Empty, type TreeProps } from 'ant-design-vue';
import type { DataNode, EventDataNode } from 'ant-design-vue/es/tree';
import { computed, onUnmounted, ref } from 'vue';
import PlantInfo from '../plant-info/index.vue';
import classes from './style.module.css';

const { farmConfig, setEditingPlant, setSelected } = useContext();

const queryClient = useQueryClient();

const { message, modal } = App.useApp();

const open = ref(false);

const plant = ref<Partial<PlantProps>>({});

const query = useQuery({
  queryKey: [QUERIES.SEED_GROUP_LIST],
  queryFn: () => getCropGroups(farmConfig?.value.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [] as TreeProps['treeData'],
});

const search = ref('');

const mutation = useMutation({
  mutationKey: [MUTATIONS.PLANT_DETAIL],
  mutationFn: getCropItem,
  onSuccess(data) {
    plant.value = data;
    open.value = true;
  },
});

const _delete = useMutation({
  mutationKey: [MUTATIONS.DELETE_PLANT],
  mutationFn: deleteCrop,
  onMutate() {
    message.loading({
      key: 'DELETEING',
      content: '植物删除中',
      duration: 10000,
    });
  },
  onSuccess() {
    // Message
    message.success({ key: 'DELETEING', content: '植物删除成功' });
    // Refetch queries
    queryClient.invalidateQueries({
      queryKey: [QUERIES.FARM_CROP_LIST],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERIES.SEED_GROUP_LIST],
    });
    // Clear selected
    setSelected([]);
  },
});

const _deleteAll = useMutation({
  mutationKey: [MUTATIONS.DELETE_ALL_PLANT],
  mutationFn: deleteAllCrop,
  onMutate() {
    message.loading({
      key: 'DELETEING',
      content: '植物删除中',
      duration: 10000,
    });
  },
  onSuccess() {
    // Message
    message.success({ key: 'DELETEING', content: '植物删除成功' });
    // Refetch queries
    queryClient.invalidateQueries({
      queryKey: [QUERIES.FARM_CROP_LIST],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERIES.SEED_GROUP_LIST],
    });
    // Clear selected
    setSelected([]);
  },
});

function onSearch(val: string) {
  console.log(val);
}

function onEdit(e: MouseEvent, id: number) {
  e.stopPropagation();

  mutation.mutate(id);

  setEditingPlant(id);
}

function onDelete(e: MouseEvent, id: number) {
  e.stopPropagation();

  modal.confirm({
    title: '删除植物',
    content: '您确定要删除当前的植物吗?',
    onOk: () => _delete.mutate(id),
  });
}

function onDeleteSeed(e: MouseEvent, seedId: number) {
  e.stopPropagation();

  modal.confirm({
    title: '删除植物',
    content: '您确定要删除当前的植物吗?',
    onOk: () => _deleteAll.mutate(seedId),
  });
}

function onCancel() {
  open.value = false;

  setEditingPlant(undefined);
}

function onSelect(
  _: unknown,
  info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }
) {
  if (info.selectedNodes.length) {
    if (info.selectedNodes[0].cropList) {
      setSelected(
        info.selectedNodes[0].cropList.map((item: any) => ({
          no: getPlantIndex(item.soilPositionX, item.soilPositionY),
          ...item[0],
        }))
      );
    } else {
      setSelected([
        {
          no: getPlantIndex(
            info.selectedNodes[0].soilPositionX,
            info.selectedNodes[0].soilPositionY
          ),
          ...info.selectedNodes[0],
        },
      ]);
    }
  } else {
    setSelected([]);
  }
}

function onConfirm(parent: string, args?: Partial<PlantProps>) {
  if (parent === 'plant') {
    open.value = true;

    if (args) {
      setEditingPlant(args.no);
    }
  }
}

onUnmounted(() => {
  setSelected([]);
});
</script>

<template>
  <a-card title="植物管理">
    <a-spin :spinning="query.isFetching.value">
      <plant-info
        :open="open"
        :initial-value="plant"
        :parent="'plant'"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
      <a-flex vertical :gap="16">
        <a-input-search
          v-model:value="search"
          placeholder="请输入种子或植物名称"
          @search="onSearch"
        />
        <a-typography-title :level="5">植物分组</a-typography-title>
        <a-tree
          block-node
          auto-expand-parent
          default-expand-all
          :tree-data="query.data.value"
          :field-names="{
            key: 'key',
            title: 'name',
            children: 'cropList',
          }"
          @select="onSelect"
        >
          <template #title="{ name, cropList, id, seedId }">
            <div :class="classes.item">
              <span v-if="name.indexOf(search) > -1">
                {{ name.substring(0, name.indexOf(search)) }}
                <span style="color: #f50">{{ search }}</span>
                {{ name.substring(name.indexOf(search) + search.length) }}
              </span>
              <span v-else>{{ name }} </span>
              <a-space v-if="!!cropList">
                <a-button
                  danger
                  type="link"
                  size="small"
                  @click="(e) => onDeleteSeed(e, seedId)"
                >
                  删除所有植物
                </a-button>
              </a-space>
              <a-space :size="0" v-else>
                <a-button
                  type="link"
                  size="small"
                  style="color: #00b96b"
                  :loading="mutation.isPending.value"
                  @click="(e) => onEdit(e, id)"
                >
                  编辑
                </a-button>
                <a-button
                  danger
                  type="link"
                  size="small"
                  @click="(e) => onDelete(e, id)"
                >
                  删除
                </a-button>
              </a-space>
            </div>
          </template>
        </a-tree>
      </a-flex>
      <a-empty
        v-if="!query.data.value.length"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />
    </a-spin>
  </a-card>
</template>
