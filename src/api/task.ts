import type { Task } from '@/models/task.type';
import fetchData from '@/utils/fetchData';
const prefix = import.meta.env.VITE_SERVER_HOST;

export async function getTaskList(_params: any) {
  const params = new URLSearchParams(_params);
  const data = await fetchData<{
    items: Task[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  }>(`${prefix}/api/farmDeviceTask/getPageList?${params.toString()}`);
  return {
    items: data.items,
    page: data.pageIndex,
    pageSize: data.pageSize,
    total: data.totalCount,
  };
}

export async function getTaskRecordList(_params: any) {
  const params = new URLSearchParams(_params);

  if (_params.DateRange) {
    params.set('BeginTime', _params.DateRange[0].format('YYYY-MM-DD 00:00:01'));
    params.set('EndTime', _params.DateRange[1].format('YYYY-MM-DD 23:59:59'));
    params.delete('DateRange');
  }

  if (!_params.ToolType) {
    params.delete('ToolType');
  }

  const data = await fetchData<{
    items: Task[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
  }>(`${prefix}/api/farmDeviceTask/getRecordPageList?${params.toString()}`);
  return {
    items: data.items,
    page: data.pageIndex,
    pageSize: data.pageSize,
    total: data.totalCount,
  };
}

type DailyTaskQuery = {
  FarmId: string;
  Year: string;
  Month: string;
};

export async function getDailyTaskCountList(params: DailyTaskQuery) {
  const search = new URLSearchParams(params);
  return fetchData<{ date: string; count: number }[]>(
    `${prefix}/api/farmDeviceTask/getDailyTaskCountList?${search.toString()}`
  );
}

export async function getSensorDevicePropList(farmId: number) {
  return fetchData<
    {
      deviceKey: string;
      deviceName: string;
      propKey: string;
      propName: string;
      propUnit: string;
    }[]
  >(`${prefix}/api/farmDevice/getSensorDevicePropList?farmId=${farmId}`);
}

export async function addOrUpdateTask(task: Task) {
  return fetchData(`${prefix}/api/farmDeviceTask/addOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function deleteTask(ids: number[]) {
  return fetchData(`${prefix}/api/farmDeviceTask/delete`, {
    method: 'DELETE',
    body: JSON.stringify({
      ids,
    }),
  });
}
