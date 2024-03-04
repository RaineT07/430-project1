const http = require('http');
const url = require('url');
const query = require('querystring');
// const formidable = require('formidable');
// const { type } = require('os');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// urlstruct has all the endpoints necessary to run the API
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
    '/getRandomImage': mediaHandler.getRandomImage,
    '/getAllImages': mediaHandler.getAllImages,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/getRandomImage': mediaHandler.getMediaMeta,
    '/getAllImages': mediaHandler.getAllMediaMeta,
    notReal: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
    '/addImage': jsonHandler.addImage,
    notFound: jsonHandler.notFound,
    internalError: jsonHandler.internalError,
  },
  notFound: jsonHandler.notFoundMeta,
};

// parses body, self explanatory.
// takes in parameters request, response, and handler
// given by the onrequest function
const parseBody = async (request, response, handler) => {
  // body contains parsed chunks of request data
  const body = [];

  // formidable usage was unsuccessful :()

  // let fields;
  // let files;

  // const form = formidable.formidable({});

  // this code fails if the image form is used
  // so it's wrapped in a try-catch loop
  // which calls an internal error
  try {
    // parsing request data chunks, this one fires if there's an error
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    // parses a chunk of data into the body
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end, turn the body data into a string
    // then parse so the handler can use it
    // used for query params
    request.on('end', async () => {
      let bodyString = Buffer.concat(body).toString();
      bodyString = query.parse(bodyString);
      console.log(bodyString);
      // [fields, files] = await form.parse(bodyString);
      handler(request, response, bodyString);
    });
  // catches an error with the imageform data, returns internal error
  } catch (err) {
    console.log(err);
    urlStruct.POST.internalError(request, response);
  }
};

// process that detects requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  const acceptedTypes = request.headers.accept.split(',');
  // console.log(request.headers);
  console.log(acceptedTypes);

  // variables for easier readability with the urlStruct
  const method = urlStruct[request.method];
  const handler = method[parsedUrl.pathname];

  // if the method is not one implemented by me
  // call the notfound head method
  if (!method) {
    return urlStruct.HEAD.notFound(request, response);
  }

  // if the method and handler are used,
  // continue to process
  if (handler) {
    // if it's a post method, the body needs to be parsed
    if (request.method === 'POST') {
      parseBody(request, response, handler);
    } else if (request.method === 'GET' || request.method === 'HEAD') {
      console.log(handler);
      // another way to say handler(request,response)
      urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
      urlStruct.HEAD.notFound(request, response, parsedUrl);
    }
  }
  return null;
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
