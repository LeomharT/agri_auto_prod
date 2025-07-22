<script lang="ts" setup>
import { useMutation } from '@tanstack/vue-query';
import { reactive } from 'vue';
import { login } from '../../api/user';
import { MUTATIONS } from '../../data/mutations';
import classes from './style.module.css';
const formState = reactive({
  account: '18059147746',
  password: '123456',
  ownerUserId: '1945340746815180802',
});

const mutation = useMutation({
  mutationKey: [MUTATIONS.LOGIN],
  mutationFn: login,
  onSuccess(data) {
    localStorage.setItem('token', data.accessToken);
    window.location.reload();
  },
});
</script>

<template>
  <div :class="classes.login">
    <a-card title="现代农业自动化生产实训平台" :class="classes.form">
      <a-form :model="formState" layout="vertical" @finish="mutation.mutate">
        <a-form-item label="账号" name="account" :rules="[{ required: true }]">
          <a-input v-model:value="formState.account" />
        </a-form-item>
        <a-form-item
          label="所有者ID"
          name="ownerUserId"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="formState.ownerUserId" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-button
          block
          type="primary"
          html-type="submit"
          :loading="mutation.isPending.value"
        >
          登录
        </a-button>
      </a-form>
    </a-card>
  </div>
</template>
