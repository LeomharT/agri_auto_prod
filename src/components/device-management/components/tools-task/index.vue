<script lang="ts" setup></script>

<template>
  <a-flex vertical>
    <a-typography-paragraph>设置种植工具速度 (%)</a-typography-paragraph>
    <a-form layout="inline">
      <a-form-item label="x"><a-input-number /></a-form-item>
      <a-form-item label="y"><a-input-number /></a-form-item>
      <a-form-item label="z"><a-input-number /></a-form-item>
    </a-form>
    <a-divider />
    <a-typography-paragraph>设置目的坐标 (cm)</a-typography-paragraph>
    <a-form layout="inline">
      <a-form-item>
        <a-select style="min-width: 150px" placeholder="请选执行区域" />
      </a-form-item>
      <a-form-item label="x">
        <a-input-number style="width: 50px" />
      </a-form-item>
      <a-form-item label="y">
        <a-input-number style="width: 50px" />
      </a-form-item>
      <a-form-item label="z">
        <a-input-number style="width: 50px" />
      </a-form-item>
      <a-button>执行任务</a-button>
    </a-form>
  </a-flex>
</template>
