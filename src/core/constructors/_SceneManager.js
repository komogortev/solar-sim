import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  OrthographicCamera,
  TextureLoader,
  WebGLCubeRenderTarget,
  SpotLight,
  HemisphereLight,
  PCFSoftShadowMap,
  sRGBEncoding
} from 'three';
import { FirstPersonCamera } from '../systems/_FpsCamera'
import { AppSettings } from '../../globals';

class SceneManager {
  constructor(canvas) {
    this.objects_ = [];
    this.initialize_();
  }

  initialize_() {
    this.initializeRenderer_();
    this.initializeLights_();
    this.initializeScene_();
    this.initializeCamera_();

    this.previousRAF_ = null;
    this.raf_();
    this.onWindowResize_();
  }

  initializeRenderer_() {
    this.renderer_ = new WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
    });
    this.renderer_.shadowMap.enabled = true;
    this.renderer_.shadowMap.type = PCFSoftShadowMap;
    this.renderer_.setPixelRatio(window.devicePixelRatio);
    this.renderer_.setSize(window.innerWidth, window.innerHeight);
    this.renderer_.physicallyCorrectLights = true;
    this.renderer_.outputEncoding = sRGBEncoding;

    window.addEventListener('resize', () => {
      this.onWindowResize_();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this.camera_ = new PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(0, 2, 0);

    this.scene_ = new Scene();

    this.uiCamera_ = new OrthographicCamera(
      -1, 1, 1 * aspect, -1 * aspect, 1, 1000);
    this.uiScene_ = new Scene();
  }

  initializeScene_() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(
      AppSettings.BG_MAP,
      () => {
        const rt = new WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(this.renderer_, texture);
        this.scene_.background = rt.texture;
      }
    )
  }

  initializeLights_() {
    const distance = 50.0;
    const angle = Math.PI / 4.0;
    const penumbra = 0.5;
    const decay = 1.0;

    let light = new SpotLight(
      0xFFFFFF, 100.0, distance, angle, penumbra, decay);
    light.castShadow = true;
    light.shadow.bias = -0.00001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;

    light.position.set(25, 25, 0);
    light.lookAt(0, 0, 0);
    this.scene_.add(light);

    const upColour = 0xFFFF80;
    const downColour = 0x808080;
    light = new HemisphereLight(upColour, downColour, 0.5);
    light.color.setHSL(0.6, 1, 0.6);
    light.groundColor.setHSL(0.095, 1, 0.75);
    light.position.set(0, 4, 0);
    this.scene_.add(light);
  }

  initializeCamera_() {
    // this.controls_ = new FirstPersonControls(
    //     this.camera_, this.renderer_.domElement);
    // this.controls_.lookSpeed = 0.8;
    // this.controls_.movementSpeed = 5;

    this.fpsCamera_ = new FirstPersonCamera(this.camera_, this.objects_);
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.renderer_.autoClear = true;
      this.renderer_.render(this.scene_, this.camera_);
      this.renderer_.autoClear = false;
      this.renderer_.render(this.uiScene_, this.uiCamera_);
      this.previousRAF_ = t;
      this.raf_();
    });
  }

  step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    // this.controls_.update(timeElapsedS);
    this.fpsCamera_.update(timeElapsedS);
  }

  onWindowResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();

    this.uiCamera_.left = -this.camera_.aspect;
    this.uiCamera_.right = this.camera_.aspect;
    this.uiCamera_.updateProjectionMatrix();

    this.renderer_.setSize(window.innerWidth, window.innerHeight);
  }
}

export { SceneManager }