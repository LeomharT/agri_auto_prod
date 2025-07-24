<script lang="ts" setup>
import Ground from '../../../components/ground/index.vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const { collapse } = useContext();
</script>

<template>
  <main id="app-content" :class="classes.content" :data-collapse="collapse">
    <ground />
  </main>
</template>
