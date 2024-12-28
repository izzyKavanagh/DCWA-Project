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
        const query = "SELECT * FROM student WHERE sid = ?";  // Parameterized query
        pool.query(query, [sid])  // Pass `id` directly as a parameter
            .then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);  // Return the first matching student
                } else {
                    reject(`Student with SID ${sid} not found`);
                }
            })
            .catch((err) => {
                reject(err);  // Return error if query fails
            });
    });
  };

module.exports = {getStudents, getStudentBySID}