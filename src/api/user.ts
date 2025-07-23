import type { FarmConfig } from '../models/farm.type';
import fetchData from '../utils/fetchData';

const prefix: string = import.meta.env.VITE_SERVER_HOST;

export function login({
  account,
  password,
  ownerUserId,
}: {
  account: string;
  password: string;
  ownerUserId: string;
}) {
  return fetchData<any>(`${prefix}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      account,
      password,
      ownerUserId,
    }),
  });
}

export function logout() {
  localStorage.clear();
  window.location.href = '/';
}

export function getFarmConfig() {
  return fetchData<FarmConfig>(`${prefix}/api/userFarm/getFarmConfig`);
}
