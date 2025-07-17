import { Texture, TextureLoader } from 'three';
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js';
import sources from '../sources';
import EventEmitter, { EMIT_EVENTS } from './EventEmitter';

export type ResourcesLoaders = {
	gltfLoader: GLTFLoader;
	rgbeLoader: RGBELoader;
	textureLoader: TextureLoader;
};

export type ResourcesItems = {
	environmentMapTexture: Texture;
};

export default class Resources extends EventEmitter {
	constructor() {
		super();

		this._setLoaders();
		this._startLoading();
	}

	public loaders: ResourcesLoaders = {} as ResourcesLoaders;

	public items: ResourcesItems = {} as ResourcesItems;

	public toLoad: number = sources.length;

	public loaded: number = 0;

	private _setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader();
		this.loaders.gltfLoader.setPath('/models/');

		this.loaders.rgbeLoader = new RGBELoader();
		this.loaders.rgbeLoader.setPath('/textures/hdr/');

		this.loaders.textureLoader = new TextureLoader();
		this.loaders.textureLoader.setPath('/textures/');
	}

	private _startLoading() {
		for (const source of sources) {
			switch (source.type) {
				case 'texture': {
					this.loaders.textureLoader.load(source.path, (data) => {
						this._sourceLoaded(source, data);
					});
					break;
				}

				case 'rgbeTexture': {
					this.loaders.rgbeLoader.load(source.path, (data) => {
						this._sourceLoaded(source, data);
					});
					break;
				}

				case 'gltfModel': {
					this.loaders.gltfLoader.load(source.path, (data) => {
						this._sourceLoaded(source, data);
					});
					break;
				}

				default:
					break;
			}
		}
	}

	private _sourceLoaded(source: (typeof sources)[number], data: any) {
		this.items[source.name] = data;

		this.loaded++;

		if (this.loaded === this.toLoad) {
			this.trigger(EMIT_EVENTS.READY);
		}
	}
}
