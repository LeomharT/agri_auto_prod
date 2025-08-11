<script lang="ts" setup>
import PlantManage from './components/plant-manage/index.vue';
import SeedsStorehouse from './components/seeds-storehouse/index.vue';
import classes from './style.module.css';
</script>
<template>
  <a-flex gap="middle" :class="classes.layout">
    <seeds-storehouse />
    <plant-manage />
  </a-flex>
</template>
