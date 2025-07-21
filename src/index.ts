import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import App from './app/index.vue';
import './index.css';

const app = createApp(App);

app.use(Antd);

app.mount('#app');
