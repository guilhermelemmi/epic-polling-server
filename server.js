const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const db = router.db;

function randomlyUpdateQuote(path, id, next) {
  const quote = db.get(path).getById(id).value();
  if (quote && quote.status === 'in_progress' && Math.random() < 0.3) {
    db.get(path)
      .getById(id)
      .assign({
        status: 'quoted',
        amount: Math.floor(1000 + (Math.random() * 100))
      })
      .write()
      .then(() => {
        next();
      })
      .catch((error) => { console.log(error); });
  } else {
    next();
  }
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/car-quotes', function (req, res, next) {
  req.body.status = 'in_progress',
  req.body.amount = null;
  next();
});

server.get('/car-quotes/:id', function (req, res, next) {
  randomlyUpdateQuote('car-quotes', req.params.id, next);
});

server.get('/hotel-quotes/:id', function (req, res, next) {
  randomlyUpdateQuote('hotel-quotes', req.params.id, next);
});

server.get('/flight-quotes/:id', function (req, res, next) {
  randomlyUpdateQuote('flight-quotes', req.params.id, next);
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});