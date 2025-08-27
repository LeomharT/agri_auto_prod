import type { PlantProps } from '@/models/farm.type';
import fetchData from '../utils/fetchData';
const prefix: string = window.VITE_SERVER_HOST;

/** 获取农场植物列表 */
export async function getFarmCropList(id?: number) {
  return fetchData<PlantProps[]>(
    `${prefix}/api/farmCrop/getFarmCropList?farmId=${id}`
  );
}

/** 获取植物详情 */
export async function getCropItem(id: number) {
  return fetchData<PlantProps>(`${prefix}/api/farmCrop/getCropItem?id=${id}`);
}

export async function addOrUpdateCrop(data: Partial<PlantProps>) {
  return fetchData(`${prefix}/api/farmCrop/addOrUpdateCrop`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCrop(id: number) {
  return fetchData(`${prefix}/api/farmCrop/deleteCrop?id=${id}`, {
    method: 'DELETE',
  });
}

export async function deleteAllCrop(seedId: number) {
  return fetchData(`${prefix}/api/farmCrop/deleteAllCrop?seedId=${seedId}`, {
    method: 'DELETE',
  });
}
