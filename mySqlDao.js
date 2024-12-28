var pmysql = require('promise-mysql')
var pool 

pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024Mysql'
})
.then((p) => {
    pool = p
})
.catch((e) => {
    console.log("pool error:" + e)
})