import { useMediaQuery } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import PlaneManage from '../../components/PlantManage';
import { useApp } from '../../hooks/useApp';
import classes from './style.module.css';

export default function AppSider() {
	const matches = useMediaQuery('(max-width: 1080px)');

	const { collapse, dispath, active } = useApp();

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
			{active}
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
			<PlaneManage />
		</div>
	);
}
