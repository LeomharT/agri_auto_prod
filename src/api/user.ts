import type { FarmConfig } from '../models/farm.type';
import fetchData from '../utils/fetchData';

const prefix: string = window.VITE_SERVER_HOST;

console.log(prefix);

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

export function adminLogin(body: { appId: string; appSecret: string }) {
  console.log(`${prefix}/api/auth/adminLogin`);

  return fetchData<any>(`${prefix}/api/auth/adminLogin`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function logout() {
  localStorage.clear();
  window.location.href = '/';
}

export function getFarmConfig() {
  return fetchData<FarmConfig>(`${prefix}/api/userFarm/getFarmConfig`);
}
