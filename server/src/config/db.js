const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI

const connectDB = async()=>{
try {
    await mongoose.connect(mongoURI);
}catch (error) {
    console.error("database connection failed",error);
    process.exit(1);
}
};
module.exports = connectDB;
