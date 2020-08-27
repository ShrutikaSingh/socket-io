var express = require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const http = require('http');
const socketIO = reuire ('socket.io');
var app = express();
publicpath = path.join(__dirname, "/../public")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicpath));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let server=http.createServer(app);
let io=soc

var port = (process.env.PORT || '3000');
server.listen(port,()=>{
    console.log(`Server listening on ${port}`)
});

module.exports = app;
