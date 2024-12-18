
const SocketServer = require('ws').Server;

var express = require('express');

var app = express();

var router = express.Router();
var port = process.env.PORT || 8080;

var connectedUsers = [];

// GET /status
router.get('/status', function(req, res) {
    res.json({ status: 'App is running!' });
});

app.use("/", router);
app.use(express.static('public'));

var server = app.listen(port, function() {
    console.log('Server started on port ' + port);
});

const wss = new SocketServer({ server });

const clients = new Map();

wss.on('connection', function connection(ws) {

    const id = uuidv4();

    const metadata = {id};

    clients.set(ws, metadata);

    ws.on('message', function incoming(message) {
        const json_message = JSON.parse(message);

        console.log('received: %s', message);
        ws.send('I acknowledge your message');
    });

    ws.on('close', function close() {
        clients.delete(ws);
        console.log('disconnected');
    });

    ws.send('connected');
});

function uuidv4() {
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
}