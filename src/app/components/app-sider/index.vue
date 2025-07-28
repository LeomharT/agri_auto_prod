<script lang="ts" setup>
import DataManagement from '@/components/data-management/index.vue';
import DeviceManagement from '@/components/device-management/index.vue';
import PlantManagement from '@/components/plant-management/index.vue';
import TaskManagement from '@/components/task-management/index.vue';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const { activeKey, collapse, setCollapse } = useContext();
</script>

<template>
  <aside :class="classes.sider" :data-collapse="collapse">
    <div :class="classes.button" @click="() => setCollapse(!collapse)">
      <icon-chevron-left v-if="collapse" size="16px" />
      <icon-chevron-right v-else size="16px" />
    </div>
    <div :class="classes.body">
      <plant-management v-if="activeKey === 'plant'" />
      <device-management v-if="activeKey === 'device'" />
      <task-management v-if="activeKey === 'task'" />
      <data-management v-if="activeKey === 'data'" />
    </div>
  </aside>
</template>
