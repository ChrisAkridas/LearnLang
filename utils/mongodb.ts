// import mongoose
import mongoose from "mongoose";

// connecting to mongoose(db url from .env)
const {DATABASE_URL} = process.env;

// connections function 
export const connect = async () => {
 const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch(err => console.log(err))

  // test schema
  const todoSchema = new mongoose.Schema({
    item: String,
    completed: Boolean
  })
  
  // create a Todo model
  const Todo = mongoose.model('Todo', todoSchema);
  
  return {conn, Todo}
}