<script lang="ts" setup>
import { getAllCropSeedList } from '@/api/plant';
import { getFileURL } from '@/api/upload';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import type { Seed } from '@/models/seed.type';
import { IconPlus } from '@tabler/icons-vue';
import { useQuery } from '@tanstack/vue-query';
import { Empty } from 'ant-design-vue';
import { computed, h, onMounted, ref, useTemplateRef } from 'vue';
import SeedsInfo from '../seeds-info/index.vue';
import classes from './style.module.css';
const filePrefix = import.meta.env.VITE_FILE_SERVER_HOST;

const listRef = useTemplateRef('list-ref');

const open = ref(false);

const initialData = ref<undefined | Seed>();

const { farmConfig } = useContext();

const query = useQuery({
  queryKey: [QUERIES.ALL_CROP_SEED_LIST],
  queryFn: () => getAllCropSeedList(farmConfig?.value?.id as number),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

function handleOnDragStart(e: DragEvent, record: Seed) {
  e.stopPropagation();

  // Set drag image
  const img = new Image();
  img.src = getFileURL(record.imageUrl);
  e.dataTransfer?.setDragImage(img, 20, 20);

  // Set drag data
  e.dataTransfer?.setData('name', record.name);
  e.dataTransfer?.setData('seedId', record.id.toString());
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

function handleOnSeedClick(seed: Seed) {
  open.value = true;
  initialData.value = {
    ...seed,
  };
}

function onClose() {
  open.value = false;
  initialData.value = undefined;
}

onMounted(() => {
  if (listRef.value) {
    scrollShadow(listRef.value);
  }
});
</script>

<template>
  <a-card title="种子仓库">
    <seeds-info
      :open="open"
      :initial-data="initialData"
      @cancel="onClose"
      @ok="onClose"
    />
    <div :class="classes.body">
      <a-spin :spinning="query.isFetching.value || !farmConfig?.id">
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
              :icon="
                h('img', {
                  src: getFileURL(seed.imageUrl),
                  draggable: 'false',
                })
              "
              @click="() => handleOnSeedClick(seed)"
              @dragstart="(e:DragEvent) => handleOnDragStart(e, seed)"
            />
            <span>
              {{ seed.name }}
            </span>
          </a-space>
        </div>
      </a-spin>
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
