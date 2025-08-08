<script lang="ts" setup>
import { installTool, unInstallTool } from '@/api/device';
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { MUTATIONS } from '@/data/mutations';
import { useMutation } from '@tanstack/vue-query';
import { App } from 'ant-design-vue';
import { onMounted, onUnmounted, ref } from 'vue';
import RobotArm from '../robot-arm/index.vue';
import ToolsTask from '../tools-task/index.vue';

const emit = defineEmits<{
  (e: 'siwtch'): void;
}>();

const { farmConfig } = useContext();

const { modal, message } = App.useApp();

const { on, off } = useEventEmitter();

const activeKey = ref(['1']);

const tools = [
  { title: '种植工具', toolType: 1, seeds: true },
  { title: '喷淋工具', toolType: 2, seeds: false },
  { title: '除草工具', toolType: 3, seeds: false },
];

const install = useMutation({
  mutationKey: [MUTATIONS.INSTALL_TOOL],
  mutationFn: installTool,
  onSuccess() {
    message.success('工具安装成功');
  },
});

const unInstall = useMutation({
  mutationKey: [MUTATIONS.UNINSTALL_TOOL],
  mutationFn: unInstallTool,
  onSuccess() {
    message.success('工具卸载成功');
  },
});

function onInstall(e: MouseEvent, type: number) {
  e.stopPropagation();

  modal.confirm({
    title: '安装工具',
    content: '您确定要安装工具',
    onOk() {
      install.mutate({
        id: farmConfig?.value.id!,
        type,
      });
    },
  });
}

function onUnInstall(e: MouseEvent, type: number) {
  e.stopPropagation();

  modal.confirm({
    title: '安装工具',
    content: '您确定要卸载工具',
    onOk() {
      unInstall.mutate({
        id: farmConfig?.value.id!,
        type,
      });
    },
  });
}

function onToolClick(type: number) {
  activeKey.value = [type.toString()];
}

onMounted(() => {
  on('TOOL_CLICK', onToolClick);
});

onUnmounted(() => {
  off('TOOL_CLICK', onToolClick);
});
</script>

<template>
  <a-card title="工具管理" :body-style="{ padding: 0 }">
    <template #extra>
      <a-button type="primary" @click="emit('siwtch')">监控视频</a-button>
    </template>
    <robot-arm />
    <a-collapse v-model:activeKey="activeKey" style="border: none" accordion>
      <a-collapse-panel
        v-for="tool in tools"
        :key="tool.toolType.toString()"
        :header="tool.title"
      >
        <template #extra>
          <a-space>
            <a-button
              size="small"
              type="text"
              @click="(e) => onInstall(e, tool.toolType)"
            >
              安装工具
            </a-button>
            <a-button
              danger
              type="text"
              size="small"
              @click="(e) => onUnInstall(e, tool.toolType)"
            >
              卸载工具
            </a-button>
          </a-space>
        </template>
        <tools-task :tool-type="tool.toolType" :seeds="tool.seeds" />
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>
