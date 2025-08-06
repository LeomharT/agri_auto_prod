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

const { activeKey, setActiveKey } = useContext();
</script>

<template>
  <header :class="classes.header">
    <a-space>
      <div :class="classes.title">SmartFarmer</div>
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
    </a-space>
    <a-space size="large">
      <img :class="classes.logo" src="/imgs/NL-era@2x.png" />
      <a-button danger size="small" type="text" @click="logout">注销</a-button>
    </a-space>
  </header>
</template>
