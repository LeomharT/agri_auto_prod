<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import classes from './style.module.css';

const props = defineProps<{
  parent: HTMLDivElement | null;
}>();

const el = useTemplateRef('plantImg');

function updatePosition() {
  if (!props.parent) return;
  if (!el.value) return;

  const rect = props.parent.getBoundingClientRect();
  el.value.style.top = rect.top - rect.height / 2 + 'px';
  el.value.style.left = rect.left + rect.width / 4 + 'px';
}

const observer = new ResizeObserver(() => {
  updatePosition();
});

onMounted(() => {
  const main = document.querySelector('#app-content');
  observer.observe(main as HTMLDivElement);
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <img
    ref="plantImg"
    src="/imgs/ground/pic_plant@2x.png"
    :class="classes.plant"
  />
</template>
