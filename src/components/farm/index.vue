<script lang="ts" setup>
import { getFarmCropList } from '@/api/farm';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import type { PlantProps } from '@/models/farm.type';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import MoundBlock from './components/mound-block/index.vue';
import PlantInfo from './components/plant-info/index.vue';
import classes from './style.module.css';

const { farmConfig } = useContext();

const open = ref(false);

const plant = ref<Partial<PlantProps>>({});

const query = useQuery({
  queryKey: [QUERIES.FARM_CROP_LIST],
  queryFn: () => getFarmCropList(farmConfig?.value?.id),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

function xIndex(i: number) {
  return (i - 1) % 3;
}

function yIndex(i: number) {
  return Math.floor((i - 1) / 3);
}

function onPlantDrop(args: Partial<PlantProps>) {
  plant.value = {
    ...args,
  };
  open.value = true;
}

function onPlantClick(args: Partial<PlantProps>) {
  plant.value = {
    ...args,
  };
  open.value = true;
}

function onCancel() {
  open.value = false;
}
</script>

<template>
  <div :class="classes.board">
    <plant-info :open="open" :initial-value="plant" @cancel="onCancel" />
    <div :class="classes.ground">
      <div v-for="i in 3 * 6" :class="classes.blocks" :key="i">
        <mound-block
          :x="xIndex(i)"
          :y="yIndex(i)"
          :palnt="
            query.data.value.filter(
              (item) =>
                item.positionX === xIndex(i) && item.positionY === yIndex(i)
            )[0]
          "
          @click="onPlantClick"
          @drop="onPlantDrop"
        />
      </div>
    </div>
  </div>
</template>
