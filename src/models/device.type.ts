export interface Device {
  id: number;
  deviceId: number;
  productId: number;
  projectId: number;
  productName: string;
  deviceName: string;
  deviceKey: string;
  deviceBindType: number;
  deviceStatus: number;
  speed: string;
}

export interface SensorData {
  propName: string;
  deviceKey: string;
  propKey: string;
  propUnit: string;
  propValue: string;
}

export interface DaHuaConfig {
  id: number;
  farmId: number;
  daHuaProductId: string;
  daHuaAccessKey: string;
  daHuaAccessSecrect: string;
  daHuaMonitorSn: string;
  daHuaMonitorPassword: string;
  daHuaMonitorCategory: string;
}
