import { Mongoose } from "mongoose";

const modelName = "user"
const collectionName = "ercercise_tracker"

export const userModel = (mongoose: Mongoose): any => {

  const urlSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    date: {
      type: String,
    },
  });
  
  const model = mongoose.model(modelName, urlSchema, collectionName);
  return model
}
