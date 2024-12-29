// import  mongoClient class from the mongodb library
const MongoClient = require('mongodb').MongoClient
// connect to the mongodb server at specified address (localhost)
MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
    // assign database and collection references
    db = client.db('proj2024MongoDB')
    coll = db.collection('lecturers')
    const moduleColl = db.collection('modules');
})
.catch((error) => {
    console.log(error.message) // log error during connection process
})


// function to get all lecturer details from 'lecturers' collection
const getLecturerDetails = () => {
    return new Promise((resolve, reject) => {
        coll.find({}).sort({ _id: 1 }).toArray()  // Fetch all lecturers and sort by id in ascending order
            .then((lecturers) => {
                resolve(lecturers);  // resolve with lecturer data
            })
            .catch((error) => {
                reject(error);  // reject if error occurs
            });
    });
};

// function to delete a lecturer by their id
const deleteLecturerById = (lecturerId) => {
    return new Promise((resolve, reject) => {
        // find the lecturer by their ID
        coll.findOne({ _id: lecturerId })
            .then((lecturer) => {
                if (!lecturer) { // reject if no lecturer found & give error message
                    reject(`Lecturer with ID ${lecturerId} not found.`); 
                    return;
                }

                // check if the 'did' field is missing or empty
                if (!lecturer.did || lecturer.did.trim() === "") {
                    // if no 'did'-> delete the lecturer
                    coll.deleteOne({ _id: lecturerId })
                        .then((result) => {
                            if (result.deletedCount === 1) { // if one document was deleted -> resolve with success message
                                resolve(`Lecturer with ID ${lecturerId} has been successfully deleted.`);
                            } else { // if no document was deleted -> resolve with error message
                                reject(`Failed to delete Lecturer with ID ${lecturerId}`);
                            }
                        })
                        .catch((error) => {
                            reject(error);  // Handle deletion errors
                        });
                } else {
                    // if 'did' is not empty -> lecturer is associated with a module
                    reject(`Lecturer with ID ${lecturerId} has a department ID (did) and cannot be deleted.`);
                }
            })
            .catch((error) => {
                reject(error);  // handle errors from finding lecturer
            });
    });
};

// export functions to be used in other files
module.exports = { getLecturerDetails, deleteLecturerById } 