require('dotenv').config();


const http = require('http');
const app = require('./app');
const WebSocketService = require("./services/realtime/realtime.service");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

WebSocketService.initialize(server);

server.listen(port,function(){
    console.log(`Node server running @ http://localhost:${port}`)
});
