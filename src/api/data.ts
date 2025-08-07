import type { Task } from '@/models/task.type';
import fetchData from '@/utils/fetchData';
const prefix = import.meta.env.VITE_SERVER_HOST;

export async function getTaskRecordList(_params: any) {
  const params = new URLSearchParams(_params);

  params.set('PageSize', '10');

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

export function dataGroupQuery(_params: any) {
  const params = new URLSearchParams(_params);

  if (_params.DateRange) {
    params.set('StartTime', _params.DateRange[0].format('YYYY-MM-DD'));
    params.set('EndTime', _params.DateRange[1].format('YYYY-MM-DD'));
    params.delete('DateRange');
  }

  return fetchData<any[]>(
    `${prefix}/api/data/dataGroupQuery?${params.toString()}`
  );
}

export function exportTaskLog(_params: any) {
  const params = new URLSearchParams(_params);

  if (_params.DateRange) {
    params.set('BeginTime', _params.DateRange[0].format('YYYY-MM-DD 00:00:01'));
    params.set('EndTime', _params.DateRange[1].format('YYYY-MM-DD 23:59:59'));
    params.delete('DateRange');
  }

  if (!_params.ToolType) {
    params.delete('ToolType');
  }

  return fetchData<{ data: string }>(
    `${prefix}/api/farmDeviceTask/getRecordExport?${params.toString()}`
  );
}

export function exportDataHistory(_params: any) {
  const params = new URLSearchParams(_params);

  if (_params.DateRange) {
    params.set('StartTime', _params.DateRange[0].format('YYYY-MM-DD'));
    params.set('EndTime', _params.DateRange[1].format('YYYY-MM-DD'));
    params.delete('DateRange');
  }

  return fetchData(`${prefix}/api/data/getExport?${params.toString()}`);
}
