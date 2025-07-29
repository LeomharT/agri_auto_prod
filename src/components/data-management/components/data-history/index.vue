<script setup lang="ts">
import { dataGroupQuery } from '@/api/data';
import { getSensorDevicePropList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import { QUERIES } from '@/data/queries';
import { useQuery } from '@tanstack/vue-query';
import { Empty } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { computed, ref } from 'vue';
import classes from './style.module.css';

const { farmConfig } = useContext();

const params = ref({
  DeviceKey: undefined,
  ThingsProp: undefined,
  DateRange: [dayjs().subtract(1, 'week'), dayjs()] as [Dayjs, Dayjs],
});

const devices = useQuery({
  queryKey: [QUERIES.TASK_DEVICE],
  queryFn: () => getSensorDevicePropList(farmConfig!.value!.id),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

const query = useQuery({
  queryKey: [QUERIES.DATA_HISTORY],
  queryFn: () => dataGroupQuery(params.value),
  enabled: false,
});

function onSubmit(data: typeof params.value) {
  console.log(data);
  query.refetch();
}

function onReset() {
  params.value = {
    DeviceKey: undefined,
    ThingsProp: undefined,
    DateRange: [dayjs().subtract(1, 'week'), dayjs()],
  };
}
</script>
<template>
  <a-card title="历史数据" :body-style="{ padding: 0 }">
    <template #extra>
      <a-button>导出数据</a-button>
    </template>
    <a-form
      layout="inline"
      :class="classes.filter"
      :model="params"
      @finish="onSubmit"
    >
      <a-form-item name="DeviceKey" :rules="[{ required: true }]">
        <a-select
          v-model:value="params.DeviceKey"
          placeholder="请选择设备"
          style="width: 120px"
          :options="
            devices.data.value.reduce((prev, curr) => {
              const key = prev.filter((item:typeof curr) => item.deviceKey === curr.deviceKey);
              if(!key.length) prev.push(curr)
              return prev;
            }, [] as typeof devices.data.value)
          "
          :field-names="{ label: 'deviceName', value: 'deviceKey' }"
          @change="params.ThingsProp = undefined"
        />
      </a-form-item>
      <a-form-item name="ThingsProp" :rules="[{ required: true }]">
        <a-select
          v-model:value="params.ThingsProp"
          placeholder="请选择数据源"
          style="width: 120px"
          :options="
            devices.data.value.filter(
              (item) => item.deviceKey === params.DeviceKey
            )
          "
          :field-names="{ label: 'propName', value: 'propKey' }"
        />
      </a-form-item>
      <a-form-item name="DateRange" :rules="[{ required: true }]">
        <a-range-picker v-model:value="params.DateRange" style="width: 150px" />
      </a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button html-type="reset" @click="onReset">重置</a-button>
      </a-space>
    </a-form>
    <div :class="classes.graph">
      <a-empty title="暂无数据" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </div>
  </a-card>
</template>
