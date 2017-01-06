"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = require("three");
var STATE = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_DOLLY: 4,
    TOUCH_PAN: 5
};
var CHANGE_EVENT = { type: 'change' };
var START_EVENT = { type: 'start' };
var END_EVENT = { type: 'end' };
var EPS = 0.000001;
/**
* @author qiao / https://github.com/qiao
* @author mrdoob / http://mrdoob.com
* @author alteredq / http://alteredqualia.com/
* @author WestLangley / http://github.com/WestLangley
* @author erich666 / http://erichaines.com
* @author nicolaspanel / http://github.com/nicolaspanel
*
* This set of controls performs orbiting, dollying (zooming), and panning.
* Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
*    Orbit - left mouse / touch: one finger move
*    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
*    Pan - right mouse, or arrow keys / touch: three finger swipe
*/
var OrbitControls = (function (_super) {
    __extends(OrbitControls, _super);
    function OrbitControls(object, domElement, domWindow) {
        var _this = _super.call(this) || this;
        _this.object = object;
        _this.domElement = (domElement !== undefined) ? domElement : document;
        _this.window = (domWindow !== undefined) ? domWindow : window;
        // Set to false to disable this control
        _this.enabled = true;
        // "target" sets the location of focus, where the object orbits around
        _this.target = new THREE.Vector3();
        // How far you can dolly in and out ( PerspectiveCamera only )
        _this.minDistance = 0;
        _this.maxDistance = Infinity;
        // How far you can zoom in and out ( OrthographicCamera only )
        _this.minZoom = 0;
        _this.maxZoom = Infinity;
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        _this.minPolarAngle = 0; // radians
        _this.maxPolarAngle = Math.PI; // radians
        // How far you can orbit horizontally, upper and lower limits.
        // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
        _this.minAzimuthAngle = -Infinity; // radians
        _this.maxAzimuthAngle = Infinity; // radians
        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        _this.enableDamping = false;
        _this.dampingFactor = 0.25;
        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        _this.enableZoom = true;
        _this.zoomSpeed = 1.0;
        // Set to false to disable rotating
        _this.enableRotate = true;
        _this.rotateSpeed = 1.0;
        // Set to false to disable panning
        _this.enablePan = true;
        _this.keyPanSpeed = 7.0; // pixels moved per arrow key push
        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        _this.autoRotate = false;
        _this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
        // Set to false to disable use of the keys
        _this.enableKeys = true;
        // The four arrow keys
        _this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
        // Mouse buttons
        _this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
        // for reset
        _this.target0 = _this.target.clone();
        _this.position0 = _this.object.position.clone();
        _this.zoom0 = _this.object.zoom;
        // for update speedup
        _this.updateOffset = new THREE.Vector3();
        // so camera.up is the orbit axis
        _this.updateQuat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
        _this.updateQuatInverse = _this.updateQuat.clone().inverse();
        _this.updateLastPosition = new THREE.Vector3();
        _this.updateLastQuaternion = new THREE.Quaternion();
        _this.state = STATE.NONE;
        _this.scale = 1;
        // current position in spherical coordinates
        _this.spherical = new THREE.Spherical();
        _this.sphericalDelta = new THREE.Spherical();
        _this.panOffset = new THREE.Vector3();
        _this.zoomChanged = false;
        _this.rotateStart = new THREE.Vector2();
        _this.rotateEnd = new THREE.Vector2();
        _this.rotateDelta = new THREE.Vector2();
        _this.panStart = new THREE.Vector2();
        _this.panEnd = new THREE.Vector2();
        _this.panDelta = new THREE.Vector2();
        _this.dollyStart = new THREE.Vector2();
        _this.dollyEnd = new THREE.Vector2();
        _this.dollyDelta = new THREE.Vector2();
        _this.panLeftV = new THREE.Vector3();
        _this.panUpV = new THREE.Vector3();
        _this.panInternalOffset = new THREE.Vector3();
        // event handlers - FSM: listen for events and reset state
        _this.onMouseDown = function (event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            if (event.button === _this.mouseButtons.ORBIT) {
                if (_this.enableRotate === false)
                    return;
                _this.rotateStart.set(event.clientX, event.clientY);
                _this.state = STATE.ROTATE;
            }
            else if (event.button === _this.mouseButtons.ZOOM) {
                if (_this.enableZoom === false)
                    return;
                _this.dollyStart.set(event.clientX, event.clientY);
                _this.state = STATE.DOLLY;
            }
            else if (event.button === _this.mouseButtons.PAN) {
                if (_this.enablePan === false)
                    return;
                _this.panStart.set(event.clientX, event.clientY);
                _this.state = STATE.PAN;
            }
            if (_this.state !== STATE.NONE) {
                document.addEventListener('mousemove', _this.onMouseMove, false);
                document.addEventListener('mouseup', _this.onMouseUp, false);
                _this.dispatchEvent(START_EVENT);
            }
        };
        _this.onMouseMove = function (event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            if (_this.state === STATE.ROTATE) {
                if (_this.enableRotate === false)
                    return;
                _this.rotateEnd.set(event.clientX, event.clientY);
                _this.rotateDelta.subVectors(_this.rotateEnd, _this.rotateStart);
                var element = _this.domElement === document ? _this.domElement.body : _this.domElement;
                // rotating across whole screen goes 360 degrees around
                _this.rotateLeft(2 * Math.PI * _this.rotateDelta.x / element.clientWidth * _this.rotateSpeed);
                // rotating up and down along whole screen attempts to go 360, but limited to 180
                _this.rotateUp(2 * Math.PI * _this.rotateDelta.y / element.clientHeight * _this.rotateSpeed);
                _this.rotateStart.copy(_this.rotateEnd);
                _this.update();
            }
            else if (_this.state === STATE.DOLLY) {
                if (_this.enableZoom === false)
                    return;
                _this.dollyEnd.set(event.clientX, event.clientY);
                _this.dollyDelta.subVectors(_this.dollyEnd, _this.dollyStart);
                if (_this.dollyDelta.y > 0) {
                    _this.dollyIn(_this.getZoomScale());
                }
                else if (_this.dollyDelta.y < 0) {
                    _this.dollyOut(_this.getZoomScale());
                }
                _this.dollyStart.copy(_this.dollyEnd);
                _this.update();
            }
            else if (_this.state === STATE.PAN) {
                if (_this.enablePan === false)
                    return;
                _this.panEnd.set(event.clientX, event.clientY);
                _this.panDelta.subVectors(_this.panEnd, _this.panStart);
                _this.pan(_this.panDelta.x, _this.panDelta.y);
                _this.panStart.copy(_this.panEnd);
                _this.update();
            }
        };
        _this.onMouseUp = function (event) {
            if (_this.enabled === false)
                return;
            document.removeEventListener('mousemove', _this.onMouseMove, false);
            document.removeEventListener('mouseup', _this.onMouseUp, false);
            _this.dispatchEvent(END_EVENT);
            _this.state = STATE.NONE;
        };
        _this.onMouseWheel = function (event) {
            if (_this.enabled === false || _this.enableZoom === false || (_this.state !== STATE.NONE && _this.state !== STATE.ROTATE))
                return;
            event.preventDefault();
            event.stopPropagation();
            if (event.deltaY < 0) {
                _this.dollyOut(_this.getZoomScale());
            }
            else if (event.deltaY > 0) {
                _this.dollyIn(_this.getZoomScale());
            }
            _this.update();
            _this.dispatchEvent(START_EVENT); // not sure why these are here...
            _this.dispatchEvent(END_EVENT);
        };
        _this.onKeyDown = function (event) {
            if (_this.enabled === false || _this.enableKeys === false || _this.enablePan === false)
                return;
            switch (event.keyCode) {
                case _this.keys.UP:
                    {
                        _this.pan(0, _this.keyPanSpeed);
                        _this.update();
                    }
                    break;
                case _this.keys.BOTTOM:
                    {
                        _this.pan(0, -_this.keyPanSpeed);
                        _this.update();
                    }
                    break;
                case _this.keys.LEFT:
                    {
                        _this.pan(_this.keyPanSpeed, 0);
                        _this.update();
                    }
                    break;
                case _this.keys.RIGHT:
                    {
                        _this.pan(-_this.keyPanSpeed, 0);
                        _this.update();
                    }
                    break;
            }
        };
        _this.onTouchStart = function (event) {
            if (_this.enabled === false)
                return;
            switch (event.touches.length) {
                // one-fingered touch: rotate
                case 1:
                    {
                        if (_this.enableRotate === false)
                            return;
                        _this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                        _this.state = STATE.TOUCH_ROTATE;
                    }
                    break;
                // two-fingered touch: dolly
                case 2:
                    {
                        if (_this.enableZoom === false)
                            return;
                        var dx = event.touches[0].pageX - event.touches[1].pageX;
                        var dy = event.touches[0].pageY - event.touches[1].pageY;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        _this.dollyStart.set(0, distance);
                        _this.state = STATE.TOUCH_DOLLY;
                    }
                    break;
                // three-fingered touch: pan
                case 3:
                    {
                        if (_this.enablePan === false)
                            return;
                        _this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                        _this.state = STATE.TOUCH_PAN;
                    }
                    break;
                default: {
                    _this.state = STATE.NONE;
                }
            }
            if (_this.state !== STATE.NONE) {
                _this.dispatchEvent(START_EVENT);
            }
        };
        _this.onTouchMove = function (event) {
            if (_this.enabled === false)
                return;
            event.preventDefault();
            event.stopPropagation();
            switch (event.touches.length) {
                // one-fingered touch: rotate
                case 1:
                    {
                        if (_this.enableRotate === false)
                            return;
                        if (_this.state !== STATE.TOUCH_ROTATE)
                            return; // is this needed?...
                        _this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                        _this.rotateDelta.subVectors(_this.rotateEnd, _this.rotateStart);
                        var element = _this.domElement === document ? _this.domElement.body : _this.domElement;
                        // rotating across whole screen goes 360 degrees around
                        _this.rotateLeft(2 * Math.PI * _this.rotateDelta.x / element.clientWidth * _this.rotateSpeed);
                        // rotating up and down along whole screen attempts to go 360, but limited to 180
                        _this.rotateUp(2 * Math.PI * _this.rotateDelta.y / element.clientHeight * _this.rotateSpeed);
                        _this.rotateStart.copy(_this.rotateEnd);
                        _this.update();
                    }
                    break;
                // two-fingered touch: dolly
                case 2:
                    {
                        if (_this.enableZoom === false)
                            return;
                        if (_this.state !== STATE.TOUCH_DOLLY)
                            return; // is this needed?...
                        //console.log( 'handleTouchMoveDolly' );
                        var dx = event.touches[0].pageX - event.touches[1].pageX;
                        var dy = event.touches[0].pageY - event.touches[1].pageY;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        _this.dollyEnd.set(0, distance);
                        _this.dollyDelta.subVectors(_this.dollyEnd, _this.dollyStart);
                        if (_this.dollyDelta.y > 0) {
                            _this.dollyOut(_this.getZoomScale());
                        }
                        else if (_this.dollyDelta.y < 0) {
                            _this.dollyIn(_this.getZoomScale());
                        }
                        _this.dollyStart.copy(_this.dollyEnd);
                        _this.update();
                    }
                    break;
                // three-fingered touch: pan
                case 3:
                    {
                        if (_this.enablePan === false)
                            return;
                        if (_this.state !== STATE.TOUCH_PAN)
                            return; // is this needed?...
                        _this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                        _this.panDelta.subVectors(_this.panEnd, _this.panStart);
                        _this.pan(_this.panDelta.x, _this.panDelta.y);
                        _this.panStart.copy(_this.panEnd);
                        _this.update();
                    }
                    break;
                default: {
                    _this.state = STATE.NONE;
                }
            }
        };
        _this.onTouchEnd = function (event) {
            if (_this.enabled === false)
                return;
            _this.dispatchEvent(END_EVENT);
            _this.state = STATE.NONE;
        };
        _this.onContextMenu = function (event) {
            event.preventDefault();
        };
        _this.domElement.addEventListener('contextmenu', _this.onContextMenu, false);
        _this.domElement.addEventListener('mousedown', _this.onMouseDown, false);
        _this.domElement.addEventListener('wheel', _this.onMouseWheel, false);
        _this.domElement.addEventListener('touchstart', _this.onTouchStart, false);
        _this.domElement.addEventListener('touchend', _this.onTouchEnd, false);
        _this.domElement.addEventListener('touchmove', _this.onTouchMove, false);
        _this.window.addEventListener('keydown', _this.onKeyDown, false);
        // force an update at start
        _this.update();
        return _this;
    }
    OrbitControls.prototype.update = function () {
        var position = this.object.position;
        this.updateOffset.copy(position).sub(this.target);
        // rotate offset to "y-axis-is-up" space
        this.updateOffset.applyQuaternion(this.updateQuat);
        // angle from z-axis around y-axis
        this.spherical.setFromVector3(this.updateOffset);
        if (this.autoRotate && this.state === STATE.NONE) {
            this.rotateLeft(this.getAutoRotationAngle());
        }
        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;
        // restrict theta to be between desired limits
        this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
        // restrict phi to be between desired limits
        this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
        this.spherical.makeSafe();
        this.spherical.radius *= this.scale;
        // restrict radius to be between desired limits
        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
        // move target to panned location
        this.target.add(this.panOffset);
        this.updateOffset.setFromSpherical(this.spherical);
        // rotate offset back to "camera-up-vector-is-up" space
        this.updateOffset.applyQuaternion(this.updateQuatInverse);
        position.copy(this.target).add(this.updateOffset);
        this.object.lookAt(this.target);
        if (this.enableDamping === true) {
            this.sphericalDelta.theta *= (1 - this.dampingFactor);
            this.sphericalDelta.phi *= (1 - this.dampingFactor);
        }
        else {
            this.sphericalDelta.set(0, 0, 0);
        }
        this.scale = 1;
        this.panOffset.set(0, 0, 0);
        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8
        if (this.zoomChanged ||
            this.updateLastPosition.distanceToSquared(this.object.position) > EPS ||
            8 * (1 - this.updateLastQuaternion.dot(this.object.quaternion)) > EPS) {
            this.dispatchEvent(CHANGE_EVENT);
            this.updateLastPosition.copy(this.object.position);
            this.updateLastQuaternion.copy(this.object.quaternion);
            this.zoomChanged = false;
            return true;
        }
        return false;
    };
    OrbitControls.prototype.panLeft = function (distance, objectMatrix) {
        this.panLeftV.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        this.panLeftV.multiplyScalar(-distance);
        this.panOffset.add(this.panLeftV);
    };
    OrbitControls.prototype.panUp = function (distance, objectMatrix) {
        this.panUpV.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
        this.panUpV.multiplyScalar(distance);
        this.panOffset.add(this.panUpV);
    };
    // deltaX and deltaY are in pixels; right and down are positive
    OrbitControls.prototype.pan = function (deltaX, deltaY) {
        var element = this.domElement === document ? this.domElement.body : this.domElement;
        if (this.object instanceof THREE.PerspectiveCamera) {
            // perspective
            var position = this.object.position;
            this.panInternalOffset.copy(position).sub(this.target);
            var targetDistance = this.panInternalOffset.length();
            // half of the fov is center to top of screen
            targetDistance *= Math.tan((this.object.fov / 2) * Math.PI / 180.0);
            // we actually don't use screenWidth, since perspective camera is fixed to screen height
            this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this.object.matrix);
            this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix);
        }
        else if (this.object instanceof THREE.OrthographicCamera) {
            // orthographic
            this.panLeft(deltaX * (this.object.right - this.object.left) / this.object.zoom / element.clientWidth, this.object.matrix);
            this.panUp(deltaY * (this.object.top - this.object.bottom) / this.object.zoom / element.clientHeight, this.object.matrix);
        }
        else {
            // camera neither orthographic nor perspective
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
            this.enablePan = false;
        }
    };
    OrbitControls.prototype.dollyIn = function (dollyScale) {
        if (this.object instanceof THREE.PerspectiveCamera) {
            this.scale /= dollyScale;
        }
        else if (this.object instanceof THREE.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        }
        else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.enableZoom = false;
        }
    };
    OrbitControls.prototype.dollyOut = function (dollyScale) {
        if (this.object instanceof THREE.PerspectiveCamera) {
            this.scale *= dollyScale;
        }
        else if (this.object instanceof THREE.OrthographicCamera) {
            this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        }
        else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.enableZoom = false;
        }
    };
    OrbitControls.prototype.getAutoRotationAngle = function () {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    };
    OrbitControls.prototype.getZoomScale = function () {
        return Math.pow(0.95, this.zoomSpeed);
    };
    OrbitControls.prototype.rotateLeft = function (angle) {
        this.sphericalDelta.theta -= angle;
    };
    OrbitControls.prototype.rotateUp = function (angle) {
        this.sphericalDelta.phi -= angle;
    };
    OrbitControls.prototype.getPolarAngle = function () {
        return this.spherical.phi;
    };
    OrbitControls.prototype.getAzimuthalAngle = function () {
        return this.spherical.theta;
    };
    OrbitControls.prototype.dispose = function () {
        this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
        this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.domElement.removeEventListener('wheel', this.onMouseWheel, false);
        this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.domElement.removeEventListener('touchmove', this.onTouchMove, false);
        document.removeEventListener('mousemove', this.onMouseMove, false);
        document.removeEventListener('mouseup', this.onMouseUp, false);
        this.window.removeEventListener('keydown', this.onKeyDown, false);
        //this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    };
    OrbitControls.prototype.reset = function () {
        this.target.copy(this.target0);
        this.object.position.copy(this.position0);
        this.object.zoom = this.zoom0;
        this.object.updateProjectionMatrix();
        this.dispatchEvent(CHANGE_EVENT);
        this.update();
        this.state = STATE.NONE;
    };
    Object.defineProperty(OrbitControls.prototype, "center", {
        // backward compatibility
        get: function () {
            console.warn('THREE.OrbitControls: .center has been renamed to .target');
            return this.target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrbitControls.prototype, "noZoom", {
        get: function () {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            return !this.enableZoom;
        },
        set: function (value) {
            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            this.enableZoom = !value;
        },
        enumerable: true,
        configurable: true
    });
    return OrbitControls;
}(THREE.EventDispatcher));
exports.OrbitControls = OrbitControls;
