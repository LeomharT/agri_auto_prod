import { VueQueryPlugin } from '@tanstack/vue-query';
import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import App from './app/index.vue';
import './index.css';

const app = createApp(App);

// Vue query
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
});

// Antd
app.use(Antd);

app.mount('#app');
