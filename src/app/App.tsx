import { App as AntApp, ConfigProvider } from 'antd';
import AppContent from './AppContent';
import AppHeader from './AppHeader';

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
				<AppHeader />
				<AppContent />
			</ConfigProvider>
		</AntApp>
	);
}
