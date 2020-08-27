var express = require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
var server = http.createServer(app);
var port = (process.env.PORT || '3000');


public = path.join(__dirname, "/../public")

server.listen(port,()=>{
    console.log('here')
});

module.exports = app;
