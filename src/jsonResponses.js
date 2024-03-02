const formidable = require("formidable");

const users = {};
const images = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    console.log('params missing')
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204;
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const addImage = async (request, response, body) =>{

  console.log('in addImage');
  const form = formidable.formidable({});
  let fields;
  let files;

  console.log(body);
  try{
    console.log('in try');
    [fields,files] = await form.parse(body);
    console.log(`fields: ${fields}, files:${files}`);
  }catch (err){
    console.log(err);
    console.log('erroring out');
    responseCode = 500;
    return respondJSON(request,response,responseCode);
  }

  const responseJSON = {
    message:'Name and image file are both required',
  };

  if (!body.name || !body.imageInput){
    responseJSON.id='missingParams';
    return respondJSON(request,response,300,responseJSON);
  }
  if(!images[body.name]){
    responseCode=201;
    images[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].image = body.imageInput;

  if(responseCode ===201){
    responseJSON.message = 'Created Successfully';
    return respondJSON(request,response,responseCode,responseJSON);
  }

  return respondJSONMeta(request,response,responseCode);
}

module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
  addImage,
};
