import {
	CineonToneMapping,
	PCFSoftShadowMap,
	SRGBColorSpace,
	WebGLRenderer,
} from 'three';
import type Experience from './Experience';

export default class Renderer {
	constructor(experience: Experience) {
		this._experience = experience;

		this.instance = this._setInstance();
	}

	private _experience: Experience;

	public instance: WebGLRenderer;

	private _setInstance(): WebGLRenderer {
		const sizes = this._experience.sizes;

		const renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(sizes.pixelRatio);
		renderer.toneMapping = CineonToneMapping;
		renderer.toneMappingExposure = 1.2;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = PCFSoftShadowMap;
		renderer.outputColorSpace = SRGBColorSpace;

		return renderer;
	}

	public resize() {
		const { sizes } = this._experience;

		this.instance.setSize(sizes.width, sizes.height);
	}

	public update() {
		const { scene, camera } = this._experience;

		this.instance.render(scene, camera.instance);
	}
}
