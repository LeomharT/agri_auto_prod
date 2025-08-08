import { readonly } from 'vue';

export const APP_CONTEXT = readonly({
  FARM_CONFIG: 'FARM_CONFIG',
  ACTIVE_KEY: 'ACTIVE_KEY',
  COLLAPSE: 'COLLAPSE',
  PICKING: 'PICKING',
  SELECTED: 'SELECTED',
  EDITING_PLANT: 'EDITING_PLANT',
});

export type PickingStatus =
  | boolean
  | {
      /** Allow multiple select */
      multiple: boolean;
      /** Only select field has seeds */
      seeds: boolean;
      /** Is showing confirm button */
      hideConfirm?: boolean;
    };
