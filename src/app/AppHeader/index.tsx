import {
	IconBriefcase,
	IconDatabase,
	IconRouter,
	IconTree,
} from '@tabler/icons-react';
import { Flex, Tabs } from 'antd';
import { useApp } from '../../hooks/useApp';
import classes from './style.module.css';

const menuItems = [
	{
		key: 'plant',
		label: (
			<Flex align='center' gap='6px'>
				<IconTree size='18px' />
				植物管理
			</Flex>
		),
	},
	{
		key: 'device',
		label: (
			<Flex align='center' gap='6px'>
				<IconRouter size='18px' />
				设备管理
			</Flex>
		),
	},
	{
		key: 'job',
		label: (
			<Flex align='center' gap='6px'>
				<IconBriefcase size='18px' />
				任务管理
			</Flex>
		),
	},
	{
		key: 'data',
		label: (
			<Flex align='center' gap='6px'>
				<IconDatabase size='18px' />
				数据管理
			</Flex>
		),
	},
];

export default function AppHeader() {
	const { active, dispath } = useApp();

	function handleOnChange(activeKey: string) {
		dispath({ type: 'active', payload: activeKey });
	}

	return (
		<header className={classes.header}>
			<img className={classes.logo} src='/NL-era@2x.png' />
			<Tabs
				className={classes.tabs}
				items={menuItems}
				accessKey={active}
				onChange={handleOnChange}
			/>
		</header>
	);
}
