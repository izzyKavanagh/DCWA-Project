// require the promise-mysql library to manage mysql connections with promises
var pmysql = require('promise-mysql')

// create connection pool with database credentials
var pool 
pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
})
.then((p) => {
    pool = p // assign created pool to variable
})
.catch((e) => {
    console.log("pool error:" + e) // log errors
})

// function to retrieve all students from 'student' table
var getStudents = function()
{
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student') // query the database for all rows in 'student' table
        .then((data) => {
            resolve(data) // resolve promise with retrieved data
        })
        .catch((error) => {
            reject(error) // reject promise if error occurs
        })
    });
}

// function to retrieve student by their student ID
var getStudentBySID = function (sid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM student WHERE sid = ?"; // query db to get student by sid
        pool.query(query, [sid])  // execute query -> replacing '?' with SID
            .then((results) => {
                if (results.length > 0) { // check if results were returned
                    resolve(results[0]);  // resolve with result
                } else {
                    reject(`Student with SID ${sid} not found`); // reject if no student found
                }
            })
            .catch((err) => {
                reject(err); // reject if query error occurs
            });
    });
};

// function to update a student's info based on their sid 
const updateStudent = (sid, updatedStudent) => {
return new Promise((resolve, reject) => {
    // query to update a student's name and age based on sid
    let query = "UPDATE student SET name = ?, age = ? WHERE sid = ?";
    let params = [updatedStudent.name, updatedStudent.age, sid]; // params for query

    // execute query with parameters
    pool.query(query, params) 
        .then((results) => {
            if (results.affectedRows === 0) { //check if rows were updated
                return reject(new Error("Student ID not found.")); // if not, reject promise 
            }
            resolve(); // resolve promise if rows were updated 
        })
        .catch((error) => {
            reject(error); // reject if query error occurs
        });
    });
};

// function to add new student to database
const addStudent = (newStudent) => {
    return new Promise((resolve, reject) => {
        // query to new student to database
        const query = "INSERT INTO student (sid, name, age) VALUES (?, ?, ?)";
        const params = [newStudent.sid, newStudent.name, newStudent.age]; //params for query

        // execute query with params
        pool.query(query, params)
            .then((results) => {
                resolve(results); // resolve with results (affected rows)
            })
            .catch((err) => {
                reject(err); //reject if query error occurs
            });
    });
};

// function to retrieve grades for all students 
const getGrades = () => {
    return new Promise((resolve, reject) => {
        // query that queries three tables using left join to return student name, grade, module name
        const query = `
            SELECT student.name AS studentName, 
                   module.name AS moduleName, 
                   grade.grade AS studentGrade
            FROM student
            LEFT JOIN grade ON student.sid = grade.sid
            LEFT JOIN module ON grade.mid = module.mid
            ORDER BY student.name ASC, grade.grade DESC;  -- Sort by name alphabetically, then by grade descending
        `;

        // execute query
        pool.query(query)
            .then((results) => {
                resolve(results); // resolve with results
            })
            .catch((error) => {
                reject(error); // Function to retrieve grades for all students, including their modules
            });
    });
};

// export functions to be used in other files
module.exports = {getStudents, getStudentBySID, updateStudent, addStudent, getGrades}