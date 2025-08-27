import type { PlantProps } from '@/models/farm.type';
import type { DaHuaConfig, Device, SensorData } from '../models/device.type';
import fetchData from '../utils/fetchData';
const prefix: string = window.VITE_SERVER_HOST;

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

export function getMonitorConfig(id: number) {
  return fetchData<{
    monitorUrl: string;
    monitorPicFileId: string;
    monitorIsOnline: boolean;
  }>(`${prefix}/api/monitor/getMonitorConfig?farmId=${id}`);
}

export function getUserConfig(id: number) {
  return fetchData<DaHuaConfig>(
    `${prefix}/api/userSysConfig/getUserConfig?farmId=${id}`
  );
}

export function updateUserConfig(data: Partial<DaHuaConfig>) {
  return fetchData(`${prefix}/api/userSysConfig/updateUserConfig`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function takePhoto(id?: number) {
  return fetchData<{
    fileId: string;
    fileUrl: string;
  }>(`${prefix}/api/monitor/takePhoto`, {
    method: 'POST',
    body: JSON.stringify({
      farmId: id,
    }),
  });
}

export function removePhoto(fileId: string) {
  return fetchData(`${prefix}/api/monitor/removePhoto`, {
    method: 'POST',
    body: JSON.stringify({
      monitorPicFileId: fileId,
    }),
  });
}

export function savePhoto({
  farmId,
  fileId,
}: {
  fileId: string;
  farmId?: number;
}) {
  return fetchData(`${prefix}/api/monitor/savePhoto`, {
    method: 'POST',
    body: JSON.stringify({
      monitorPicFileId: fileId,
      farmId,
    }),
  });
}

export function moveArm(body: {
  farmId: number;
  destinationX: number;
  destinationY: number;
  destinationZ: number;
}) {
  return fetchData(`${prefix}/api/farmDevice/moveArm`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getRoboticArmToolInfo(id: number) {
  return fetchData<{
    workStatus: number;
    toolType: number;
    speedX: number;
    speedY: number;
    speedZ: number;
  }>(`${prefix}/api/farmDevice/getRoboticArmToolInfo?FarmId=${id}`);
}
