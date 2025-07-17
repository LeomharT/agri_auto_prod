import { App as AntApp, ConfigProvider } from 'antd';
import Experience from '../components/Experience';

export default function App() {
	return (
		<AntApp>
			<ConfigProvider
				theme={{
					cssVar: true,
					token: {
						colorPrimary: '#00b96b',
					},
				}}
			>
				<Experience />
			</ConfigProvider>
		</AntApp>
	);
}
