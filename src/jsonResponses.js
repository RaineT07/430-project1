// const formidable = require('formidable');

const users = {};
const images = {};

// method to create a response in json format
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// creates a response with no data written except header data
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// gets a user as the response message.
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

// same as above but with no body
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

// if the url is called, but does not have a method
// this will call & inform the user they called an invalid url
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// this method is used when the image form call fails
const internalError = (request, response) => {
  const responseJSON = {
    message: 'This page encountered an internal server error',
    id: 'InternalError',
  };
  respondJSON(request, response, 500, responseJSON);
};

// see notFound method, but this one has no body message
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

// this method is from api assignment 1
const addUser = (request, response, body) => {
  // default response message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // if the body data is missing a parameter, respond with a json saying as such
  if (!body.name || !body.age) {
    console.log('params missing');
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // the response code by default is for an update
  // but is changed to a creation code if the name
  // is not previously in the users object
  let responseCode = 204;
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // if the code is for creation, change the message to reflect so
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// this method unfortunately does not work :(
const addImage = async (request, response, body) => {
  console.log('in addImage');
  // const form = formidable.formidable({});
  // let fields;
  // let files;

  console.log(body);

  // default that there is a field missing
  const responseJSON = {
    message: 'Name and image file are both required',
  };
  // let the code default to a 404
  let responseCode = 404;

  // if there's a missing parameter, reflect the code as such
  if (!body.name || !body.imageInput) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // just like addUser
  if (!images[body.name]) {
    responseCode = 201;
    images[body.name] = {};
  }

  // this code is prone to failure, so safeguard it w try/catch
  try {
    users[body.name].name = body.name;
    users[body.name].image = body.imageInput;
  } catch (err) {
    console.log(err);
    responseJSON.message = 'Something went wrong Server-side';
    return respondJSON(request, response, 500, responseJSON);
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  respondJSON,
  respondJSONMeta,
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
  addImage,
  internalError,
};
