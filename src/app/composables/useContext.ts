import { computed, inject, type ComputedRef, type Ref } from 'vue';
import type { FarmConfig } from '../../models/farm.type';
import { APP_CONTEXT, type PickingStatus } from '../contex';

export default function useContext() {
  const { activeKey, setActiveKey } = inject<{
    activeKey: string;
    setActiveKey: (val: string) => void;
  }>(APP_CONTEXT.ACTIVE_KEY)!;

  const { collapse, setCollapse } = inject<{
    collapse: boolean;
    setCollapse: (val: boolean) => void;
  }>(APP_CONTEXT.COLLAPSE)!;

  const { picking, setPicking } = inject<{
    picking: Ref<PickingStatus>;
    setPicking: (val: PickingStatus) => void;
  }>(APP_CONTEXT.PICKING)!;

  const { selected, setSelected } = inject<{
    selected: Ref<any[]>;
    setSelected: (val: any[] | ((prev: any[]) => any[])) => void;
  }>(APP_CONTEXT.SELECTED)!;

  const { editingPlant, setEditingPlant } = inject<{
    editingPlant: Ref<number | undefined>;
    setEditingPlant: (val: number | undefined) => void;
  }>(APP_CONTEXT.EDITING_PLANT)!;

  const farmConfig = inject<ComputedRef<FarmConfig>>(APP_CONTEXT.FARM_CONFIG);

  /**
   * @default 3
   */
  const rowCount = computed(() => farmConfig?.value?.rowCount ?? 0);

  /**
   * @default 6
   */
  const columnCount = computed(() => farmConfig?.value?.columnCount ?? 0);

  return {
    farmConfig,
    activeKey,
    setActiveKey,
    collapse,
    setCollapse,
    picking,
    setPicking,
    selected,
    setSelected,
    editingPlant,
    setEditingPlant,
    rowCount,
    columnCount,
  };
}
