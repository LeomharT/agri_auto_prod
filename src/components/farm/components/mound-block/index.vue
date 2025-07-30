<script lang="ts" setup>
import type { PlantProps } from '@/models/farm.type';
import { App } from 'ant-design-vue';
import { ref, watch, type Ref } from 'vue';
import classes from './style.module.css';

type PlantEmitProps = Pick<
  PlantProps,
  'positionX' | 'positionY' | 'name' | 'type' | 'seedId' | 'id'
>;

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

const moundTypes = [
  'water',
  'seed',
  'grass',
  'add',
  'mound',
  'moundWet',
  'soil',
  'wet',
] as const;

const props = defineProps<{
  x: number;
  y: number;
  palnt?: PlantProps;
}>();

const emit = defineEmits<{
  (e: 'drop', args: Partial<PlantEmitProps>): void;
  (e: 'click', args: Partial<PlantEmitProps>): void;
}>();

/** Mound type */
const type: Ref<(typeof moundTypes)[number]> = ref('soil');

/** Plants infos */
const plant: Ref<PlantProps | undefined> = ref(undefined);

/** Tooltip content on hover */
// const tooltipContent = ref('');

const { message } = App.useApp();

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

  if (type.value === 'soil') {
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

  if (type.value === 'soil') {
    message.warning('土地上没有种植作物');
  } else {
    emit('click', {
      id: plant.value?.id,
      seedId: plant.value?.seedId,
      positionX: props.x,
      positionY: props.y,
      type: type.value,
      name: plant.value?.name,
    });
  }
}

watch(
  () => props.palnt,
  (value) => {
    if (!value) return;

    plant.value = value;

    if (value.plantStatus === 1) {
      type.value = 'add';
    }

    if (value.plantStatus === 2) {
      // Seed
      if (value.growStatus === 1) {
        type.value = 'seed';
      }
      // Growing
      if (value.growStatus === 2) {
        type.value = 'grass';
      }
    }
  }
);
</script>
<template>
  <a-tooltip :title="`x:${x}, y:${y}`">
    <div
      dropzone="move"
      :class="classes.block"
      @click="onClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <img :src="blockImg[type]" />
    </div>
  </a-tooltip>
</template>
