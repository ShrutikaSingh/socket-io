var express = require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const http = require('http');
const ROSLIB = require('roslib')


var app = express();
publicpath = path.join(__dirname, "/../public")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicpath));

app.use('/', indexRouter);


const socketIO = require ('socket.io');
let server=http.createServer(app);
const io= socketIO(server);

ros = new ROSLIB.Ros({
    url: 'wss://dev.flytbase.com/websocket',
});

io.on('connection',(socket)=> { //this socket is same that we created in index.html that is io()
    console.log("new connection made over socket", socket.id)

        //ros connetcion
    ros.on('connection', () => {
        console.log('Connected to websocket server.');
        socket.emit('ros_success', {success: true, status: 'connected'});
    });

        //authentication
    socket.on('authenticate', (req)=> {
        console.log('here',req)
        const authService = new ROSLIB.Service({
                ros: ros,
                name: '/websocket_auth',
            });
        const request = new ROSLIB.ServiceRequest({
                vehicleid: req.vehicleid,
                authorization: 'Token ' + req.token,
            });

            authService.callService(request, (result) => {
                if (result.success) {
                console.log('Success > ', result);
                }
            });
    })
})

var port = (process.env.PORT || '5000');
server.listen(port,()=>{
    console.log(`Server listening on ${port}`)
});

//console.log('io00000',io)
module.exports = app;
