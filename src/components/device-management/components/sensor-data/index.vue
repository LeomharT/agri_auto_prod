<script setup lang="ts">
import { getSensorDeviceLastestData } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import classes from './style.module.css';

const ICONS: Record<string, string> = {
  air_co2: '/imgs/sensor/icon_co2.png',
  par_flux: '/imgs/sensor/icon_light.png',
  soil_hum: '/imgs/sensor/icon_humidity_soil.png',
  soil_tmp: 'imgs/sensor/icon_temperature_soil.png',
  soil_ph: 'imgs/sensor/icon_PH.png',
  air_hum: 'imgs/sensor/icon_humidity.png',
  air_tmp: 'imgs/sensor/icon_temperature.png',
};

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
      <a-space v-for="item in query.data.value">
        <img draggable="false" :src="ICONS[item.propKey]" />
        <a-space direction="vertical" :size="0">
          <a-typography-title :level="3" style="margin: 0">
            {{ item.propValue }}
            <sup>
              {{ item.propUnit }}
            </sup>
          </a-typography-title>
          <a-typography-text type="secondary">
            {{ item.propName }}
          </a-typography-text>
        </a-space>
      </a-space>
    </div>
  </a-card>
</template>
