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
    panLeft(distance: number, objectMatrix: THREE.Matrix4): void;
    panUp(distance: number, objectMatrix: THREE.Matrix4): void;
    pan(deltaX: number, deltaY: number): void;
    dollyIn(dollyScale: number): void;
    dollyOut(dollyScale: number): void;
    getAutoRotationAngle(): number;
    getZoomScale(): number;
    rotateLeft(angle: number): void;
    rotateUp(angle: number): void;
    getPolarAngle(): number;
    getAzimuthalAngle(): number;
    dispose(): void;
    reset(): void;
    saveState(): void;
    get center(): THREE.Vector3;
    get noZoom(): boolean;
    set noZoom(value: boolean);
    /**
     * TS typeguard. Checks whether the provided camera is PerspectiveCamera.
     * If the check passes (returns true) the passed camera will have the type THREE.PerspectiveCamera in the if branch where the check was performed.
     * @param camera Object to be checked.
     */
    private _checkPerspectiveCamera;
    /**
     * TS typeguard. Checks whether the provided camera is OrthographicCamera.
     * If the check passes (returns true) the passed camera will have the type THREE.OrthographicCamera in the if branch where the check was performed.
     * @param camera Object to be checked.
     */
    private _checkOrthographicCamera;
}
