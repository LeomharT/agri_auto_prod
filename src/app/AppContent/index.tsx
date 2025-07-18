import { useEffect, useRef } from 'react';
import Experience from '../../Experience/Experience';
import { EMIT_EVENTS } from '../../Experience/utils/EventEmitter';
import AppSider from '../AppSider';
import classes from './style.module.css';

export default function AppContent() {
	// Layout
	const layout = useRef<HTMLDivElement>(null);

	// WebGL container
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!layout.current) return;
		if (!ref.current) return;
	}, []);

	useEffect(() => {
		if (!layout.current) return;
		if (!ref.current) return;

		const experience = Experience.getInstance();
		experience.parent = ref.current;
		experience.sizes.updateSize();
		experience.sizes.trigger(EMIT_EVENTS.RESIZE);

		const observer = new ResizeObserver((entries) => {
			const rect = entries[0].contentRect;

			if (rect.width >= 1080) {
				ref.current!.style.width = rect.width - 580 + 'px';
			} else {
				ref.current!.style.width = rect.width + 'px';
			}
		});
		observer.observe(layout.current);

		ref.current.append(experience.canvas);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div ref={layout} className={classes.content}>
			<div ref={ref} className={classes.webgl}></div>
			<AppSider />
		</div>
	);
}
