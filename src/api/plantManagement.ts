import fetchData from '../utils/fetchData';

const prefix: string = import.meta.env.VITE_SERVER_HOST;

export function getAllCropSeedList() {
  return fetchData(`${prefix}/api/farmCrop/getAllCropSeedList`);
}
