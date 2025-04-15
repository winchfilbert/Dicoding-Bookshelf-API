const booksController = require('../controller/books');

const routes = (req, res) => {
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
