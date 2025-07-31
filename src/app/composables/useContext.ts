import { inject, type ComputedRef, type Ref } from 'vue';
import type { FarmConfig } from '../../models/farm.type';
import { APP_CONTEXT } from '../contex';

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
    picking: Ref<boolean>;
    setPicking: (val: boolean) => void;
  }>(APP_CONTEXT.PICKING)!;

  const { selected, setSelected } = inject<{
    selected: Ref<any[]>;
    setSelected: (val: any[] | ((prev: any[]) => any[])) => void;
  }>(APP_CONTEXT.SELECTED)!;

  const farmConfig = inject<ComputedRef<FarmConfig>>(APP_CONTEXT.FARM_CONFIG);

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
  };
}
