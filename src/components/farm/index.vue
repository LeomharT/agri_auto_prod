<script lang="ts" setup>
import GroundBlock from './components/ground-block/index.vue';
import classes from './style.module.css';

function xIndex(i: number) {
  return (i - 1) % 3;
}

function yIndex(i: number) {
  return Math.floor((i - 1) / 3);
}
</script>

<template>
  <div :class="classes.board">
    <div :class="classes.ground">
      <div v-for="i in 3 * 6" :class="classes.blocks" :key="i">
        <ground-block type="soil" :x="xIndex(i)" :y="yIndex(i)" />
      </div>
    </div>
  </div>
</template>
