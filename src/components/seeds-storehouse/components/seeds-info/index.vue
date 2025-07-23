<script lang="ts" setup>
import { IconPlus } from '@tabler/icons-vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  App,
  Form,
  type ModalProps,
  type UploadFile,
  type UploadProps,
} from 'ant-design-vue';
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
import { defineProps, ref, watchEffect } from 'vue';
import { addOrUpdateCropSeed } from '../../../../api/plantManagement';
import { uploadFile } from '../../../../api/upload';
import useContext from '../../../../app/composables/useContext';
import { MUTATIONS } from '../../../../data/mutations';
import { QUERIES } from '../../../../data/queries';
import type { Seed } from '../../../../models/seed.type';
const filePrefix = import.meta.env.VITE_FILE_SERVER_HOST;

type FormInput = {
  name: string;
  imageUrl: string;
};

const props = defineProps<ModalProps & { initialData?: Seed }>();

const { message } = App.useApp();

const { farmConfig } = useContext();

const queryClient = useQueryClient();

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

const fileList = ref<UploadProps['fileList']>([]);

const upload = useMutation({
  mutationKey: [MUTATIONS.UPLOAD],
  mutationFn: uploadFile,
  onSuccess(data) {
    modelRef.value.imageUrl = data.fileUrl;
    if (fileList.value?.length) {
      fileList.value[0].status = 'done';
      fileList.value[0].url = `${filePrefix}${data.fileUrl}`;
    }
  },
  onError() {
    modelRef.value.imageUrl = '';
    if (fileList.value?.length) {
      fileList.value[0].status = 'error';
    }
  },
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.CREATE_SEED],
  mutationFn: addOrUpdateCropSeed,
  onSuccess() {
    // Reset form state
    resetFields();
    fileList.value = [];

    // Message
    message.success('种子信息更新成功');
    props.onOk?.call({}, {} as any);

    // Reset seed list query
    queryClient.invalidateQueries({
      queryKey: [QUERIES.ALL_CROP_SEED_LIST],
    });
  },
});

function onUpload(e: UploadRequestOption) {
  const _file = e.file as UploadFile;

  const file = {
    uid: _file.uid,
    name: _file.name,
    fileName: _file.fileName,
    status: 'uploading',
    percent: 50,
  } satisfies UploadFile;

  fileList.value = [file];

  upload.mutate(e.file as File);
}

function onUpdateList(_fileList: UploadFile[]) {
  // Remove from file list
  fileList.value = _fileList;
  // Remove from form data
  modelRef.value.imageUrl = '';
}

function onOk() {
  validate().then((_data) => {
    const data = {
      ..._data,
      farmId: farmConfig?.value.id,
    };

    if (props.initialData) {
      data['id'] = props.initialData.id;
    }

    mutation.mutate(data);
  });
}

function onCancel(e: MouseEvent) {
  props.onCancel?.call({}, e);
  resetFields();
}

watchEffect(() => {
  if (props.open && props.initialData) {
    modelRef.value = {
      name: props.initialData.name,
      imageUrl: props.initialData.imageUrl,
    };

    fileList.value = [
      {
        uid: '1',
        name: props.initialData.name,
        url: filePrefix + props.initialData.imageUrl,
        status: 'done',
      },
    ];
  }
});
</script>

<template>
  <a-modal
    title="创建种子"
    :open="props.open"
    :confirm-loading="mutation.isPending.value"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form layout="vertical">
      <a-form-item label="种子名称" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" placeholder="请输入种子名称" />
      </a-form-item>
      <a-form-item label="种子照片" v-bind="validateInfos.imageUrl">
        <a-upload
          v-bind:file-list="fileList"
          list-type="picture-card"
          :custom-request="onUpload"
          @update:file-list="onUpdateList"
        >
          <div>
            <icon-plus />
            <div>上传图片</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
