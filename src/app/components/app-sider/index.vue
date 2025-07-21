<script lang="ts" setup>
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import PlantManagement from '../../../components/plant-management/index.vue';
import useApp from '../../composables/useApp';
import classes from './style.module.css';

const { activeKey, collapse, setCollapse } = useApp();
</script>

<template>
  <aside :class="classes.sider" :data-collapse="collapse">
    <div :class="classes.button" @click="() => setCollapse(!collapse)">
      <icon-chevron-left v-if="collapse" size="16px" />
      <icon-chevron-right v-else size="16px" />
    </div>
    <div :class="classes.body">
      <plant-management v-if="activeKey === 'plant'" />
    </div>
  </aside>
</template>
