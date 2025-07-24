<script lang="ts" setup>
import classes from './style.module.css';

const waterPic = '/imgs/ground/pic_water@2x.png';
const addPic = '/imgs/ground/pic_add@2x.png';
const grassPic = '/imgs/ground/pic_grass@2x.png';
const seedPic = '/imgs/ground/pic_seed@2x.png';
</script>

<template>
  <div :class="classes.board">
    <div :class="classes.ground">
      <div v-for="i in 3 * 6" :class="classes.block" :key="i">
        <a-tooltip title="Plant植物" v-if="i <= 3">
          <img :src="grassPic" />
        </a-tooltip>
        <img v-if="i > 3 && i <= 6" :src="addPic" />
        <img v-if="i > 6 && i <= 9" :src="addPic" />
        <img v-if="i > 9 && i <= 12" :src="waterPic" />
        <img v-if="i > 12 && i <= 15" :src="seedPic" />
        <a-tooltip title="Seeds种子" v-if="i > 15 && i <= 18">
          <img :src="seedPic" />
        </a-tooltip>
      </div>
    </div>
  </div>
</template>
