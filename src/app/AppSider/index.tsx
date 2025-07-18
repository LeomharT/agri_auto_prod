import { useMediaQuery } from '@mantine/hooks';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import classes from './style.module.css';

export default function AppSider() {
	const matches = useMediaQuery('(max-width: 1080px)');

	const [collapse, setCollapse] = useState(false);

	useEffect(() => {
		if (matches) setCollapse(false);
	}, [matches]);

	return (
		<div
			className={classes.sider}
			style={{
				position: matches ? 'absolute' : 'relative',
				right: 0,
			}}
		>
			<Card variant='borderless'>1</Card>
			<Card variant='borderless'>2</Card>
		</div>
	);
}
