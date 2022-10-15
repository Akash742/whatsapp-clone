import mongoose from "mongoose";

const DB_CONNECTION_URL = "mongodb://localhost:27017/test2";

const connectDB = () => {
    console.log("DB trying to connect on " + new Date());
    /*const options = {
        keepAlive: 1,
        autoReconnect: true,
        poolSize: 10,
        useNewUrlParse: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };*/
    return mongoose.connect(DB_CONNECTION_URL);         // return mongoose.connect(DB_CONNECTION_URL, options);
};

export default connectDB;