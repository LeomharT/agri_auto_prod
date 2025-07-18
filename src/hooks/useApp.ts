import { useContext } from 'react';
import { AppContext } from '../app/context';

export function useApp() {
	const value = useContext(AppContext);

	return value;
}
