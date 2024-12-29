var pmysql = require('promise-mysql')
var pool 

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
})
.then((p) => {
    pool = p
})
.catch((e) => {
    console.log("pool error:" + e)
})

var getStudents = function()
{
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student')
        .then((data) => {
            resolve(data)
        })
        .catch((error) => {
            reject(error)
        })
    });
}

var getStudentBySID = function (sid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM student WHERE sid = ?"; 
        pool.query(query, [sid]) 
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);  
                } else {
                    reject(`Student with SID ${sid} not found`);
                }
            })
            .catch((err) => {
                reject(err); 
            });
    });
};

const updateStudent = (sid, updatedStudent) => {
return new Promise((resolve, reject) => {
    let query = "UPDATE student SET name = ?, age = ? WHERE sid = ?";
    let params = [updatedStudent.name, updatedStudent.age, sid];

    console.log("Executing query:", query, params);

    pool.query(query, params) 
        .then((results) => {
            if (results.affectedRows === 0) {
                return reject(new Error("Student ID not found."));
            }
            resolve();
        })
        .catch((error) => {
            reject(error);
        });
    });
};

const addStudent = (newStudent) => {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO student (sid, name, age) VALUES (?, ?, ?)";
        const params = [newStudent.sid, newStudent.name, newStudent.age];

        pool.query(query, params)
            .then((results) => {
                resolve(results);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const getGrades = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT student.name AS studentName, 
                   module.name AS moduleName, 
                   grade.grade AS studentGrade
            FROM student
            LEFT JOIN grade ON student.sid = grade.sid
            LEFT JOIN module ON grade.mid = module.mid
            ORDER BY student.name ASC, grade.grade DESC;  -- Sort by name alphabetically, then by grade descending
        `;

        pool.query(query)
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {getStudents, getStudentBySID, updateStudent, addStudent, getGrades}