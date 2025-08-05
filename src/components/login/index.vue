<script lang="ts" setup>
import { IconLock, IconPassword, IconUser } from '@tabler/icons-vue';
import { useMutation } from '@tanstack/vue-query';
import { h, reactive } from 'vue';
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
    localStorage.setItem('userId', data.userId);

    window.location.reload();
  },
});
</script>

<template>
  <div :class="classes.login">
    <a-card :class="classes.form">
      <div :class="classes.logo">
        <img src="/imgs/icon_smartfarmer@2x.png" />
        <h1>SmartFarmer</h1>
      </div>
      <a-typography-title :level="4"> 您好, 欢迎登录👋 </a-typography-title>
      <a-form layout="vertical" :model="formState" @finish="mutation.mutate">
        <a-form-item name="account" :rules="[{ required: true }]">
          <a-input v-model:value="formState.account" :prefix="h(IconUser)" />
        </a-form-item>
        <a-form-item name="ownerUserId" :rules="[{ required: true }]">
          <a-input
            v-model:value="formState.ownerUserId"
            :prefix="h(IconPassword)"
          />
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true }]">
          <a-input-password
            v-model:value="formState.password"
            :prefix="h(IconLock)"
          />
        </a-form-item>
        <a-form-item>
          <a-space style="width: 100%; justify-content: space-between">
            <a-checkbox>保持登录状态</a-checkbox>
            <a-button size="small" type="link"> 忘记密码 </a-button>
          </a-space>
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
      <p style="margin: 48px 0 0; color: rgba(0, 0, 0, 0.45); font-size: 12px">
        ©2021-2023 北京新大陆时代科技有限公司 版权所有
      </p>
    </a-card>
  </div>
</template>
