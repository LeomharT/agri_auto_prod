import { Mesh, PlaneGeometry, ShadowMaterial } from 'three';
import type Experience from '../Experience';

export default class Floor extends Mesh {
	constructor(experience: Experience) {
		super();

		// Setup
		this.geometry = this._setGeometry();
		this.material = this._setMaterial();

		this.receiveShadow = true;
		this.rotation.x = -Math.PI / 2;

		experience.scene.add(this);
	}

	private _setGeometry() {
		return new PlaneGeometry(10, 10, 16, 16);
	}

	private _setMaterial() {
		const material = new ShadowMaterial({
			transparent: true,
		});
		material.opacity = 0.032;
		return material;
	}
}
