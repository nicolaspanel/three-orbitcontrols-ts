ThreeJS OrbitControls as a standalone and typescript compatible npm module.

# Installation
```shell
npm install --save three-orbitcontrols-ts
```
## Installing latest version from git
If you require changes, that haven't yet made it to the npm repository you can add following dependency to your `package.json`:
```
"three-orbitcontrols-ts": "git+https://git@github.com/nicolaspanel/three-orbitcontrols-ts.git"
```
For more information see [npm docs](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies).
# Usage
```js
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

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

controls.enableDamping = true; // Set to false to disable damping (ie inertia)
controls.dampingFactor = 0.25;
```

# Credit
All credit goes to [OrbitControls.js](https://github.com/mrdoob/three.js/blob/master/examples/js/controls/OrbitControls.js) contributors.
