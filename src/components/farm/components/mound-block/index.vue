<script lang="ts" setup>
import type { PlantProps } from '@/models/farm.type';
import { App } from 'ant-design-vue';
import classes from './style.module.css';

const { message } = App.useApp();

type PlantEmitProps = Pick<
  PlantProps,
  'positionX' | 'positionY' | 'name' | 'type' | 'seedId'
>;

const props = defineProps<{
  type:
    | 'water'
    | 'seed'
    | 'grass'
    | 'add'
    | 'mound'
    | 'moundWet'
    | 'soil'
    | 'wet';
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  (e: 'drop', args: Partial<PlantEmitProps>): void;
  (e: 'click', args: Partial<PlantEmitProps>): void;
}>();

const blockImg = {
  water: '/imgs/ground/pic_water@2x.png',
  seed: '/imgs/ground/pic_seed@2x.png',
  grass: '/imgs/ground/pic_grass@2x.png',
  add: '/imgs/ground/pic_add@2x.png',
  mound: '/imgs/ground/pic_mound@2x.png',
  moundWet: '/imgs/ground/pic_mound_wet@2x.png',
  soil: '/imgs/ground/pic_soil@2x.png',
  wet: '/imgs/ground/pic_wet@2x.png',
};

function onDragOver(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = '#52c41a';

    const img = e.target.querySelector('img');
    if (img) {
      img.style.opacity = '0.7';
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

  const name = e.dataTransfer?.getData('name');
  const seedId = e.dataTransfer?.getData('seedId');

  if (props.type === 'soil') {
    emit('drop', {
      name,
      positionX: props.x,
      positionY: props.y,
      seedId: Number.parseInt(seedId!),
    });
  } else {
    message.error('只能在没有作物的土地上种植');
  }
}

function onClick(e: MouseEvent) {
  e.preventDefault();

  if (props.type === 'soil') {
    message.warning('土地上没有种植作物');
  } else {
    emit('click', {
      positionX: props.x,
      positionY: props.y,
      type: props.type,
      name: '',
    });
  }
}
</script>
<template>
  <a-tooltip :title="`x:${x}, y:${y}`">
    <div
      :class="classes.block"
      dropzone="move"
      @click="onClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <img :src="blockImg[props.type]" />
    </div>
  </a-tooltip>
</template>
