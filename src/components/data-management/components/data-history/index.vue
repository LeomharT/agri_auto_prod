<script setup lang="ts">
import { dataGroupQuery, exportDataHistory } from '@/api/data';
import { getSensorDevicePropList } from '@/api/task';
import useContext from '@/app/composables/useContext';
import { MUTATIONS } from '@/data/mutations';
import { QUERIES } from '@/data/queries';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { App } from 'ant-design-vue';
import ApexCharts, { type ApexOptions } from 'apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import classes from './style.module.css';

const el = useTemplateRef('chart');

const apexcharts = ref<ApexCharts>();

const { farmConfig } = useContext();

const { message } = App.useApp();

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
  initialData: [],
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.EXPORT_DATA_HISTORY],
  mutationFn: () => exportDataHistory(params.value),
  onSuccess() {
    message.success({ key: 'EXPORTING', content: '日志导出成功' });
  },
});

function onSubmit() {
  query.refetch();
}

function onReset() {
  params.value = {
    DeviceKey: undefined,
    ThingsProp: undefined,
    DateRange: [dayjs().subtract(1, 'week'), dayjs()],
  };
}

function onExport() {
  if (params.value.DeviceKey && params.value.ThingsProp) {
    message.loading({ key: 'EXPORTING', content: '日志导出中' });
    mutation.mutate();
  } else {
    message.warning({ content: '请选择设备和数据来源' });
  }
}

watch(
  () => query.data.value,
  (value: any[]) => {
    apexcharts.value?.updateOptions({
      series: [
        {
          name: '数值',
          data: value.map((item) => item.value),
        },
      ],
      xaxis: {
        categories: value.map((item) => item.staticsTime),
      },
    } as ApexOptions);
  }
);

onMounted(() => {
  apexcharts.value = new ApexCharts(
    el.value as HTMLDivElement,
    {
      series: [
        {
          name: '数值',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      noData: {
        text: '暂无数据',
      },
      colors: ['#00b96b'],
      xaxis: {
        categories: [],
      },
    } as ApexOptions
  );

  apexcharts.value.render();
});
</script>
<template>
  <a-card title="历史数据" :body-style="{ padding: 0 }">
    <template #extra>
      <a-button @click="onExport">导出数据</a-button>
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
        <a-range-picker
          v-model:value="params.DateRange"
          style="width: 220px"
          :disabled-date="
            (current) => {
              return current.isAfter(dayjs());
            }
          "
        />
      </a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button html-type="reset" @click="onReset">重置</a-button>
      </a-space>
    </a-form>
    <div ref="chart" :class="classes.graph"></div>
  </a-card>
</template>
