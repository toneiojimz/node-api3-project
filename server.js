const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const usersRouter = require('./users/userRouter.js')

const server = express();

server.use(express.json());
// server.use(helmet());
// server.use(morgan('tiny'));
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
server.use('/api/users', usersRouter);

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl} at ${Date.now()}`);

  next();
}

module.exports = server;
