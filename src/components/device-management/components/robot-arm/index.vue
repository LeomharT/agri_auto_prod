<script lang="ts" setup>
import { moveArm } from '@/api/device';
import useContext from '@/app/composables/useContext';
import useEventEmitter from '@/app/composables/useEventEmitter';
import { MUTATIONS } from '@/data/mutations';
import { useMutation } from '@tanstack/vue-query';
import { App, Form } from 'ant-design-vue';
import { onMounted, onUnmounted, ref, toRaw, unref } from 'vue';

const { on, off } = useEventEmitter();

const { setPicking, farmConfig } = useContext();

const { message } = App.useApp();

const modalRef = ref<{
  destinationX?: number;
  destinationY?: number;
  destinationZ?: number;
}>({
  destinationX: undefined,
  destinationY: undefined,
  destinationZ: undefined,
});

const rulesRef = ref({
  destinationX: [{ required: true, message: '请输入坐标' }],
  destinationY: [{ required: true, message: '请输入坐标' }],
  destinationZ: [{ required: true, message: '请输入坐标' }],
});

const { validate, validateInfos } = Form.useForm(modalRef, rulesRef);

const mutation = useMutation({
  mutationKey: [MUTATIONS.ROBOT_ARM_MOVE],
  mutationFn: moveArm,
  onSuccess() {
    message.success('机械臂执行成功');
  },
});

function startPicking() {
  setPicking({
    multiple: false,
    seeds: false,
  });

  message.info('请选择需要执行的土地');
}

function onPicking(_selected: any[]) {
  const selected = toRaw(unref(_selected));

  if (selected.length) {
    modalRef.value.destinationX = selected[0].positionX;
    modalRef.value.destinationY = selected[0].positionY;
    modalRef.value.destinationZ = 0;
  }
}

function onExecute() {
  validate().then((data) => {
    mutation.mutate({
      ...data,
      farmId: farmConfig?.value?.id,
    });
  });
}

onMounted(() => {
  on('PICK_CONFIRM', onPicking);
});

onUnmounted(() => {
  off('PICK_CONFIRM', onPicking);
});
</script>

<template>
  <a-card>
    <a-form layout="inline">
      <a-form-item label="x" v-bind="validateInfos.destinationX">
        <a-input-number
          v-model:value="modalRef.destinationX"
          readonly
          style="width: 70px"
        />
      </a-form-item>
      <a-form-item label="y" v-bind="validateInfos.destinationY">
        <a-input-number
          v-model:value="modalRef.destinationY"
          readonly
          style="width: 70px"
        />
      </a-form-item>
      <a-form-item label="z" v-bind="validateInfos.destinationZ">
        <a-input-number
          v-model:value="modalRef.destinationZ"
          readonly
          style="width: 70px"
        />
      </a-form-item>
      <a-space>
        <a-button @click="startPicking">拾取坐标</a-button>
        <a-button :loading="mutation.isPending.value" @click="onExecute">
          移动机械臂
        </a-button>
      </a-space>
    </a-form>
  </a-card>
</template>
