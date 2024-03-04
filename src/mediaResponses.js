const fs = require('fs');
const path = require('path');
const jsonResp = require('./jsonResponses.js');

// helper function to load a file and convert it to base64 encoding
// so that the client can easily process the base64 back into an img element
const loadFile = (request, response, fileEnd, contentType) => {
  const file = path.resolve(__dirname, fileEnd);
  console.log(contentType);
  const image = fs.readFileSync(file);
  const imageBase64 = Buffer.from(image).toString('base64');

  return imageBase64;
};

// the next 3 methods load server-stored files
const getOne = (request, response) => loadFile(request, response, '../client/images/one.png', 'image/png');

const getTwo = (request, response) => loadFile(request, response, '../client/images/two.png', 'image/png');

const getThree = (request, response) => loadFile(request, response, '../client/images/three.png', 'image/png');

// the next 2 methods are for using the HEAD version of the 2 media calls
const getMediaMeta = (request, response) => jsonResp.respondJSONMeta(request, response, 200);

const getAllMediaMeta = (request, response) => jsonResp.respondJSONMeta(request, response, 200);

// gets a random image from the stored images in the server
const getRandomImage = (request, response) => {
  // random number 1-3 is selected
  const randomFile = Math.floor(Math.random() * (4 - 1) + 1);
  // initialize the encoded image
  let encodedImage;

  // get the file corresponding to the random image
  switch (randomFile) {
    case 1:
      encodedImage = getOne(request, response);
      break;
    case 2:
      encodedImage = getTwo(request, response);
      break;
    case 3:
      encodedImage = getThree(request, response);
      break;
    default:
      encodedImage = getOne(request, response);
      break;
  }

  // return a response with a successful call
  return jsonResp.respondJSON(request, response, 200, { data: encodedImage });
};

// gets all default images in the client files.
const getAllImages = (request, response) => {
  const EncodedImages = [];
  // this isn't the most efficient way to do this, however it is easy to understand.
  // if there were more default images, it'd be better to loop through
  // the directory and call loadfile with a parsed path string.
  EncodedImages.push(getOne(request, response));
  EncodedImages.push(getTwo(request, response));
  EncodedImages.push(getThree(request, response));
  return jsonResp.respondJSON(request, response, 200, { dataSet: EncodedImages });
};

module.exports = {
  getOne,
  getTwo,
  getThree,
  getRandomImage,
  getAllImages,
  getMediaMeta,
  getAllMediaMeta,
};
