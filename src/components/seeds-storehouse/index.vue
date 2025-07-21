<script lang="ts" setup>
import { IconPlus } from '@tabler/icons-vue';
import { h, onMounted, useTemplateRef } from 'vue';
import classes from './style.module.css';

const listRef = useTemplateRef('list-ref');

const seeds = [
  { key: 1, label: '甜菜', img: '/imgs/beet.png' },
  { key: 2, label: '胡萝卜', img: '/imgs/carrot.png' },
  { key: 3, label: '生菜', img: '/imgs/lettuce.png' },
  { key: 4, label: '黄萝卜', img: '/imgs/yellow-radish.png' },
  { key: 1, label: '甜菜', img: '/imgs/beet.png' },
];

function handleOnDragStart(e: DragEvent, record: (typeof seeds)[number]) {
  e.stopPropagation();

  // Set drag image
  const img = new Image();
  img.src = record.img;
  e.dataTransfer?.setDragImage(img, 20, 20);

  // Set drag data
  e.dataTransfer?.setData('type', record.label);
}

function scrollShadow(el: HTMLDivElement) {
  if (el.scrollLeft === 0) {
    el.classList.remove(classes['has-left']);
  }

  if (el.scrollLeft > 0) {
    el.classList.add(classes['has-left']);
  }

  if (el.scrollWidth > el.clientWidth) {
    el.classList.add(classes['has-right']);
  }

  if (el.scrollLeft === el.clientWidth) {
    el.classList.remove(classes['has-right']);
  }
}

function handleOnScroll(e: Event) {
  const el = e.target as HTMLDivElement;

  scrollShadow(el);
}

onMounted(() => {
  if (listRef.value) {
    scrollShadow(listRef.value);
  }
});
</script>

<template>
  <a-card title="种子仓库">
    <div :class="classes.body">
      <div ref="list-ref" :class="classes.list" @scroll="handleOnScroll">
        <a-space
          v-for="(seed, index) in seeds"
          :key="index"
          align="center"
          direction="vertical"
        >
          <a-button
            shape="circle"
            size="large"
            draggable="true"
            :class="classes.seed"
            :icon="h('img', { src: seed.img, draggable: 'false' })"
            @dragstart="(e:DragEvent) => handleOnDragStart(e, seed)"
          />
          <span>
            {{ seed.label }}
          </span>
        </a-space>
      </div>
      <a-button
        shape="circle"
        size="large"
        :class="classes.add"
        :icon="h(IconPlus, { size: '36px', stroke: '1px' })"
      >
      </a-button>
    </div>
  </a-card>
</template>
