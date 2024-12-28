var express = require ('express')
let ejs = require('ejs')
var app = express()
var mySqlDao = require('./mySqlDao');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');

app.listen(3004, () => {
    console.log("Running on port 3004");
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

app.post("/students/add", (req,res) => {
    let newStudent = {
        sid: req.body.sid,
        name: req.body.name, 
        age: parseInt(req.body.age, 10)
    }
    
    console.log("New Student: ", newStudent);

    mySqlDao.addStudent(newStudent)
        .then(() => {
            res.redirect("/students");
        })
        .catch((error) => {
            res.send(error);
        });
})

app.post("/students/checkSid", (req, res) => {
        const sid = req.body.sid;

    // Use the DAO function to check if the student with the given SID exists
    mySqlDao.getStudentBySID(sid)
        .then(() => {
            // If no error occurs, it means the SID is already taken
            res.send("taken"); // Respond with "taken"
        })
        .catch((error) => {
            // If error occurs, it means the SID is not taken
            res.send("not taken"); // Respond with "not taken"
        });
});

app.get("/students/edit/:sid", (req,res) => {
    let sid = req.params.sid;
    mySqlDao.getStudentBySID(sid)
        .then((student) => {
            res.render("editStudent", { student: student });
             console.log("Student: ", student)
        })
        .catch((error) => {
            res.send(error);
        });
})

app.post("/students/edit/:sid", (req,res) => {
    let sid = req.params.sid;
    let updatedStudent = {
        name: req.body.name, 
        age: parseInt(req.body.age, 10)
    }
    
    console.log("Updated Student: ", updatedStudent);

    mySqlDao.updateStudent(sid, updatedStudent)
        .then(() => {
            res.redirect("/students");
        })
        .catch((error) => {
            res.send(error);
        });
})
