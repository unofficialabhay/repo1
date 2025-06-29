const mongoose = require('mongoose');

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log('Database Connection Established ✅');
        });
    } catch (err) {
        console.log(`Error while database connection : ${err}`);
    }
}

module.exports = connectDb;