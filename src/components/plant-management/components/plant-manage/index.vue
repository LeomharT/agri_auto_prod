<script lang="ts" setup>
import { getCropGroups } from '@/api/plant';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import type { TreeProps } from 'ant-design-vue';
import { computed, ref, watchEffect } from 'vue';
import classes from './style.module.css';

const { farmConfig } = useContext();

const query = useQuery({
  queryKey: [QUERIES.SEED_GROUP_LIST],
  queryFn: () => getCropGroups(farmConfig?.value.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [] as TreeProps['treeData'],
});

const searchValue = ref('');

function onSearch(val: string) {
  console.log(val);
}

function onEdit(e: MouseEvent) {
  e.stopPropagation();
}

function onDelete(e: MouseEvent) {
  e.stopPropagation();
}

watchEffect(() => {
  console.log(query.data.value);
});
</script>

<template>
  <a-card title="植物管理">
    <a-flex vertical :gap="16">
      <a-input-search
        v-model:value="searchValue"
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
          key: 'id',
          title: 'name',
          children: 'cropList',
        }"
      >
        <template #title="{ name, cropList }">
          <div :class="classes.item">
            <span>{{ name }}</span>
            <a-space v-if="!!cropList">
              <a-button danger size="small" @click="onDelete">
                删除所有植物
              </a-button>
            </a-space>
            <a-space v-else>
              <a-button size="small" @click="onEdit"> 编辑 </a-button>
              <a-button danger size="small" @click="onDelete"> 删除 </a-button>
            </a-space>
          </div>
        </template>
      </a-tree>
    </a-flex>
  </a-card>
</template>
