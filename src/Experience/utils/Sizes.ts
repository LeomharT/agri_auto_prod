import Experience from '../Experience';
import EventEmitter, { EMIT_EVENTS } from './EventEmitter';

export default class Sizes extends EventEmitter {
	constructor(experiencd: Experience) {
		super();

		this._experience = experiencd;

		this.updateSize();

		// Resize event
		window.addEventListener('resize', () => {
			this.updateSize();
			this.trigger(EMIT_EVENTS.RESIZE);
		});
	}

	private _experience: Experience;

	public width: number = 0;

	public height: number = 0;

	public pixelRatio: number = 0;

	public updateSize() {
		const rect = {
			width: window.innerHeight,
			height: window.innerHeight,
		};

		if (this._experience.parent) {
			const _rect = this._experience.parent.getBoundingClientRect();
			rect.width = _rect.width;
			rect.height = _rect.height;
		}

		this.width = rect.width;
		this.height = rect.height;
		this.pixelRatio = Math.min(2, window.devicePixelRatio);
	}
}
