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
