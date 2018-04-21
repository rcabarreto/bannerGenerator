'use strict';

const image = require('./lib/imageManipulator');

let output = {
  width: 1920,
  height: 1280,
  quality: 80,
  blur: 50
};

image.processAll(output).then(result => {
  console.log(result);
}, err => {

  if (err.code === 'ENOENT')
    console.log('ERROR:', err.errno, 'no such file or directory (', err.path,')')

});