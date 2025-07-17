import { useEffect, useRef } from 'react';
import { default as WebGLExperience } from '../../Experience/Experience';
import classes from './style.module.css';

const experience = WebGLExperience.getInstance();

export default function Experience() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.append(experience.canvas);
			ref.current.append(experience.stats.dom);
		}
	}, []);

	return <div ref={ref} className={classes.experience}></div>;
}
