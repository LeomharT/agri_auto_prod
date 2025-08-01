<script setup lang="ts">
import { getSensorDeviceLastestData } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import classes from './style.module.css';

const { farmConfig, collapse } = useContext();

const query = useQuery({
  queryKey: [QUERIES.SENSOR_DATA],
  queryFn: () => getSensorDeviceLastestData(farmConfig?.value?.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});
</script>

<template>
  <a-card title="实时数据" :class="classes.card" :data-collapse="collapse">
    <div :class="classes.list">
      <a-space v-for="item in query.data.value" direction="vertical">
        <a-typography-title :level="3" style="margin: 0">
          {{ item.propValue }}
          <sup>
            {{ item.propUnit }}
          </sup>
        </a-typography-title>
        <a-typography-paragraph type="secondary">
          {{ item.propName }}
        </a-typography-paragraph>
      </a-space>
    </div>
  </a-card>
</template>
