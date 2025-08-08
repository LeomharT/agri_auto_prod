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
import AppFloat from './components/app-float/index.vue';
import AppHeader from './components/app-header/index.vue';
import AppSider from './components/app-sider/index.vue';
import { APP_CONTEXT, type PickingStatus } from './contex';

const activeKey = ref('plant');

const collapse = ref(false);

const picking = ref<PickingStatus>(false);

const selected = ref<any[]>([]);

const editingPlant = ref<undefined | number>(undefined);

const token = useLocalStorage('token', '');

function setActiveKey(val: string) {
  activeKey.value = val;
}

function setCollapse(val: boolean) {
  collapse.value = val;
}

function setPicking(val: PickingStatus) {
  picking.value = val;
}

function setEditingPlant(no: number | undefined) {
  editingPlant.value = no;
}

function setSelected(val: any[] | ((prev: any[]) => any[])) {
  if (val instanceof Array) {
    selected.value = val;
  } else {
    selected.value = val(selected.value);
  }
}

// User farm config
const query = useQuery({
  queryKey: [QUERIES.USER_FARM_CONFIG],
  queryFn: getFarmConfig,
  enabled: Boolean(token.value),
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
provide(APP_CONTEXT.PICKING, {
  picking,
  setPicking,
});
provide(APP_CONTEXT.SELECTED, {
  selected,
  setSelected,
});
provide(APP_CONTEXT.EDITING_PLANT, {
  editingPlant,
  setEditingPlant,
});
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
    <VueQueryDevtools button-position="bottom-right" />
    <ant-app>
      <login v-if="!token" />
      <div v-else>
        <app-header />
        <app-content />
        <app-sider />
        <app-float />
      </div>
    </ant-app>
  </a-config-provider>
</template>
