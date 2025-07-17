import { PerspectiveCamera } from 'three';
import { OrbitControls, TrackballControls } from 'three/examples/jsm/Addons.js';
import type Experience from './Experience';

export default class Camera {
	constructor(experience: Experience) {
		this._experience = experience;

		// Set instance
		this.instance = this._setCamera();

		// Set controls
		this._controls = this._setControls();
		this._controls2 = this._setControls2();
	}

	private _experience: Experience;

	public instance: PerspectiveCamera;

	private _controls: OrbitControls;

	private _controls2: TrackballControls;

	private _setCamera() {
		const sizes = this._experience.sizes;
		const scene = this._experience.scene;

		const camera = new PerspectiveCamera(
			35,
			sizes.width / sizes.height,
			0.1,
			500
		);
		camera.position.set(4, 6, 5);
		camera.lookAt(scene.position);

		scene.add(camera);

		return camera;
	}

	private _setControls(): OrbitControls {
		const controls = new OrbitControls(this.instance, this._experience.canvas);
		controls.enableDamping = true;
		controls.enablePan = false;
		controls.enableZoom = false;

		return controls;
	}

	private _setControls2(): TrackballControls {
		const controls = new TrackballControls(
			this.instance,
			this._experience.canvas
		);
		controls.noPan = true;
		controls.noRotate = true;
		controls.noZoom = false;
		controls.zoomSpeed = 1.5;

		return controls;
	}

	public resize() {
		const { sizes } = this._experience;

		this.instance.aspect = sizes.width / sizes.height;
		this.instance.updateProjectionMatrix();
	}

	public update(time: number) {
		const target = this._controls.target;
		this._controls.update(time);

		this._controls2.target.copy(target);
		this._controls2.update();
	}
}
