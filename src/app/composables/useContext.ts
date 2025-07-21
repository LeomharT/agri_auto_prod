import { inject } from 'vue';
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

  return {
    activeKey,
    setActiveKey,
    collapse,
    setCollapse,
  };
}
