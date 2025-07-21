<script lang="ts" setup>
import { message } from 'ant-design-vue';
import useContext from '../../composables/useContext';
import classes from './style.module.css';

const [messageApi, contextHolder] = message.useMessage();

const { collapse } = useContext();

function handleOnDragOver(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = '#52c41a';
  }
}

function handleOnDragLeave(e: DragEvent) {
  e.preventDefault();

  if (e.target instanceof HTMLDivElement) {
    e.target.style.background = 'beige';
  }
}

function handleOnDrop(e: DragEvent) {
  e.preventDefault();

  handleOnDragLeave(e);

  const data = e.dataTransfer?.getData('type');

  if (data) {
    messageApi.success(`你种植了${data}`);
  }
}
</script>

<template>
  <main
    id="app-content"
    :class="classes.content"
    :data-collapse="collapse"
    dropzone="true"
    @drop="handleOnDrop"
    @dragover="handleOnDragOver"
    @dragleave="handleOnDragLeave"
  >
    <context-holder />
    <div></div>
  </main>
</template>
