'use strict';

const image = require('./lib/imageManipulator');

let output = {
  width: 1920,
  height: 1280,
  quality: 80,
  blur: 50
};

image.processAll(output);