import * as mocha from 'mocha';
import * as THREE from 'three';
import {OrbitControls} from '../src';
import {expect} from 'chai';
import * as jsdom from 'jsdom';

describe('orbit controls', () => {
  let controls: OrbitControls;
  let container: HTMLElement;
  let window: Window;
  beforeEach((done) => {
    const camera = new THREE.PerspectiveCamera(50, 2, 1, 1000);
    const document = jsdom.env('<html><body><div id="container"></div></body></html>', (err, _window_) => {
      if (err) return done(err);
      window = _window_;
      container = window.document.getElementById( 'container' );
      controls = new OrbitControls(camera, container, window);
      done();
    });
  });
  afterEach(() => {
    window.close();
  });

  it('should be ok', () => {
    expect(controls).to.be.an.instanceOf(OrbitControls)
  });
});
