import { Pane } from 'tweakpane';
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config';

export default class Debug extends Pane {
	WIDTH = '380px';

	constructor(props: PaneConfig) {
		super(props);

		const active = window.location.hash === '#debug';

		// Remove pane if is not debuging
		if (!active) this.element.parentElement!.remove();

		this.element.parentElement!.style.width = this.WIDTH;
	}
}
