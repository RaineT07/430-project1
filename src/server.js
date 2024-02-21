const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/notReal': jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
    notFound: jsonHandler.notFound,
  },
  notFound: jsonHandler.notFoundMeta,
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
    console.log(bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // const acceptedTypes = request.headers.accept.split(',');

  const method = urlStruct[request.method];
  const handler = method[parsedUrl.pathname];

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }
  //
  if (urlStruct[request.method][parsedUrl.pathname]) {
    if (request.method === 'POST') { parseBody(request, response, handler); } else if (request.method === 'GET' || request.method === 'HEAD') { urlStruct[request.method][parsedUrl.pathname](request, response); } else { urlStruct.HEAD.notFound(request, response, parsedUrl); }
  }
  return null;
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
