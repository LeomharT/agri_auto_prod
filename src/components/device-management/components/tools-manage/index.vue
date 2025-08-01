<script lang="ts" setup>
import { installTool, unInstallTool } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { useMutation } from '@tanstack/vue-query';
import { App } from 'ant-design-vue';
import { ref } from 'vue';
import ToolsTask from '../tools-task/index.vue';

const { farmConfig } = useContext();

const { modal, message } = App.useApp();

const activeKey = ref(['1', '2', '3']);

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
</script>

<template>
  <a-card title="工具管理" :body-style="{ padding: 0 }">
    <a-collapse v-model:activeKey="activeKey" style="border: none">
      <a-collapse-panel key="1" header="种植工具">
        <template #extra>
          <a-space>
            <a-button size="small" @click="(e) => onInstall(e, 1)">
              安装工具
            </a-button>
            <a-button danger size="small" @click="(e) => onUnInstall(e, 1)">
              卸载工具
            </a-button>
          </a-space>
        </template>
        <tools-task />
      </a-collapse-panel>
      <a-collapse-panel key="2" header="喷淋工具">
        <template #extra>
          <a-space>
            <a-button size="small" @click="(e) => onInstall(e, 2)">
              安装工具
            </a-button>
            <a-button danger size="small" @click="(e) => onUnInstall(e, 2)">
              卸载工具
            </a-button>
          </a-space>
        </template>
        <tools-task />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="除草工具">
        <template #extra>
          <a-space>
            <a-button size="small" @click="(e) => onInstall(e, 3)">
              安装工具
            </a-button>
            <a-button danger size="small" @click="(e) => onUnInstall(e, 3)">
              卸载工具
            </a-button>
          </a-space>
        </template>
        <tools-task />
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>
