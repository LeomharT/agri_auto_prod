import { App as AntApp, ConfigProvider } from 'antd';
import { useReducer } from 'react';
import AppContent from './AppContent';
import AppHeader from './AppHeader';
import { AppContext, type Action, type AppContextState } from './context';

export default function App() {
	const [state, dispath] = useReducer(
		(state: AppContextState, action: Action) => {
			switch (action.type) {
				case 'collapse':
					state.collapse = action.payload;
					break;
				default:
					break;
			}

			return { ...state };
		},
		{
			collapse: false,
		}
	);

	return (
		<AppContext.Provider value={{ ...state, dispath }}>
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
		</AppContext.Provider>
	);
}
