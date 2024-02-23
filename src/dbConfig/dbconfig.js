import mongoose from "mongoose";
export default async function connectdb(){
try {
    console.log("mongodob down")
   await  mongoose.connect(process.env.Mongo_URI)
   console.log("mongo connected in data base")
console.log("mongodob up")
    
    

} catch (error) {
    console.log('Something goes wrong! error is below');
        console.log(error);
        console.log("mongos error up in database")
}

}