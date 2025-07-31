import type { Dayjs } from 'dayjs';

export const CompareType = {
  /// 小于
  LessThan: 1,
  /// 小于等于
  LessThanOrEqual: 2,
  /// 等于
  Equal: 3,
  /// 大于
  MoreThan: 4,
  /// 大于等于
  MoreThanOrEqual: 5,
  /// 不等于
  NotEqual: 6,
  /// 在...之间
  Between: 7,
} as const;

export const ToolHeadTypeEnum = {
  /// 种植
  Plant: 1,
  /// 浇水
  Water: 2,
  /// 除草
  Weeding: 3,
} as const;

export const compareSymbol = ['<', '≤', '=', '>', '≥', '≠', '-'] as const;
export const toolsType = {
  '1': '种植',
  '2': '浇水',
  '3': '除草',
};

export interface Task {
  id: number;
  userId: number;
  farmId: number;
  name: string;
  deviceKey: string;
  thingsProp: string;
  thingsPropName: string;
  deviceTaskCronType: number;
  compareType: (typeof CompareType)[keyof typeof CompareType];
  compareValueX: number;
  compareValueY: number;
  cron: string;
  nextExecuteTime: string;
  plantTaskStatus: number;
  setTime: string;
  weekDays: string;
  toolType: (typeof ToolHeadTypeEnum)[keyof typeof ToolHeadTypeEnum];
  weekRange: number[];
  dateRange: [Dayjs, Dayjs];
}
