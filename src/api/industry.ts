import type { IndustryDevice, IndustryProject } from '../models/industry.type';
import fetchData from '../utils/fetchData';
const prefix = import.meta.env.VITE_SERVER_HOST;

export async function getProjectList() {
  const data = await fetchData<{ items: IndustryProject[] }>(
    `${prefix}/api/iotCloud/getProjectList`
  );
  return data.items;
}

export async function getAllDeviceList(ProjectId: number) {
  return await fetchData<IndustryDevice[]>(
    `${prefix}/api/iotCloud/getAllDeviceList?ProjectId=${ProjectId}`
  );
}
