<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import { ref } from 'vue';
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

const searchValue = ref('');

function onSearch(val: string) {
  console.log(onSearch);
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
        default-expand-all
        auto-expand-parent
        block-node
        :tree-data="treeData"
        render
      >
        <template #title="{ title, key }">
          <span>{{ title }}</span>
        </template>
      </a-tree>
    </a-flex>
  </a-card>
</template>
