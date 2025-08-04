<script lang="ts" setup>
import { logout } from '@/api/user';
import {
  IconBriefcase,
  IconDatabase,
  IconRouter,
  IconTree,
} from '@tabler/icons-vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const items = [
  { key: 'plant', label: '植物管理', icon: IconTree },
  { key: 'device', label: '设备管理', icon: IconRouter },
  { key: 'task', label: '任务管理', icon: IconBriefcase },
  { key: 'data', label: '数据管理', icon: IconDatabase },
] as const;

const { farmConfig, activeKey, setActiveKey } = useContext();
</script>

<template>
  <header :class="classes.header">
    <a-space>
      <a-tabs
        v-model:activeKey="activeKey"
        :class="classes.tabs"
        @change="key=>setActiveKey(key as string)"
      >
        <a-tab-pane v-for="item of items" :key="item.key">
          <template #tab>
            <span :class="classes.label">
              <component :is="item.icon" />
              {{ item.label }}
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item danger @click="logout"> 退出登录 </a-menu-item>
          </a-menu>
        </template>
        <div :class="classes.user">
          <a-avatar style="background-color: #00b96b">
            {{ farmConfig?.name.charAt(0) }}
          </a-avatar>
          <span>
            {{ farmConfig?.name }}
          </span>
        </div>
      </a-dropdown>
    </a-space>
    <img :class="classes.logo" src="/imgs/NL-era@2x.png" />
  </header>
</template>
