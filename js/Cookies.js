import * as THREE from "three";

import { GLTFLoader } from "https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://unpkg.com/three@0.164.1/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";

import * as cactusData from "../cookies/cactus/data.js";

export default class Cookies {
  constructor() {
    this.cactusData = cactusData;

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("../static/draco/");

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.createScene();
    this.createLights();
    this.createCamera();
    this.createRenderer();
    this.createControls();

    // this.loadGLTF("../static/models/Cactus01.glb");

    this.createBase();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate.bind(this));

    this.cactus = {
      name: "Cactus",
    };

    this.cactus.top = cactusData.top[0];
    this.cactus.base = cactusData.base[0];
    this.cactus.leftArm = cactusData.leftArm[0];
    this.cactus.rightArm = cactusData.rightArm[0];
  }

  createLights() {
    let lights = [
      {
        name: "Front Light",
        type: "DirectionalLight",
        intensity: 1,
        color: 0xffffff,
        position: new THREE.Vector3(-0.5, 1, 1),
      },
      {
        name: "Back Light",
        type: "DirectionalLight",
        intensity: 1,
        color: 0xffffff,
        position: new THREE.Vector3(0.5, 1, -0.5),
      },
      {
        name: "Ambient Light",
        type: "AmbientLight",
        intensity: 0.5,
        color: 0xffffff,
      },
    ];

    let lightObject;
    lights.forEach((light) => {
      if (light.type === "DirectionalLight") {
        lightObject = new THREE.DirectionalLight(light.color, light.intensity);
        lightObject.position.copy(light.position);
      }

      if (light.type === "AmbientLight") {
        lightObject = new THREE.AmbientLight(light.color, light.intensity);
      }

      this.scene.add(lightObject);
    });
  }

  createCamera() {
    let cameraProperties = {
      name: "Camera",
      fov: 75,
      aspectRatio: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new THREE.Vector3(-1, 5, 5),
    };

    this.camera = new THREE.PerspectiveCamera(
      cameraProperties.fov,
      cameraProperties.aspectRatio,
      cameraProperties.near,
      cameraProperties.far
    );
    this.camera.name = cameraProperties.name;
    this.camera.position.copy(cameraProperties.position);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.controls.maxDistance = 1;
    this.controls.maxPolarAngle = Math.PI / 3;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  async loadGLTF(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, (gltf) => {
        this.model = gltf.scene;
        this.model.position.y = 0.1;
        this.model.scale.set(0.1, 0.1, 0.1);

        this.scene.add(this.model);

        resolve(gltf);
      });
    });
  }

  createBase() {
    let floorPlane = new THREE.PlaneGeometry(10, 10);
    let floor = new THREE.Mesh(floorPlane, new THREE.MeshBasicMaterial());
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  switchPart(part) {
    this.activePart = part;

    this.createOptionsDiv(part);
  }

  createOptionsDiv(part) {}

  switchOptions(option, activePart) {
    this.activeOption = option;
    this.activePart = activePart;

    this.selectedOption = this.cactusData[this.activePart].find(
      (o) => o.name === option
    );

    if (this.activePart) {
      this.cactusData[this.activePart].forEach((o) => {
        this.model.getObjectByName(o.meshName).visible = false;

        o.accessories?.forEach((a) => {
          this.model.getObjectByName(a.meshName).visible = false;
        });
      });

      this.model.getObjectByName(this.selectedOption.meshName).visible = true;
    }
  }

  switchAccessories(accessory) {
    this.selectedOption.accessories.forEach((acc) => {
      this.model.getObjectByName(acc.meshName).visible = false;
    });

    if (accessory !== "EMPTY")
      this.model.getObjectByName(accessory).visible = true;
  }
}
