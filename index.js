// import required modules
var express = require ('express')
let ejs = require('ejs')
var app = express()
var mySqlDao = require('./mySqlDao');
var myMongoDBDao = require('./mongoDBDao');
var bodyParser = require('body-parser');
// configure body-parser to handle form submissions
app.use(bodyParser.urlencoded({extended: false}))
// set view engine to EJS for rendering pages
app.set('view engine', 'ejs');

// start the server on port 3004
app.listen(3004, () => {
    console.log("Running on port 3004");
})

// home page route
app.get("/", (req,res) => {
    res.render("homePage"); // render 'homePage.ejs' page
})

// students route
app.get("/students", (req,res) => {
    mySqlDao.getStudents() // get all students from the mysql database
        .then((data) => {
            res.render("student", {"students":data}) // pass student data to 'students.ejs' page & render it 
        })
        .catch((error)=> {
            res.send(error) // send error response if operation fails
        })
})

// route to render 'addStudent' form
app.get("/students/add", (req,res) => {
    res.render("addStudent"); // render 'addStudents.ejs' page
})

// route to handle submission of 'addStudent' form
app.post("/students/add", (req,res) => {
    // get new student info from request body
    let newStudent = {
        sid: req.body.sid,
        name: req.body.name, 
        age: parseInt(req.body.age, 10)
    }

    // add new student to database
    mySqlDao.addStudent(newStudent) 
        .then(() => {
            res.redirect("/students"); // redirect to students page on success
        })
        .catch((error) => {
            res.send(error); // send error response if operation fails
        });
})

// route to check if a student sid already exists
app.post("/students/checkSid", (req, res) => {
    // get sid from request body 
    const sid = req.body.sid;
    // use the mysql function to check if student with SID exists
    mySqlDao.getStudentBySID(sid)
        .then(() => {
            // if no error -> means SID is already taken
            res.send("taken"); // respond with "taken"
        })
        .catch((error) => {
            // if error -> means SID is not taken
            res.send("not taken"); // respond with "not taken"
        });
});

// route to render 'editStudent' form for specific student
app.get("/students/edit/:sid", (req,res) => {
    // get sid from request body
    let sid = req.params.sid;
    mySqlDao.getStudentBySID(sid) // get the student details by SID
        .then((student) => {
            res.render("editStudent", { student: student }); // pass student data to 'editStudent.ejs' page & render it
        })
        .catch((error) => {
            res.send(error); // send error response if operation fails
        });
})

// route to handle submission of 'editStudent' form
app.post("/students/edit/:sid", (req,res) => {
    // get sid and updated student details from request body
    let sid = req.params.sid;
    let updatedStudent = {
        name: req.body.name, 
        age: parseInt(req.body.age, 10)
    }

    mySqlDao.updateStudent(sid, updatedStudent)  // update student in the database
        .then(() => {
            res.redirect("/students");  // redirect to students page on success
        })
        .catch((error) => {
            res.send(error); // send error response if operation fails
        });
})

// route to display grades for all students
app.get('/grades', (req, res) => {
    mySqlDao.getGrades() // get grades from database
        .then((grades) => {
            res.render('grades', { grades }); // pass grades data to 'grades.ejs' page & render it
        })
        .catch((error) => {
            res.status(500).send('Error fetching grades: ' + error.message); // send error response with message if operation fails
        });
});

// route to display all lecturers
app.get('/lecturers', (req, res) => {
    myMongoDBDao.getLecturerDetails() // get lecturers from mongoDB database
        .then((lecturers) => {
            res.render('lecturers', { lecturers }); // pass lecturer data to 'lecturers.ejs' page & render it
        })
        .catch((error) => {
            res.status(500).send('Error fetching lecturers: ' + error.message); // send error response with message if operation fails
        });
});

// route to delete a lecturer by their ID
app.get('/lecturers/delete/:lid', (req, res) => {
    // get lecturer id from request body
    const lecturerId = req.params.lid;
    myMongoDBDao.deleteLecturerById(lecturerId) // delete the lecturer from mongoDB by lid
        .then(() => {
            res.redirect('/lecturers'); // if successfull deletion -> redirect to lecturers page
        })
        .catch(() => {
            res.redirect(`/lecturersError?lid=${lecturerId}`); // if unsuccessfull deletion -> redirect to error page & pass LID as param
        });
});

// route to display error page & pass lid dynamically
app.get('/lecturersError', (req, res) => {
    // get lid from request body
    const lecturerId = req.query.lid;
    res.render('lecturersError', { lid: lecturerId }); // pass lecturer id to 'lecturersError.ejs' page & render it
});

