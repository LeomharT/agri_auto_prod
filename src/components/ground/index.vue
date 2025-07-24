<script lang="ts" setup>
import GroundBlock from './components/ground-block/index.vue';
import classes from './style.module.css';
</script>

<template>
  <div :class="classes.board">
    <div :class="classes.ground">
      <div v-for="i in 3 * 6" :class="classes.blocks" :key="i">
        <a-tooltip title="Plant植物" v-if="i <= 3">
          <ground-block type="grass" />
        </a-tooltip>
        <a-tooltip title="Add添加地面" v-if="i > 3 && i <= 6">
          <ground-block type="add" />
        </a-tooltip>
        <a-tooltip title="Add添加地面" v-if="i > 6 && i <= 9">
          <ground-block type="add" />
        </a-tooltip>
        <a-tooltip title="Water水地面" v-if="i > 9 && i <= 12">
          <ground-block type="water" />
        </a-tooltip>
        <a-tooltip title="Seeds种子" v-if="i > 12 && i <= 15">
          <ground-block type="seed" />
        </a-tooltip>
        <a-tooltip title="Seeds种子" v-if="i > 15 && i <= 18">
          <ground-block type="seed" />
        </a-tooltip>
      </div>
    </div>
  </div>
</template>
