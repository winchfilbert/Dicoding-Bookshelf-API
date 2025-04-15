const booksController = require('../controller/books');

const routes = (req, res) => {
  // req.query sections
  req.query = {};
  if (req.url.includes('?')) {
    const splitsfromurl = req.url.split('?');
    const path = splitsfromurl[0];
    const queryData = splitsfromurl[1];

    req.originalUrl = req.url;
    req.url = path;
    queryData.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      // the decodeURIComponent is to parse the space that is interpreted
      // as %20, example = Harry Potter, in browser it's Harry%20Potter
      req.query[key] = decodeURIComponent(value || '');
    });
  }

  if (req.url === '/books') {
    switch (req.method) {
      case 'GET': {
        booksController.viewAllBooks(req, res);
        break;
      }

      case 'POST': {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          req.body = JSON.parse(body);
          booksController.addBook(req, res);
        });
        break;
      }

      default: {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'fail',
          message: 'Method not allowed',
        }));
      }
    }

    // instead of using regex, we use the algorithm to parse the id
  } else if (req.url.startsWith('/books/')) {
    const id = req.url.split('/')[2]; // Get the ID from the URL

    // req params not built in, making manually
    req.params = {
      id,
    };

    if (req.method === 'GET') {
      booksController.viewBookDetail(req, res);
    } else if (req.method === 'PUT') {
      // Add body parsing for PUT method
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        // req.body in manual :(
        req.body = JSON.parse(body);
        booksController.updateBookDetail(req, res);
      });
    } else if (req.method === 'DELETE') {
      booksController.deleteBookDetail(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

module.exports = routes;
