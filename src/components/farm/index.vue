<script lang="ts" setup>
import { getFarmCropList } from '@/api/farm';
import useContext from '@/app/composables/useContext';
import PlantInfo from '@/components/plant-management/components/plant-info/index.vue';
import { QUERIES } from '@/data/queries';
import type { PlantProps } from '@/models/farm.type';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import FieldTools from './components/field-tools/index.vue';
import MoundBlock from './components/mound-block/index.vue';
import classes from './style.module.css';

const { farmConfig, rowCount, columnCount, picking, setEditingPlant } =
  useContext();

const open = ref(false);

const plant = ref<Partial<PlantProps>>({});

const query = useQuery({
  queryKey: [QUERIES.FARM_CROP_LIST],
  queryFn: () => getFarmCropList(farmConfig?.value?.id),
  enabled: computed(() => Boolean(farmConfig?.value?.id)),
  initialData: [],
});

function xIndex(i: number) {
  return (i - 1) % rowCount.value;
}

function yIndex(i: number) {
  return columnCount.value - Math.ceil(i / rowCount.value);
}

function onPlantDrop(args: Partial<PlantProps>) {
  plant.value = {
    ...args,
  };
  open.value = true;
}

function onPlantClick(args: Partial<PlantProps>) {
  plant.value = {
    ...args,
  };
  open.value = true;

  setEditingPlant(args.no);
}

function onCancel() {
  open.value = false;

  setEditingPlant(undefined);
}

function onConfirm(parent: string, args?: Partial<PlantProps>) {
  if (parent === 'farm') {
    open.value = true;

    if (args) {
      setEditingPlant(args.no);
    }
  }
}
</script>

<template>
  <div :class="classes.board">
    <a-alert
      v-if="picking"
      :class="classes.alert"
      message="提示"
      description="请点击农场上的土地将其选中, 再次点击取消选中"
      type="info"
      show-icon
      closable
    />
    <plant-info
      :open="open"
      :initial-value="plant"
      :parent="'farm'"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
    <div :class="classes.ground">
      <field-tools />
      <div v-for="i in 3 * 6" :class="classes.blocks" :key="i">
        <mound-block
          :no="i"
          :x="xIndex(i)"
          :y="yIndex(i)"
          :palnt="
            query.data.value.filter(
              (item) =>
                item.soilPositionX === xIndex(i) &&
                item.soilPositionY === yIndex(i)
            )[0]
          "
          @click="onPlantClick"
          @drop="onPlantDrop"
        />
      </div>
    </div>
  </div>
</template>
