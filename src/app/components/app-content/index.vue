<script lang="ts" setup>
import { getFarmCropList } from '@/api/farm';
import Farm from '@/components/farm/index.vue';
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const { collapse, farmConfig } = useContext();

const query = useQuery({
  queryKey: [QUERIES.FARM_CROP_LIST],
  queryFn: () => getFarmCropList(farmConfig?.value?.id),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
});
</script>

<template>
  <main id="app-content" :class="classes.content" :data-collapse="collapse">
    <farm />
  </main>
</template>
