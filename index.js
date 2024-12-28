var express = require ('express')
let ejs = require('ejs')
var app = express()
var mySqlDao = require('./mySqlDao');

app.set('view engine', 'ejs');

app.listen(3004, () => {
    console.log("Running on port 3000");
})

app.get("/", (req,res) => {
    mySqlDao.getStudents()
        .then((data) => {
            res.render(data)
        })
        .catch((error)=> {
            res.send(error)
        })
})