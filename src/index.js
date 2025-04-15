const http = require('http');
const routes = require('./routes/routes');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  routes(req, res);
});

// memastikan bahwa server berjalan di port 9000
const PORT = 9000;

server.listen(PORT);
