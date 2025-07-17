import EventEmitter, { EMIT_EVENTS } from './EventEmitter';

export default class Sizes extends EventEmitter {
	constructor() {
		super();

		// Setup
		this._updateSize();

		// Resize event
		window.addEventListener('resize', () => {
			this._updateSize();
			this.trigger(EMIT_EVENTS.RESIZE);
		});
	}

	public width: number = 0;

	public height: number = 0;

	public pixelRatio: number = 0;

	private _updateSize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.pixelRatio = Math.min(2, window.devicePixelRatio);
	}
}
