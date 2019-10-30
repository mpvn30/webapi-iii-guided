const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');
const morgan = require('morgan')

const server = express();

// function dateLogger(req, res, next){
//   console.log(new Date().toISOString());
  
  
//   next();
// }

function logger(req, res, next){
  console.log(`[${new Date().toISOString}] ${req.method} to ${req.url}`)
}

function gateKeeper(req, res, next){
  //new way of reading data sent by the client
  const password = req.headers.password;
  if(password.toLowerCase() === 'mellon'){
    next();
  } else if(!password){
    res.status(400),json({error: "please provide password"})
  }
  else {
    res.status(401).json({you: 'cannot pass!!!'})
  }
}

// My guess for lecture question
// function requestURL(req, res, next) {
//   console.log(res.location(req.params.url))
// }

// change the gatekeeper to return a 400 if no password is provided and a message
// that says please provide a password
// if a password is provided and it is mellon, call next, otherwise return a 401

server.use(helmet()); // third party
server.use(express.json()); // built-in
server.use(logger) // custom middleware
server.use(morgan('dev'));
server.use(gateKeeper);
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
