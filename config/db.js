import mongoose from 'mongoose';

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error('Database connection failed');
    }
};

export default connectDB;
