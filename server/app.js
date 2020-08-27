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

const socketIO = require ('socket.io')({
    perMessageDeflate: false
  });
let server=http.createServer(app);
const io=socketIO(server);

io.on('connection',(socket)=>{ //this socket is same that we created in index.html that is io()
    console.log("new connection made over socket")
    socket.on('join',()=>{  //event emitted will be join

    })
})

var port = (process.env.PORT || '3000');
server.listen(port,()=>{
    console.log(`Server listening on ${port}`)
});

module.exports = app;
