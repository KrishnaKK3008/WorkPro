import mongoose from "mongoose";

const connDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(err){
        console.error(`Error : ${err}`);
        process.exit(1);
    }

}

export default connDB;