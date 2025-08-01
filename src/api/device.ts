import type { PlantProps } from '@/models/farm.type';
import type { Device, SensorData } from '../models/device.type';
import fetchData from '../utils/fetchData';
const prefix = import.meta.env.VITE_SERVER_HOST;
export function getBindDeviceList(id: number) {
  return fetchData<Device[]>(
    `${prefix}/api/farmDevice/getBindDeviceList?FarmId=${id}`
  );
}

export function addOrUpdateBindDevice(data: Device) {
  return fetchData(`${prefix}/api/farmDevice/addOrUpdateBindDevice`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteBindDevice(id: number) {
  return fetchData(`${prefix}/api/farmDevice/deleteBindDevice?id=${id}`, {
    method: 'DELETE',
  });
}

export function installTool({ id, type }: { id: number; type: number }) {
  return fetchData(`${prefix}/api/farmDevice/installTool`, {
    method: 'POST',
    body: JSON.stringify({
      farmId: id,
      toolType: type,
    }),
  });
}

export function unInstallTool({ id, type }: { id: number; type: number }) {
  return fetchData(`${prefix}/api/farmDevice/unInstallTool`, {
    method: 'POST',
    body: JSON.stringify({
      farmId: id,
      toolType: type,
    }),
  });
}

export function executeTask(task: PlantProps) {
  return fetchData(`${prefix}/api/farmDevice/executeTask`, {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export function getSensorDeviceLastestData(id: number) {
  return fetchData<SensorData[]>(
    `${prefix}/api/farmDevice/getSensorDeviceLastestData?FarmId=${id}`
  );
}
