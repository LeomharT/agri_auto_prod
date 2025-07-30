<script lang="ts" setup>
import Farm from '@/components/farm/index.vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const { collapse } = useContext();
</script>

<template>
  <main id="app-content" :class="classes.content" :data-collapse="collapse">
    <farm />
  </main>
</template>
