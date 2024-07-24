import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

dotenv.config();
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`\n  MONGOOSE-DATABASE Connected || db host:
             ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('error in mongodb index js', error);
        process.exit(1);
    }
};
export default connectDB;
