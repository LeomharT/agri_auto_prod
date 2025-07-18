import { useApp } from './useApp';

export default function useDispath() {
	const { dispath } = useApp();

	return dispath;
}
