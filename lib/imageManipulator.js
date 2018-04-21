'use strict';

const jimp = require("jimp");
const path = require('path');
const fs = require('fs');

module.exports = {

  processAll(outputParams) {

    return new Promise((resolve, reject) => {

      let testFolder = './images/src/';

      fs.readdir(testFolder, (err, files) => {

        if (err)
          reject(err);

        if (!files) {
          reject('folder not found');
        } else {

          files.forEach(file => {
            this.process(file, outputParams).then(() => {
              console.log('image successfully processed!');
            }, err => {
              console.log(err);
            });
          });

          resolve('all files processed successfully!');

        }



      })

    });

  },


  process(image, outputParams) {

    let self = this;

    return new Promise((resolve, reject) => {

      let fileName = image.split('.')[0];
      let fileExt = image.split('.')[1];

      if (!fs.existsSync(path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt))) {

        jimp.read(path.join(__dirname, '../images/src/', image)).then(image => {

          self.createBanner(image, outputParams).then(banner => {
            banner.write(path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt));
            resolve();
          });

        }).catch(function (err) {
          console.error(err);
          reject(err);
        });

      } else {
        reject('image already exists on output folder!')
      }

    });

  },


  createBanner(image, outputParams) {

    let bgImage = image.clone();

    return new Promise((resolve, reject) => {

      if ( (image.bitmap.width/image.bitmap.height) > outputParams.width/outputParams.height) {

        image.resize(outputParams.width, jimp.AUTO);

        bgImage
          .resize(jimp.AUTO, outputParams.height)
          .crop(parseInt((bgImage.bitmap.width-outputParams.width)/2), 0, outputParams.width, outputParams.height)
          .blur(outputParams.blur)
          .blit(image, 0, parseInt((outputParams.height/2)-(image.bitmap.height/2)))
          .quality(outputParams.quality);

      } else {

        image.resize(jimp.AUTO, outputParams.height);

        bgImage
          .resize(outputParams.width, jimp.AUTO)
          .crop(0, parseInt((bgImage.bitmap.height-outputParams.height)/2), outputParams.width, outputParams.height)
          .blur(outputParams.blur)
          .blit(image, parseInt((outputParams.width/2)-(image.bitmap.width/2)), 0)
          .quality(outputParams.quality);

      }

      // image.resize(jimp.AUTO, 300)
      //   .quality(outputParams.quality)
      //   .write(path.join(__dirname, '../images/out/', fileName+'-cover.' + fileExt));

      resolve(bgImage);

    });

  }


};