import { AxesHelper, BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import type Experience from '../Experience';
import { EMIT_EVENTS } from '../utils/EventEmitter';
import Environment from './Environment';
import Floor from './Floor';

export default class World {
	constructor(experience: Experience) {
		this._experience = experience;

		// Wait for resources
		this._experience.resources.on(EMIT_EVENTS.READY, () => {
			// Environment
			this.environment = new Environment(experience);

			// Axes helper
			const axesHelper = new AxesHelper(2);
			this._experience.scene.add(axesHelper);

			// Test
			const testGeometry = new BoxGeometry(1, 1, 1);
			const testMaterial = new MeshStandardMaterial({ color: '#00b96b' });
			const test = new Mesh(testGeometry, testMaterial);
			test.position.set(0, 0.5, 0);
			test.castShadow = true;

			this._experience.scene.add(test);

			// Floor
			this.floor = new Floor(experience);
		});
	}

	private _experience: Experience;

	public environment!: Environment;

	public floor!: Floor;
}
