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
  <a-float-button
    v-if="picking"
    v-show="!(picking instanceof Object && picking.hideConfirm)"
    id="pick-confirm"
    shape="circle"
    type="primary"
    tooltip="确认选择"
    :class="classes.confirm"
    :data-collapse="collapse"
    @click="onPickConfirm"
  >
    <template #icon>
      <icon-check style="margin-left: -3px" />
    </template>
  </a-float-button>
</template>
