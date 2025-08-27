import type { Seed } from '../models/seed.type';
import fetchData from '../utils/fetchData';

const prefix: string = window.VITE_SERVER_HOST;

export async function getAllCropSeedList(farmId: number) {
  const data = await fetchData<{ items: Seed[] }>(
    `${prefix}/api/farmCrop/getAllCropSeedList?farmId=${farmId}`
  );
  return data.items;
}

export async function addOrUpdateCropSeed(input: Seed) {
  return fetchData(`${prefix}/api/farmCrop/addOrUpdateCropSeed`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function deleteCropSeed(id: number) {
  return fetchData(`${prefix}/api/farmCrop/deleteCropSeed?seedId=${id}`, {
    method: 'DELETE',
  });
}

export async function getCropGroups(id: number) {
  return fetchData<any>(`${prefix}/api/farmCrop/getCropGroups?farmId=${id}`);
}
