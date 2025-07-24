<script lang="ts" setup>
import PlantManage from './components/plant-manage/index.vue';
import SeedsStorehouse from './components/seeds-storehouse/index.vue';
</script>
<template>
  <a-flex gap="middle" vertical>
    <seeds-storehouse />
    <plant-manage />
  </a-flex>
</template>
