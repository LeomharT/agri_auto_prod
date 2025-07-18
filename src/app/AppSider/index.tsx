import { useMediaQuery } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import classes from './style.module.css';

export default function AppSider() {
	const matches = useMediaQuery('(max-width: 1080px)');

	const { collapse, dispath } = useApp();

	useEffect(() => {
		if (matches) dispath({ type: 'collapse', payload: true });
	}, [matches, dispath]);

	return (
		<div
			className={classes.sider}
			style={{
				right: collapse ? -580 : 0,
			}}
		>
			<div
				className={classes.button}
				onClick={() => dispath({ type: 'collapse', payload: !collapse })}
			>
				{collapse ? (
					<IconChevronLeft size={16} />
				) : (
					<IconChevronRight size={16} />
				)}
			</div>
			<div className={classes.body}>
				<Card variant='borderless'>1</Card>
				<Card variant='borderless'>2</Card>
			</div>
		</div>
	);
}
