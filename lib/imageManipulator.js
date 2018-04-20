'use strict';

const jimp = require("jimp");
const path = require('path');
const fs = require('fs');

module.exports = {

  processAll(outputParams) {

    let testFolder = './images/src/';

    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {

        let filename = file.split('.')[0];
        let fileext = file.split('.')[1];

        if (!fs.existsSync(path.join(__dirname, '../images/out/', filename+'-banner.' + fileext)))
          this.process(file, outputParams);

      });
    })

  },

  process(image, outputParams) {

    let filename = image.split('.')[0];
    let fileext = image.split('.')[1];

    jimp.read(path.join(__dirname, '../images/src/', image)).then(function (image) {

      if ( (image.bitmap.width/image.bitmap.height) > outputParams.width/outputParams.height) {

        image.resize(outputParams.width, jimp.AUTO);

        let bgImage = image.clone();

        bgImage
          .resize(jimp.AUTO, outputParams.height)
          .crop(parseInt((bgImage.bitmap.width-outputParams.width)/2), 0, outputParams.width, outputParams.height)
          .blur(outputParams.blur)
          .blit(image, 0, parseInt((outputParams.height/2)-(image.bitmap.height/2)))
          .quality(outputParams.quality)
          .write(path.join(__dirname, '../images/out/', filename+'-banner.' + fileext));

        image.resize(300, jimp.AUTO)
          .quality(outputParams.quality)
          .write(path.join(__dirname, '../images/out/', filename+'-cover.' + fileext));

        console.log('Image', filename+'.'+fileext, 'processed successfully!');

      } else {

        image.resize(jimp.AUTO, outputParams.height);

        let bgImage = image.clone();

        bgImage
          .resize(outputParams.width, jimp.AUTO)
          .crop(0, parseInt((bgImage.bitmap.height-outputParams.height)/2), outputParams.width, outputParams.height)
          .blur(outputParams.blur)
          .blit(image, parseInt((outputParams.width/2)-(image.bitmap.width/2)), 0)
          .quality(outputParams.quality)
          .write(path.join(__dirname, '../images/out/', filename+'-banner.' + fileext));

        image.resize(300, jimp.AUTO)
          .quality(outputParams.quality)
          .write(path.join(__dirname, '../images/out/', filename+'-cover.' + fileext));

        console.log('Image', filename+'.'+fileext, 'processed successfully!');

      }


    }).catch(function (err) {
      console.error(err);
    });


  }

};