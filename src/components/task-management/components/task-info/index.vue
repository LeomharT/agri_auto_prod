<script setup lang="ts">
import type { ModalProps } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import { ref } from 'vue';

const props = defineProps<ModalProps>();

const modalRef = ref({
  name: '',
});

const rulesRef = ref({
  name: [{ required: true, message: '请输入任务名称' }],
});

const { validate, validateInfos } = useForm(modalRef, rulesRef);

function onOk() {
  validate().then((data) => {
    console.log(data);
  });
}

function onCancel() {
  modalRef.value = {
    name: '',
  };

  props.onCancel?.call({}, {} as MouseEvent);
}
</script>

<template>
  <a-modal :open="props.open" @ok="onOk" @cancel="onCancel" title="任务信息">
    <a-form layout="vertical">
      <a-form-item v-bind="validateInfos.name" name="name" label="任务名称">
        <a-input v-model:value="modalRef.name" placeholder="请输入任务名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
