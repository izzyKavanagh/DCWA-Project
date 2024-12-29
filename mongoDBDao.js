const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
    db = client.db('proj2024MongoDB')
    coll = db.collection('lecturers')
})
.catch((error) => {
    console.log(error.message)
})


const getLecturerDetails = () => {
    return new Promise((resolve, reject) => {
        coll.find({}).sort({ _id: 1 }).toArray()  // Fetch all lecturers
            .then((lecturers) => {
                resolve(lecturers);  // Resolve with lecturer data
            })
            .catch((error) => {
                reject(error);  // Reject in case of error
            });
    });
};

module.exports = { getLecturerDetails } 