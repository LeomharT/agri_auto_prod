import { useEffect, useRef } from 'react';
import { EMIT_EVENTS } from '../../Experience/utils/EventEmitter';
import { useApp } from '../../hooks/useApp';
import useExperience from '../../hooks/useExperience';
import AppSider from '../AppSider';
import classes from './style.module.css';

export default function AppContent() {
	// Layout
	const layout = useRef<HTMLDivElement>(null);

	// WebGL container
	const ref = useRef<HTMLDivElement>(null);

	const experience = useExperience();

	const { collapse } = useApp();

	useEffect(() => {
		if (!layout.current) return;
		if (!ref.current) return;
	}, [collapse]);

	useEffect(() => {
		if (!layout.current) return;
		if (!ref.current) return;

		experience.parent = ref.current;
		experience.sizes.updateSize();
		experience.sizes.trigger(EMIT_EVENTS.RESIZE);

		const observer = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;

			ref.current!.style.width = width + 'px';
			ref.current!.style.height = height + 'px';
		});

		ref.current.append(experience.canvas);

		return () => {
			observer.disconnect();
		};
	}, [collapse, experience]);

	return (
		<div
			ref={layout}
			className={classes.content}
			style={{
				paddingRight: collapse ? 0 : 580,
			}}
		>
			<div ref={ref} className={classes.webgl}></div>
			<AppSider />
		</div>
	);
}
