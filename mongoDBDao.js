const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
    db = client.db('proj2024MongoDB')
    coll = db.collection('lecturers')
    const moduleColl = db.collection('modules');
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
        // Find the lecturer by their ID
        coll.findOne({ _id: lecturerId })
            .then((lecturer) => {
                if (!lecturer) {
                    reject(`Lecturer with ID ${lecturerId} not found.`);
                    return;
                }

                // Check if the 'did' field is missing or empty
                if (!lecturer.did || lecturer.did.trim() === "") {
                    // If no 'did', delete the lecturer
                    coll.deleteOne({ _id: lecturerId })
                        .then((result) => {
                            if (result.deletedCount === 1) {
                                resolve(`Lecturer with ID ${lecturerId} has been successfully deleted.`);
                            } else {
                                reject(`Failed to delete Lecturer with ID ${lecturerId}`);
                            }
                        })
                        .catch((error) => {
                            reject(error);  // Handle deletion errors
                        });
                } else {
                    // If 'did' is not empty, lecturer is associated with a module
                    reject(`Lecturer with ID ${lecturerId} has a department ID (did) and cannot be deleted.`);
                }
            })
            .catch((error) => {
                reject(error);  // Handle errors from finding the lecturer
            });
    });
};

module.exports = { getLecturerDetails, deleteLecturerById } 