<script lang="ts" setup>
import SensorData from '@/components/device-management/components/sensor-data/index.vue';
import Farm from '@/components/farm/index.vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';
const { collapse } = useContext();
</script>

<template>
  <main id="app-content" :class="classes.content" :data-collapse="collapse">
    <farm />
    <sensor-data />
  </main>
</template>
