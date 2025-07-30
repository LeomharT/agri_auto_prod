<script lang="ts" setup>
import type { PlantProps } from '@/models/farm.type';
import { ref } from 'vue';
import MoundBlock from './components/mound-block/index.vue';
import PlantInfo from './components/plant-info/index.vue';
import classes from './style.module.css';

const open = ref(false);

const plant = ref<Partial<PlantProps>>({});

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
          type="soil"
          :x="xIndex(i)"
          :y="yIndex(i)"
          @click="onPlantClick"
          @drop="onPlantDrop"
        />
      </div>
    </div>
  </div>
</template>
