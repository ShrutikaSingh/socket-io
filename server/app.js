var express = require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const http = require('http');
var app = express();
publicpath = path.join(__dirname, "/../public")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicpath));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const socketIO = require ('socket.io');
let server=http.createServer(app);
const io= socketIO(server);

io.on('connection',(socket)=>{ //this socket is same that we created in index.html that is io()
    console.log("new connection made over socket")

    //when someones joins
    socket.on('join',(data)=>{  //event emitted will be join
        socket.join(data.room);
        //console.log(data.user + " has join to room " + data.room);
        socket.broadcast.to(data.room).emit('newuserjoined', {user:  data.user, message: 'Has Joined the room' }) //informs every user in this room that a new user has joined
    })

    //when someone leaves the room
    socket.on('leave',(data)=>{  //event emitted will be join
        //here first broadcast then leave 
        //console.log(data.user + " Left the room " + data.room);
        socket.broadcast.to(data.room).emit('userleftroom', {user:  data.user, message: 'Has Left the room' }) //informs every user in this room that a new user has joined
        socket.leave(data.room);
    })


})

var port = (process.env.PORT || '3000');
server.listen(port,()=>{
    console.log(`Server listening on ${port}`)
});

module.exports = app;
