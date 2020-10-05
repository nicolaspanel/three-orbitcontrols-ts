import 'mocha';
import * as THREE from 'three';
import {OrbitControls} from '../src';
import {expect} from 'chai';
import { JSDOM } from 'jsdom';

describe('orbit controls', () => {
  let controls: OrbitControls;
  let container: HTMLElement;
  let window: Window;
  beforeEach(() => {
    const camera = new THREE.PerspectiveCamera(50, 2, 1, 1000);
    const document = new JSDOM('<html><body><div id="container"></div></body></html>');
    window = document.window as any; // Need to use `as any` since DOMWindow can't be converted to Window.
    container = window.document.getElementById('container');
    controls = new OrbitControls(camera, container, window);
  });
  afterEach(() => {
    window.close();
  });

  it('should be ok', () => {
    expect(controls).to.be.an.instanceOf(OrbitControls)
  });
});
