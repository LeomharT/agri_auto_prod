<script setup lang="ts">
import { getMonitorConfig } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import {
  IconChevronLeft,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-vue';
import { useQuery } from '@tanstack/vue-query';
import { Empty } from 'ant-design-vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import VideoPlayer from './VideoPlayer.vue';
import classes from './style.module.css';
import videoPlayer from './videoPlayer';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const { farmConfig } = useContext();

const player = ref<any>();

const isPlaying = ref(false);

const query = useQuery({
  queryKey: [QUERIES.MONITOR_CONFIG],
  queryFn: () => getMonitorConfig(farmConfig?.value?.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
});

function onPlay() {
  try {
    player.value.play();
    isPlaying.value = true;
  } catch {
    isPlaying.value = false;
  }
}

function onPause() {
  try {
    player.value.close();
    isPlaying.value = false;
  } catch {
    isPlaying.value = false;
  }
}

onMounted(() => {
  let needImport = true;

  const scripts = document.head.querySelectorAll('script');
  scripts.forEach((s) => {
    if (s.src.includes('libplay.js')) needImport = false;
  });

  if (needImport) {
    videoPlayer.init([player.value]);
  }
});

onUnmounted(() => {
  player.value?.close();
});
</script>
<template>
  <a-card :body-style="{ padding: 0 }">
    <template #extra>
      <a-button>设置</a-button>
    </template>
    <template #title>
      <a-space>
        <a-button type="text" @click="emit('back')">
          <template #icon>
            <icon-chevron-left />
          </template>
        </a-button>
        <span style="font-size: 16px"> 监控画面 </span>
      </a-space>
    </template>
    <div :class="classes.player">
      <video-player
        ref="player"
        id="player"
        :isLive="true"
        :isEncrypt="false"
        :videoURL="query.data.value?.monitorUrl ?? ''"
      />
      <a-button v-if="!isPlaying" :class="classes.btn" ghost @click="onPlay">
        <icon-player-play-filled />
      </a-button>
      <a-button v-if="isPlaying" :class="classes.btn" ghost @click="onPause">
        <icon-player-pause-filled />
      </a-button>
    </div>
    <a-flex justify="space-between" gap="large" style="padding: 8px 8px 0 8px">
      <a-button block type="primary">拍摄截图</a-button>
      <a-space>
        <a-button>保存截图</a-button>
        <a-button danger>删除截图</a-button>
      </a-space>
    </a-flex>
    <a-divider />
    <a-empty title="暂无图片" :image="Empty.PRESENTED_IMAGE_SIMPLE"> </a-empty>
  </a-card>
</template>
