const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const serveFile = (request, response, contentType, content) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => { serveFile(request, response, 'text/html', index); };
const getCSS = (request, response) => { serveFile(request, response, 'text/css', css); };

module.exports = {
  getIndex,
  getCSS,
};
