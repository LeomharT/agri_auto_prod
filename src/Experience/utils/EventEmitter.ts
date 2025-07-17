export const EMIT_EVENTS = {
	RESIZE: 'RESIZE',
	TICK: 'TICK',
	READY: 'READY',
} as const;

export type EmitEvent = keyof typeof EMIT_EVENTS;

export default class EventEmitter {
	private _callbacks = new Map<EmitEvent, ((...args: any) => void)[]>();

	public on(_name: EmitEvent, callback: (...args: any) => void) {
		// Resolve names
		const name = _name;

		// Errors
		if (!callback) {
			console.error('Wrong callback');
			return false;
		}

		const callbacks = this._callbacks.get(name) ?? [];

		this._callbacks.set(name, callbacks.concat(callback));

		return this;
	}

	off(_name: EmitEvent) {
		// Resolve names
		const name = _name;

		if (this._callbacks.has(name)) {
			this._callbacks.delete(name);
		}

		return this;
	}

	trigger(_name: EmitEvent, _args?: any) {
		let finalResult: unknown = null;
		let result: unknown = null;

		// Default args
		const args = !(_args instanceof Array) ? [] : _args;

		// Resolve names (should on have one event)
		const name = _name;

		const callbacks = this._callbacks.get(name);

		if (callbacks) {
			callbacks.forEach((callback) => {
				result = callback.apply(this, args);

				if (typeof finalResult === 'undefined') {
					finalResult = result;
				}
			});
		}

		return finalResult;
	}
}
