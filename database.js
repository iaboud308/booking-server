const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


let mongoUser;
let mongoPassword;

if (process.env.NODE_ENV === undefined) {
   const config = require('./config');
   mongoUser = config.mongoUser,
   mongoPassword = config.mongoPassword

} else if (process.env.NODE_ENV === 'production') {
    mongoUser = process.env.mongoUser,
    mongoPassword = process.env.mongoPassword;
}


const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@hyderion.com:27017/?authMechanism=DEFAULT`;

const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

let db = 'booking';

function connectToMongo(appStart) {
    client.connect( (error, result) => {
        if (error) {
            console.log(`Unable To Connect To Mongo`);
        } else {
            db = result.db('appointments-app');
            console.log(`Mongo Connected`);
            appStart();
            return db;
        }
    });
}

function getDb() {
    if (db === null || db === undefined) {
        connectToMongo();
    } else {
        return db;
    }
}

function saveAppointment (appointment) {
    appointment.selectedDate = appointment.selectedDate.slice(0, 15);
    console.log(appointment.selectedDate);
    getDb().collection('appointments').insertOne({user: appointment.user, date: appointment.selectedDate, slot: appointment.selectedTime});
}

function saveAvailablity (availability) {
    getDb().collection('appointments').insertOne({date: availability.date, slots: availability.slots});
}


function getAppointments (callback) {
    getDb().collection('appointments').find({}).toArray( (error, data) => {
        if (error) {
            console.log(error);
            callback('There is an error');
        } else {
            callback(data);
        }
    })
}


function getAvailableSlots(date, callback) {
    date = date.slice(0, 15);
    getDb().collection('appointments').find({date: date}).toArray( (error, result) => {
        if (error) {
            console.log(error)
       } 
       else if (result === undefined) {
           console.log(result);
           callback('There are no matches');
       } else {
           console.log(result);
           callback(result);
       }
    })
}

function deleteBooking(_id) {
    _id = ObjectId(_id);
    console.log(_id);
    getDb().collection('appointments').deleteOne({_id: _id});
} 

module.exports = {
    connectToMongo: connectToMongo,
    getAppointments: getAppointments,
    saveAppointment: saveAppointment,
    saveAvailablity: saveAvailablity,
    getAvailableSlots: getAvailableSlots,
    deleteBooking: deleteBooking
}