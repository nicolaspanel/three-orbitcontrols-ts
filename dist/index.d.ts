/// <reference types="three" />
import * as THREE from 'three';
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
export declare class OrbitControls extends THREE.EventDispatcher {
    object: THREE.Camera;
    domElement: HTMLElement | HTMLDocument;
    window: Window;
    enabled: boolean;
    target: THREE.Vector3;
    enableZoom: boolean;
    zoomSpeed: number;
    minDistance: number;
    maxDistance: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    keyPanSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    minZoom: number;
    maxZoom: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enableKeys: boolean;
    keys: {
        LEFT: number;
        UP: number;
        RIGHT: number;
        BOTTOM: number;
    };
    mouseButtons: {
        ORBIT: THREE.MOUSE;
        ZOOM: THREE.MOUSE;
        PAN: THREE.MOUSE;
    };
    enableDamping: boolean;
    dampingFactor: number;
    private spherical;
    private sphericalDelta;
    private scale;
    private target0;
    private position0;
    private zoom0;
    private state;
    private panOffset;
    private zoomChanged;
    private rotateStart;
    private rotateEnd;
    private rotateDelta;
    private panStart;
    private panEnd;
    private panDelta;
    private dollyStart;
    private dollyEnd;
    private dollyDelta;
    private updateLastPosition;
    private updateOffset;
    private updateQuat;
    private updateLastQuaternion;
    private updateQuatInverse;
    private panLeftV;
    private panUpV;
    private panInternalOffset;
    private onContextMenu;
    private onMouseUp;
    private onMouseDown;
    private onMouseMove;
    private onMouseWheel;
    private onTouchStart;
    private onTouchEnd;
    private onTouchMove;
    private onKeyDown;
    constructor(object: THREE.Camera, domElement?: HTMLElement, domWindow?: Window);
    update(): boolean;
    panLeft(distance: number, objectMatrix: any): void;
    panUp(distance: number, objectMatrix: any): void;
    pan(deltaX: number, deltaY: number): void;
    dollyIn(dollyScale: any): void;
    dollyOut(dollyScale: any): void;
    getAutoRotationAngle(): number;
    getZoomScale(): number;
    rotateLeft(angle: number): void;
    rotateUp(angle: number): void;
    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    dispose(): void;
    reset(): void;
    readonly center: THREE.Vector3;
    noZoom: boolean;
}
