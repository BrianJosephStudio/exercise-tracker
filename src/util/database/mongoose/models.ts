import mongoose, { Mongoose } from "mongoose";
const collectionName = "ercercise_tracker"

export const getModels = (mongoose: Mongoose): any => {
  const exerciseSchema = new mongoose.Schema({
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    date: {
      type: String,
    },
  })

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    log: [{
      description: {
        type: String,
      },
      duration: {
        type: Number,
      },
      date: {
        type: String,
      },
    }],
    count: {
      type: Number,
      required: true
    }
  });

  const user = mongoose.model("user", userSchema, collectionName);
  const exercise = mongoose.model("exercise", exerciseSchema, collectionName);
  return { user, exercise }
}

