import type { PlantProps } from '@/models/farm.type';
import fetchData from '../utils/fetchData';
const prefix: string = import.meta.env.VITE_SERVER_HOST;

export async function getFarmCropList(id?: number) {
  return fetchData<PlantProps[]>(
    `${prefix}/api/farmCrop/getFarmCropList?farmId=${id}`
  );
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
