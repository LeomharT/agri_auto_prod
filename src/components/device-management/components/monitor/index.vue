<script setup lang="ts">
import { getMonitorConfig } from '@/api/device';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { IconChevronLeft } from '@tabler/icons-vue';
import { useQuery } from '@tanstack/vue-query';
import { Empty } from 'ant-design-vue';
import { computed, onMounted, ref } from 'vue';
import videoPlayer from './videoPlayer';
import VideoPlayer from './VideoPlayer.vue';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const { farmConfig } = useContext();

const player = ref<any>();

const query = useQuery({
  queryKey: [QUERIES.MONITOR_CONFIG],
  queryFn: () => getMonitorConfig(farmConfig?.value?.id!),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
});

onMounted(() => {
  videoPlayer.init([player.value]);
});
</script>
<template>
  <a-card :body-style="{ padding: 0 }">
    <template #extra>
      <a-button @click="() => player.play()">设置</a-button>
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
    <video-player
      ref="player"
      id="player"
      :isLive="true"
      :isEncrypt="false"
      :videoURL="query.data.value?.monitorUrl ?? ''"
    />
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
