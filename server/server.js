var config = require('../config.json');
var restify = require('restify');
var mongoose = require('mongoose');
var routes = require('./routes');
var logger = require('./utils/logger');
var checkSession = require('./utils/sessionValidator').checkSession;
var _ = require('underscore');

restify.defaultResponseHeaders = function(data) {
  this.header('Content-Type', 'application/json; charset=utf-8');
};

// create server instance
var server = restify.createServer({
  name: config.name,
  log: logger
});
var io = require('socket.io')(server.server);
// var io = socketio.listen(server.server);

// log every request
server.pre(function (request, response, next) {
    request.log.info({ req: request }, 'REQUEST');
    next();
});


server.on('uncaughtException', function (request, response, route, error) {
  request.log.error(error);
  // req.send(500);
});


// inject the global socket.io obect to all requests
server.use(function(req, res, next) {
  req.socketio = io;
  next();
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.requestLogger());


// routes
server.post("/api/user", routes.login);
server.get("/api/events", routes.getEvents);

server.post("/api/event", checkSession, routes.createEvent);
server.put("/api/event/:eventId/attendees", checkSession, routes.joinEvent);
server.del("/api/event/:eventId/attendees", checkSession, routes.leaveEvent);
server.get(/\/.*/, restify.serveStatic({
  directory: '../public/',
  default: 'index.html'
}));


mongoose.connection.on('error', console.error.bind(server.log, 'DB connection error:'));
mongoose.connection.once('open', function callback () {
    console.log("Connceted to db: ", mongoose.connection.host);
    if(!config.port) {
      console.log("no server port defined in the config");
    	process.exit(1);
    }
    server.listen(config.port, function () {
        console.log("Server started @ " + config.port);
    });
});


var connections = 0;
io.sockets.on('connection', function (socket) {
  connections++;
  // setInterval(function() {
  //   socket.emit('news', { hello: Date.now() });
  // }, 1000);
  server.log.info('new socket connection: ', socket.id );
  socket.on('disconnect', function () {
    connections--;
  });
});



mongoose.connect(config.dburi);
