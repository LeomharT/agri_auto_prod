<script lang="ts" setup>
import { IconPlus } from '@tabler/icons-vue';
import { useQuery } from '@tanstack/vue-query';
import { Empty } from 'ant-design-vue';
import { h, onMounted, ref, useTemplateRef, watchEffect } from 'vue';
import { getAllCropSeedList } from '../../api/plantManagement';
import { QUERIES } from '../../data/queries';
import CreateSeeds from './components/create-seeds/index.vue';
import classes from './style.module.css';

const listRef = useTemplateRef('list-ref');

const open = ref(true);

const query = useQuery({
  queryKey: [QUERIES.ALL_CROP_SEED_LIST],
  queryFn: getAllCropSeedList,
  initialData: [] as any,
});

watchEffect(() => {
  console.log(query.data.value);
});

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

  if (el.scrollLeft + el.clientWidth === el.scrollWidth) {
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
    <create-seeds :open="open" @cancel="open = false" />
    <div :class="classes.body">
      <div ref="list-ref" :class="classes.list" @scroll="handleOnScroll">
        <a-empty
          v-if="query.data.value.length === 0"
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          style="margin: 0 auto"
        />
        <a-space
          v-for="(seed, index) in query.data.value"
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
        type="dashed"
        :class="classes.add"
        :icon="h(IconPlus, { size: '36px', stroke: '1px' })"
        @click="open = true"
      >
      </a-button>
    </div>
  </a-card>
</template>
