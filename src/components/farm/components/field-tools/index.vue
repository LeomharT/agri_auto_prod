<script lang="ts" setup>
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import classes from './style.module.css';

const { activeKey, setActiveKey } = useContext();

const { trigger } = useEventEmitter();

const deactive = {
  plant: '/imgs/tools/btn_plant.png',
  water: '/imgs/tools/btn_water.png',
  grass: '/imgs/tools/btn_grass.png',
};

const active = {
  plant: '/imgs/tools/btn_plant_hover.png',
  water: '/imgs/tools/btn_water_hover.png',
  grass: '/imgs/tools/btn_grass_hover.png',
};

function onToolClick(type: number) {
  setActiveKey('device');

  trigger('TOOL_CLICK', type);
}
</script>

<template>
  <div :class="classes.tools">
    <a-tooltip title="除草工具">
      <div :class="classes.tool" @click="onToolClick(3)">
        <img :src="activeKey === 'device' ? active.grass : deactive.grass" />
      </div>
    </a-tooltip>
    <a-tooltip title="喷淋工具">
      <div :class="classes.tool" @click="onToolClick(2)">
        <img :src="activeKey === 'device' ? active.water : deactive.water" />
      </div>
    </a-tooltip>
    <a-tooltip title="种植工具">
      <div :class="classes.tool" @click="onToolClick(1)">
        <img :src="activeKey === 'device' ? active.plant : deactive.plant" />
      </div>
    </a-tooltip>
    <a-tooltip title="种子槽1号">
      <div :class="classes.sloat">
        <img src="/imgs/tools/seed_hover.png" />
      </div>
    </a-tooltip>
    <a-tooltip title="种子槽2号">
      <div :class="classes.sloat">
        <img src="/imgs/tools/seed_hover.png" />
      </div>
    </a-tooltip>
    <a-tooltip title="种子槽3号">
      <div :class="classes.sloat">
        <img src="/imgs/tools/seed_hover.png" />
      </div>
    </a-tooltip>
  </div>
</template>
