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

const deleteLecturerById = (lecturerId) => {
    return new Promise((resolve, reject) => {
        coll.deleteOne({ _id: lecturerId }) // Delete the lecturer by their ID
            .then((result) => {
                if (result.deletedCount === 1) {
                    resolve(); // Successfully deleted the lecturer
                } else {
                    reject('Lecturer not found');
                }
            })
            .catch((error) => {
                reject(error); // Handle any errors
            });
    });
};

module.exports = { getLecturerDetails, deleteLecturerById } 