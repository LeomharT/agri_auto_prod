<script setup lang="ts">
import { getMonitorConfig, takePhoto } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import {
  IconChevronLeft,
  IconLoader2,
  IconPlayerPlayFilled,
  IconSettings,
} from '@tabler/icons-vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { App, Empty } from 'ant-design-vue';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import MonitorSettings from '../monitor-settings/index.vue';
import VideoPlayer from './VideoPlayer.vue';
import classes from './style.module.css';
import videoPlayer from './videoPlayer';
const host = import.meta.env.VITE_SERVER_HOST;

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const { message, modal } = App.useApp();

const { farmConfig } = useContext();

const userId = localStorage.getItem('userId');

const fileId = ref('');

const open = ref(false);

const player = ref<any>();

const isPlaying = ref(false);

const query = useQuery({
  queryKey: [QUERIES.MONITOR_CONFIG],
  queryFn: () => getMonitorConfig(farmConfig?.value?.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
});

const mutationPhoto = useMutation({
  mutationKey: [MUTATIONS.TAKE_PHOTO],
  mutationFn: () => takePhoto(farmConfig?.value?.id),
  onSuccess(data) {
    fileId.value = data.fileId;
  },
});

async function onPlay() {
  if (!query.data.value?.monitorUrl) {
    message.error('未获取到视频地址');
    return;
  }

  try {
    player.value.play();
    isPlaying.value = true;
  } catch {
    isPlaying.value = false;
  }
}

function onCancel() {
  open.value = false;
}

function uploadSnapShot() {
  window.open(
    `${host}/api/file/source?fileId=${fileId.value}&userId=${userId}`
  );
}

function deleteSnapShot() {
  modal.confirm({
    title: '删除截图',
    content: '您确定要删除截图吗',
    onOk() {
      fileId.value = '';
    },
  });
}

watch(
  () => query.data.value,
  async () => {
    await nextTick();

    onPlay();
  }
);

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

onBeforeUnmount(() => {
  const scripts = document.head.querySelectorAll('script');
  scripts.forEach((s) => {
    if (s.src.includes('libplay.js')) s.remove();
  });

  player.value?.close();
  player.value?.closeIVS();

  player.value = null;
});
</script>
<template>
  <a-card :body-style="{ padding: 0 }">
    <monitor-settings :open="open" @cancel="onCancel" />
    <template #extra>
      <a-button @click="open = true">
        <a-flex align="center" gap="small">
          <icon-settings size="18px" />
          设置
        </a-flex>
      </a-button>
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
    <div :class="classes.player" :data-playing="isPlaying">
      <video-player
        ref="player"
        id="player"
        :isLive="true"
        :isEncrypt="false"
        :videoURL="query.data.value?.monitorUrl ?? ''"
        @update:rtspURL="() => console.log('Video Closed')"
      />
      <a-button
        v-if="!isPlaying && !query.isFetching.value"
        :class="classes.btn"
        ghost
      >
        <icon-player-play-filled />
      </a-button>
      <a-button
        v-if="!isPlaying && query.isFetching.value"
        ghost
        :class="`${classes.btn} ${classes.loader}`"
      >
        <icon-loader2 />
      </a-button>
    </div>
    <a-flex justify="space-between" gap="large" style="padding: 8px 8px 0 8px">
      <a-button
        block
        type="primary"
        :loading="mutationPhoto.isPending.value"
        @click="() => mutationPhoto.mutate()"
      >
        拍摄截图
      </a-button>
      <a-space v-if="fileId">
        <a-button @click="uploadSnapShot"> 保存截图 </a-button>
        <a-button danger @click="deleteSnapShot"> 删除截图 </a-button>
      </a-space>
    </a-flex>
    <a-divider />
    <a-empty
      v-if="!fileId"
      title="暂无图片"
      :image="Empty.PRESENTED_IMAGE_SIMPLE"
    >
    </a-empty>
    <a-image
      v-if="fileId"
      :src="`${host}/api/file/source?fileId=${fileId}&userId=${userId}`"
    />
  </a-card>
</template>
