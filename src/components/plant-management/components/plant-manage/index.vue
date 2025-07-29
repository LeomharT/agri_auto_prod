<script lang="ts" setup>
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import type { TreeProps } from 'ant-design-vue';
import { ref } from 'vue';
import classes from './style.module.css';

const treeData: TreeProps['treeData'] = [
  {
    title: '甜菜组',
    key: '0-0',
    children: [
      {
        title: '甜菜1号',
        key: '0-0-0',
      },
      {
        title: '甜菜2号',
        key: '0-0-1',
      },
    ],
  },
];

const query = useQuery({
  queryKey: [QUERIES.SEED_CROP_LIST],
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
        :tree-data="treeData"
      >
        <template #title="{ title, selected, children }">
          <div :class="classes.item">
            <span>{{ title }}</span>
            <a-space v-if="!!children">
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
