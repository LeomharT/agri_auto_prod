import '@ant-design/v5-patch-for-react-19';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './index.css';

const root = createRoot(document.querySelector('#root') as HTMLDivElement);

root.render(<App />);
