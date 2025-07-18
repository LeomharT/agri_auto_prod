import { useMemo } from 'react';
import Experience from '../Experience/Experience';

export default function useExperience() {
	const experience = useMemo(() => {
		return Experience.getInstance();
	}, []);

	return experience;
}
