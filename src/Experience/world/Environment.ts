import {
	ClampToEdgeWrapping,
	DirectionalLight,
	EquirectangularReflectionMapping,
	SRGBColorSpace,
} from 'three';
import Experience from '../Experience';

export default class Environment {
	constructor(experience: Experience) {
		this._experience = experience;

		this.sunLight = this._setSunLight();
		this._setEnvironmentMap();
		this._setDebugPane();
	}

	private _experience: Experience;

	public sunLight: DirectionalLight;

	private _setSunLight() {
		const sunLight = new DirectionalLight('#ffffff', 4.0);
		sunLight.castShadow = true;
		sunLight.shadow.camera.far = 15;
		sunLight.shadow.mapSize.set(512, 512);
		sunLight.shadow.normalBias = 0.05;
		sunLight.shadow.radius = 5.0;
		sunLight.position.set(3.5, 2, -1.25);

		this._experience.scene.add(sunLight);

		return sunLight;
	}

	private _setEnvironmentMap() {
		const environmentMap = {
			texture: this._experience.resources.items.environmentMapTexture,
			intensity: 1.2,
			encoding: SRGBColorSpace,
		};
		environmentMap.texture.mapping = EquirectangularReflectionMapping;
		environmentMap.texture.wrapS = environmentMap.texture.wrapT =
			ClampToEdgeWrapping;

		this._experience.scene.environment = environmentMap.texture;
		this._experience.scene.environmentIntensity = environmentMap.intensity;
	}

	private _setDebugPane() {
		const pane = this._experience.debug.addFolder({ title: '🏞️ Environment' });
		pane.addBinding(this._experience.scene, 'environmentIntensity', {
			step: 0.01,
			max: 5.0,
			min: 1.0,
		});
	}
}
