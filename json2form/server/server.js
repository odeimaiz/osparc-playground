// node server.js

const express = require('express');

const app = express();
const http = require('http');
const config = require('./config');

/*
// middleware that is specific to this router
app.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now(), req.url)
  next()
});
*/

console.log(`received basepath: ${config.BASEPATH}`);
// Serve static assets normally
console.log('Serving static : ' + config.APP_PATH);
app.use(`${config.BASEPATH}`, express.static(config.APP_PATH));

const server = http.Server(app);

const bodyParser = require('body-parser');
app.use(bodyParser.json({
  limit: "5MB"
}))
app.use(bodyParser.urlencoded({
  limit: "5MB"
}))

// start server
server.listen(config.PORT, config.HOSTNAME);
console.log('server started on ' + config.HOSTNAME + ':' + config.PORT);
