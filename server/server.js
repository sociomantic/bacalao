var config = require('../config.json');
var restify = require('restify');
var mongoose = require('mongoose');
var routes = require('./routes');
var logger = require('./utils/logger');
var checkSession = require('./utils/sessionValidator').checkSession;


restify.defaultResponseHeaders = function(data) {
  this.header('Content-Type', 'application/json; charset=utf-8');
};

// create server instance
var server = restify.createServer({
  name: config.name,
  log: logger
});

// log every request
server.pre(function (request, response, next) {
    request.log.info({ req: request }, 'REQUEST');
    next();
});


server.on('uncaughtException', function (request, response, route, error) {
  request.log.error(error);
  req.send(500);
});



server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.requestLogger());


// routes
server.post("/api/user", routes.createUser);
server.get("/api/events", routes.getEvents);

server.post("/api/event", checkSession, routes.createEvent);
server.put("/api/event/:eventId/attendees", checkSession, routes.joinEvent);
server.del("/api/event/:eventId/attendees", checkSession, routes.leaveEvent);
server.get(/\/.*/, restify.serveStatic({
  directory: '../public/',
  default: 'index.html'
}));


mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
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



mongoose.connect(config.dburi);
