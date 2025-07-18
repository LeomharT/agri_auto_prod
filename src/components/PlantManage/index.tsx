import { Card } from 'antd';
import classes from './style.module.css';

export default function PlaneManage() {
	return (
		<div className={classes.body}>
			<Card variant='borderless' title='种子仓库'>
				1
			</Card>
			<Card variant='borderless' title='植物管理'>
				1
			</Card>
		</div>
	);
}
