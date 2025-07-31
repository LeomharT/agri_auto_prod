<script setup lang="ts">
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { IconCheck } from '@tabler/icons-vue';
const { picking, setPicking, setSelected, selected } = useContext();

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
    id="pick-confirm"
    shape="circle"
    type="primary"
    tooltip="确认选择"
    style="width: 48px; height: 48px"
    @click="onPickConfirm"
  >
    <template #icon>
      <icon-check style="margin-left: -3px" />
    </template>
  </a-float-button>
</template>
