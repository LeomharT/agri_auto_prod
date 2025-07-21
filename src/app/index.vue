<script lang="ts" setup>
import { provide, ref } from 'vue';
import AppContent from './components/app-content/index.vue';
import AppHeader from './components/app-header/index.vue';
import AppSider from './components/app-sider/index.vue';
import { APP_CONTEXT } from './contex';

const activeKey = ref('plant');

const collapse = ref(false);

function setActiveKey(val: string) {
  activeKey.value = val;
}

function setCollapse(val: boolean) {
  collapse.value = val;
}

// Provides
provide(APP_CONTEXT.ACTIVE_KEY, {
  activeKey,
  setActiveKey,
});
provide(APP_CONTEXT.COLLAPSE, {
  collapse,
  setCollapse,
});
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <app-header />
    <app-content />
    <app-sider />
  </a-config-provider>
</template>
