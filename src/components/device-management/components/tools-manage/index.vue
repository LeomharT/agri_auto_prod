<script lang="ts" setup>
import { ref } from 'vue';
import ToolsTask from '../tools-task/index.vue';

const activeKey = ref(['1', '2', '3']);

function onInstall(e: MouseEvent) {
  e.stopPropagation();
}
</script>

<template>
  <a-card title="工具管理" :body-style="{ padding: 0 }">
    <a-collapse v-model:activeKey="activeKey" style="border: none">
      <a-collapse-panel key="1" header="种植工具">
        <template #extra>
          <a-button size="small" @click="onInstall">安装工具</a-button>
        </template>
        <tools-task />
      </a-collapse-panel>
      <a-collapse-panel key="2" header="喷淋工具">
        <template #extra>
          <a-button size="small" @click="onInstall">安装工具</a-button>
        </template>
        <tools-task />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="除草工具">
        <template #extra>
          <a-button size="small" @click="onInstall">安装工具</a-button>
        </template>
        <tools-task />
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>
