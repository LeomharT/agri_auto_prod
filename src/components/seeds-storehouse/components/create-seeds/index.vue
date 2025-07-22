<script lang="ts" setup>
import { IconPlus } from '@tabler/icons-vue';
import { Form, type ModalProps, type UploadProps } from 'ant-design-vue';
import { defineProps, ref } from 'vue';
type FormInput = {
  name: string;
  imageUrl: string;
};

const modelRef = ref<FormInput>({
  name: '',
  imageUrl: '',
});

const rulesRef = ref({
  name: [{ required: true, message: '请输入种子名称' }],
  imageUrl: [{ required: true, message: '请上传一张种子照片' }],
});

const { validateInfos, validate, resetFields } = Form.useForm(
  modelRef,
  rulesRef
);

const props = defineProps<ModalProps>();

const fileList = ref<UploadProps['fileList']>([]);

function onOk(e: MouseEvent) {
  props.onOk?.call({}, e);

  validate();
}

function onCancel(e: MouseEvent) {
  props.onCancel?.call({}, e);

  resetFields();
}
</script>

<template>
  <a-modal :open="props.open" title="创建种子" @ok="onOk" @cancel="onCancel">
    <a-form layout="vertical">
      <a-form-item label="种子名称" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" placeholder="请输入种子名称" />
      </a-form-item>
      <a-form-item label="种子照片" v-bind="validateInfos.imageUrl">
        <a-upload v-model:file-list="fileList" list-type="picture-card">
          <div>
            <icon-plus />
            <div>上传图片</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
