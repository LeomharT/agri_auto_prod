<script lang="ts" setup>
import { App } from 'ant-design-vue';
import classes from './style.module.css';
const { message } = App.useApp();

const props = defineProps<{
  type: 'water' | 'seed' | 'grass' | 'add';
}>();

const blockImg = {
  water: '/imgs/ground/pic_water@2x.png',
  seed: '/imgs/ground/pic_seed@2x.png',
  grass: '/imgs/ground/pic_grass@2x.png',
  add: '/imgs/ground/pic_add@2x.png',
};

function onDragOver(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = '#52c41a';

    const img = e.target.querySelector('img');
    if (img) {
      img.style.opacity = '0.85';
    }
  }
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = 'transparent';

    const img = e.target.querySelector('img');
    if (img) {
      img.style.opacity = '1.0';
    }
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault();

  onDragLeave(e);

  const data = e.dataTransfer?.getData('type');

  if (data) {
    message.success(`你种植了${data}`);
  }
}
</script>
<template>
  <div
    :class="classes.block"
    dropzone="move"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <img :src="blockImg[props.type]" />
  </div>
</template>
