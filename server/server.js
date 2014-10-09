var config = require('../config.json'),
    restify = require('restify'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectID;


restify.defaultResponseHeaders = function(data) {
  this.header('Content-Type', 'application/json; charset=utf-8');
};

var server = restify.createServer();


server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());



server.get("/api/events", routes.getEvents);
server.post("/api/event", routes.createEvent);

server.get(/\/.*/, restify.serveStatic({
  directory: '../dist/',
  default: 'index.html'
}));


mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
    console.log("Connceted to db: ", mongoose.connection.host);
    server.listen(config.port, function () {
        console.log("Server started @ " + config.port);
    });
});



mongoose.connect(config.dburi);
