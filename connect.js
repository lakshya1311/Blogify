const mongoose = require('mongoose');

async function connectToMongoDb(route) {
    return mongoose.connect(route);
}

module.exports={
    connectToMongoDb,
}