var express = require ('express')
let ejs = require('ejs')
var app = express()
var mySqlDao = require('./mySqlDao');

app.set('view engine', 'ejs');

app.listen(3004, () => {
    console.log("Running on port 3000");
})

app.get("/", (req,res) => {
    res.render("homePage");
})

app.get("/students", (req,res) => {
    mySqlDao.getStudents()
        .then((data) => {
            res.render("student", {"students":data})
        })
        .catch((error)=> {
            res.send(error)
        })
})

app.get("/students/add", (req,res) => {
    res.render("addStudent");
})

app.get("/students/edit/:sid", (req,res) => {
    res.render("editStudent");
})