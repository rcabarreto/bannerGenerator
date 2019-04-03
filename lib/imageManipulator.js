'use strict';

const jimp = require("jimp");
const path = require('path');
const fs = require('fs');

module.exports = {

  findImages(options) {
    return new Promise((resolve, reject) => {
      fs.readdir(path.join(__dirname, '../', options.folder), (err, files) => {

        if (err)
          reject(err);

        if (!files) {
          reject('folder not found');
        } else {
          resolve(files);
        }

      })
    });
  },

  process(image, options) {

    let self = this;
    let fileName = image.split('.')[0];
    let fileExt = image.split('.')[1];

    return jimp
      .read(path.join(__dirname, '../images/src/', image))
      .then(image => self.createBanner(image, options))
      .then(banner => self.setQuality(banner, options))
      .then(banner => self.saveImage(banner, options, fileName, fileExt))
      .catch(err => {
        Promise.reject(err);
      });

  },

  createBanner(image, options) {

    let bgImage = image.clone();

    if ( (image.bitmap.width/image.bitmap.height) > parseInt(options.width)/options.height) {

      image.resize(options.width, jimp.AUTO);

      bgImage
        .resize(jimp.AUTO, options.height)
        .crop(parseInt((bgImage.bitmap.width-options.width)/2), 0, options.width, options.height)
        .blur(options.blur)
        .blit(image, 0, parseInt((options.height/2)-(image.bitmap.height/2)));

    } else {

      image.resize(jimp.AUTO, options.height);

      bgImage
        .resize(options.width, jimp.AUTO)
        .crop(0, parseInt((bgImage.bitmap.height-options.height)/2), options.width, options.height)
        .blur(options.blur)
        .blit(image, parseInt((options.width/2)-(image.bitmap.width/2)), 0);

    }

    return bgImage;
  },

  setQuality(image, options) {
    return image.quality(options.quality);
  },

  saveImage(image, options, fileName, fileExt) {
    image.write(path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt));
    return path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt);
  },

};