import mongoose,{Mongoose} from 'mongoose';

const MONGODB_URL=process.env.MONGODB_URL;

interface MongooseConnection{
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}

// we have to connect mongodb at every time 
// because NEXTJS works in  a serverless environment
// this approach helps in better scaalbility

// caching
let cached:MongooseConnection=(global as any).mongoose;
if(!cached){
    cached=(global as any).mongoose={
        conn:null,promise:null
    }
}

export const connectToDatabase=async()=>{
    console.log("connectToDatabase")
    // if there is already an cached connection with db
    if(cached.conn)return cached.conn;
    // if there is no mongoDB_URL
    if(!MONGODB_URL)throw new Error('MONGODB_URL is  missing');
// // we will try to make a new connection to the mongodb
    cached.promise=cached.promise || mongoose.connect(MONGODB_URL,{
        dbName:'imaginify',bufferCommands:false
    })
    cached.conn=await cached.promise;
    return cached.conn;
}

