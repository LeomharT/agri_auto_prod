import { Scene } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Camera from './Camera';
import Renderer from './Renderer';
import Debug from './utils/Debug';
import { EMIT_EVENTS } from './utils/EventEmitter';
import Resources from './utils/Resources';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import World from './world/World';

declare global {
	interface Window {
		experience: Experience;
	}
}

export default class Experience {
	private constructor() {
		/**
		 * Setup
		 */
		// Sizes
		this.sizes = new Sizes(this);
		this.sizes.on(EMIT_EVENTS.RESIZE, () => {
			this._resize();
		});

		// Time
		this.time = new Time();
		this.time.on(EMIT_EVENTS.TICK, () => {
			this._update();
		});

		// Debug
		this.debug = new Debug({ title: '🚧🚧🚧Debug Params🚧🚧🚧' });

		// Renderer
		this.renderer = new Renderer(this);

		// WebGL canvas
		this.canvas = this.renderer.instance.domElement;

		// Scene
		this.scene = new Scene();

		// Camera
		this.camera = new Camera(this);

		// Resources
		this.resources = new Resources();

		// World
		this.world = new World(this);

		// Stats
		this.stats = new Stats();

		window.experience = this;
	}
	public parent?: HTMLDivElement;

	public canvas: HTMLCanvasElement;

	public sizes: Sizes;

	public time: Time;

	public resources: Resources;

	public world: World;

	public debug: Debug;

	public renderer: Renderer;

	public scene: Scene;

	public camera: Camera;

	public stats: Stats;

	private _resize() {
		this.renderer.resize();
		this.camera.resize();
	}

	private _update() {
		// Redner
		this.renderer.update();

		// Update
		this.camera.update(this.time.elapsed);

		this.stats.update();
	}

	private static _singleInstance: Experience;

	public static getInstance(): Experience {
		if (this._singleInstance) return this._singleInstance;

		return (this._singleInstance = new Experience());
	}
}
