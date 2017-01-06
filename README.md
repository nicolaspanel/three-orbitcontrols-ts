ThreeJS OrbitControls as a standalone and typescript compatible npm module.

# Installation
```shell
npm install --save three-orbitcontrols
```

# Usage
```js
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols';

const camera = new THREE.SomeCamera(...);
const controls = new OrbitControls(camera, renderer.domElement);

// How far you can orbit vertically, upper and lower limits.
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;


// How far you can dolly in and out ( PerspectiveCamera only )
controls.minDistance = 0;
controls.maxDistance = Infinity;

this.enableZoom = true; // Set to false to disable zooming
this.zoomSpeed = 1.0;


controls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)
```
