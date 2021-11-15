const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }) 
        console.log(`connected to DB! ${conn.connection.host}`);
    } catch (err) {
        console.log(`ERROR! ${err.message}`);
    }
}

module.exports = connectDB;