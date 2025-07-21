<script lang="ts" setup>
import useApp from '../../composables/useApp';
import classes from './style.module.css';

const { collapse } = useApp();
</script>

<template>
  <main :class="classes.content" :data-collapse="collapse">
    <div></div>
  </main>
</template>
