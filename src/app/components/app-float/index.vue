<script setup lang="ts">
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { IconCheck } from '@tabler/icons-vue';
import classes from './style.module.css';

const { collapse, picking, setPicking, setSelected, selected } = useContext();

const { trigger } = useEventEmitter();

function onPickConfirm() {
  trigger('PICK_CONFIRM', selected);

  // Reset
  setPicking(false);
  setSelected([]);
}
</script>

<template>
  <a-tooltip v-if="picking" title="确认选择" :arrow="false">
    <a-float-button
      v-show="!(picking instanceof Object && picking.hideConfirm)"
      id="pick-confirm"
      shape="circle"
      type="primary"
      :class="classes.confirm"
      :data-collapse="collapse"
      @click="onPickConfirm"
    >
      <template #icon>
        <icon-check style="margin-left: -3px" />
      </template>
    </a-float-button>
  </a-tooltip>
</template>
