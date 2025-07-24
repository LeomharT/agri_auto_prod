import type { Device } from '../models/device.type';
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
