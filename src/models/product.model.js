import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
       
     },
    available:{
         type:Boolean,
         default:true
     },
    description:{
        type:String,
        default:"node"
    },
    images:[
        {type:String}
    ],
     owner:{
        type:String,
        default:"admin"
          },
       category:{
         type:String,
         default:"Both"
       }   
     },
     {
        timestamps:true
    }


)
let Product;
try {
    // Attempt to retrieve the existing model
    Product = mongoose.model("Product")
  } catch (e) {
    Product = mongoose.model("Product", productSchema)
  }
  export {Product};