<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { App as AntApp } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { computed, provide, ref, watchEffect } from 'vue';
import { getFarmConfig } from '../api/user';
import login from '../components/login/index.vue';
import { QUERIES } from '../data/queries';
import AppContent from './components/app-content/index.vue';
import AppHeader from './components/app-header/index.vue';
import AppSider from './components/app-sider/index.vue';
import { APP_CONTEXT } from './contex';

const activeKey = ref('plant');

const collapse = ref(false);

const token = useLocalStorage('token', '');

function setActiveKey(val: string) {
  activeKey.value = val;
}

function setCollapse(val: boolean) {
  collapse.value = val;
}

// User farm config
const query = useQuery({
  queryKey: [QUERIES.USER_FARM_CONFIG],
  queryFn: getFarmConfig,
});

const matches = useMediaQuery('(min-width: 1024px)');

watchEffect(() => {
  if (!matches.value) setCollapse(true);
});

// Provides
provide(APP_CONTEXT.ACTIVE_KEY, {
  activeKey,
  setActiveKey,
});
provide(APP_CONTEXT.COLLAPSE, {
  collapse,
  setCollapse,
});
provide(
  APP_CONTEXT.FARM_CONFIG,
  computed(() => query.data.value)
);
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <VueQueryDevtools />
    <ant-app>
      <login v-if="!token" />
      <div v-else>
        <app-header />
        <app-content />
        <app-sider />
      </div>
    </ant-app>
  </a-config-provider>
</template>
