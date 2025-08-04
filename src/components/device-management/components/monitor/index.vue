<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue';
import classes from './style.module.css';

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>
<template>
  <a-card :body-style="{ padding: 0 }">
    <template #title>
      <a-space>
        <a-button type="text" @click="emit('back')">
          <template #icon>
            <icon-chevron-left />
          </template>
        </a-button>
        <span style="font-size: 16px"> 监控画面 </span>
      </a-space>
    </template>
    <template #extra>
      <a-space>
        <a-button>设置</a-button>
      </a-space>
    </template>
    <div :class="classes.video"></div>
  </a-card>
</template>
