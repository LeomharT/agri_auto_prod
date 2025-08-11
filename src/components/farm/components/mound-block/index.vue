<script lang="ts" setup>
import { getFileURL } from '@/api/upload';
import useContext from '@/app/composables/useContext';
import type { PlantProps } from '@/models/farm.type';
import { App } from 'ant-design-vue';
import { computed, ref, useTemplateRef, watch, type Ref } from 'vue';
import PlantGrowth from '../plant-growth/index.vue';
import classes from './style.module.css';

const COLORS = {
  HOVER: '#52c41a',
  DANGER: '#ff4d4f',
};

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
  no: number;
  palnt?: PlantProps;
}>();

const emit = defineEmits<{
  (e: 'drop', args: Partial<PlantProps>): void;
  (e: 'click', args: Partial<PlantProps>): void;
}>();

const el = useTemplateRef('block');

/** Mound type */
const type: Ref<(typeof moundTypes)[number]> = ref('soil');

/** Plants infos */
const plant: Ref<PlantProps | undefined> = ref(undefined);

/** Tooltip content on hover */
// const tooltipContent = ref('');

const { message } = App.useApp();

const { farmConfig, picking, setSelected, selected, editingPlant } =
  useContext();

const isSelected = computed(() => {
  return !!selected.value.filter((item) => item.no === props.no).length;
});

const isEditing = computed(() => {
  return plant?.value?.id && plant.value.id === editingPlant.value;
});

function onDragOver(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    if (type.value === 'soil') {
      e.target.style.background = COLORS.HOVER;
    } else {
      e.target.style.background = COLORS.DANGER;
    }

    const img = e.target.querySelector('img');
    if (img) {
      img.style.opacity = '0.7';
    }
  }
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = '';

    const img = e.target.querySelector('img');
    if (img) {
      img.style.opacity = '';
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
      soilPositionX: props.x,
      soilPositionY: props.y,
      seedId: Number.parseInt(seedId!),
    });
  } else {
    message.error('只能在没有作物的土地上种植');
  }
}

function onPicking() {
  const index = selected.value.findIndex((item) => item.no === props.no);

  // Only select fields has plants
  if (picking.value instanceof Object && picking.value.seeds) {
    if (!props.palnt) {
      message.warning('请选择有植物的土地块!');
      return;
    }
  }

  if (index !== -1) {
    setSelected((prev) => {
      prev.splice(index, 1);
      return prev;
    });
  } else {
    const [xCoord, yCoord] = [
      (farmConfig!.value.width / farmConfig!.value.rowCount) * props.x,
      (farmConfig!.value.length / farmConfig!.value.columnCount) * props.y,
    ];

    if (picking.value instanceof Object && !picking.value.multiple) {
      setSelected([
        {
          no: props.no,
          positionX: Math.floor(xCoord),
          positionY: Math.floor(yCoord),
          positionZ: 0,
          soilPositionX: props.x,
          soilPositionY: props.y,
        },
      ]);
    } else {
      setSelected(
        selected.value.concat({
          no: props.no,
          positionX: Math.floor(xCoord),
          positionY: Math.floor(yCoord),
          positionZ: 0,
          soilPositionX: props.x,
          soilPositionY: props.y,
        })
      );
    }
  }
}

function onEditing() {
  if (type.value === 'soil') {
    message.warning('土地上没有种植作物');
  } else {
    emit('click', {
      id: plant.value?.id,
      seedId: plant.value?.seedId,
      soilPositionX: props.x,
      soilPositionY: props.y,
      type: type.value,
      name: plant.value?.name,
      plantStatus: plant.value?.plantStatus,
      growStatus: plant.value?.growStatus,
    });
  }
}

function onClick(e: MouseEvent) {
  e.preventDefault();

  if (!!picking.value) {
    onPicking();
  } else {
    onEditing();
  }
}

watch(
  () => props.palnt,
  (value) => {
    if (!value) {
      plant.value = undefined;
      type.value = 'soil';
      return;
    }

    plant.value = value;

    if (value.plantStatus === 1) {
      type.value = 'seed';
    }

    if (value.plantStatus === 2) {
      // Seed
      if (value.growStatus === 1) {
        type.value = 'moundWet';
      }
      // Growing
      if (value.growStatus === 2) {
        type.value = 'mound';
      }
    }
  }
);
</script>
<template>
  <a-popover>
    <template #content>
      <a-space direction="vertical" align="center">
        <a-image
          v-if="props.palnt?.seedImgUrl"
          :src="getFileURL(props.palnt?.seedImgUrl)"
          width="40px"
          height="40px"
        />
        <a-space>
          <a-typography-text>
            {{ props.palnt?.name ?? '空地' }}
          </a-typography-text>
        </a-space>
      </a-space>
    </template>
    <div
      v-bind:data-selected="isSelected || isEditing"
      v-bind:data-picking="!!picking"
      dropzone="move"
      ref="block"
      :class="classes.block"
      @click="onClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <img :src="blockImg[type]" />
      <teleport to="body">
        <plant-growth v-if="props.palnt?.growStatus === 2" :parent="el" />
      </teleport>
    </div>
  </a-popover>
</template>
