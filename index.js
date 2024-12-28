var express = require ('express')
let ejs = require('ejs')
var app = express()
var mySqlDao = require('./mySqlDao');

app.set('view engine', 'ejs');