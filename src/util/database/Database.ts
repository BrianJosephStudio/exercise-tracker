require("dotenv").config()
const mongoose = require("mongoose")
import { Document } from "mongoose"
import { getModels } from "./mongoose/models"
import { User, Exercise, ExerciseResponse } from "@src/types/schemas"

export class Database {
  private static instance: Database
  public userModel: any
  public exerciseModel: any
  private mongoose: any

  private constructor() {
    this.mongoose = mongoose
  }

  private readonly connect = async (): Promise<any | Error> => {
    try {
      const dbUri = process.env.DB_URI
      if (!dbUri) { throw new Error("DB_URI env is not properly set.") }
      const models = getModels(this.mongoose)
      this.userModel = models.user
      this.exerciseModel = models.exercise

      await this.mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e) {
      console.error("Error starting the database instance:", e);
    }
  }

  public static getInstance = async (): Promise<Database> => {
    if (!Database.instance) {
      Database.instance = new Database()
      console.log("Conencting to database...")
      await Database.instance.connect()
      console.log("Conenction to database successfull")
    }
    return Database.instance
  }

  public readonly disconnect = async (): Promise<void> => {
    await this.mongoose.disconnect()
  }

  public readonly createUser = async (username: string) => {
    const user: User = {
      username: username,
      count: 0
    }
    const newUserDocument = this.userModel(user)

    const createdUser = await newUserDocument.save()
    if (!createdUser || createdUser.username != username) {
      throw new Error("Could not create user")
    }

    return createdUser
  }

  public readonly findUserById = async (id: string) => {

    const createdUser = await this.userModel.findById(id)
    if (!createdUser) {
      throw new Error("Could not find user")
    }

    return createdUser
  }

  public readonly logExercise = async (userId: string, exerciseObject: Exercise): Promise<ExerciseResponse> => {
    const userDocument = await this.userModel.findById(userId)
    const exercise: Exercise = {
      description: exerciseObject.description,
      duration: exerciseObject.duration,
      date: exerciseObject.date || new Date().toUTCString()
    }
    userDocument.log = [...(userDocument.log || []), ...[exercise]]
    userDocument.count++

    await userDocument.save()

    return {
      username: userDocument.username,
      ...exercise
    }
  }
  public readonly getExerciseLogs = async (userId: string, from?: Date, to?: Date, limit?: number): Promise<ExerciseResponse> => {
    const userDocument = await this.userModel.findById(userId)
    const response = userDocument.toObject()
    if (from) {
      response.log = response.log.filter((exercise: Exercise) => {
        return new Date(exercise.date) > from
      })
    }
    if (to) {
      response.log = response.log.filter((exercise: Exercise) => {
        return new Date(exercise.date) < to
      })
    }
    if (limit) {
      while (response.log.length > limit) {
        response.log.pop()
      }
    }
    return response
  }

  public readonly validateDateQuery = (date: any): Date | undefined => {
    if (!date) return undefined
    if (!isNaN(Date.parse(date))) return new Date(date)
    throw new Error("Wrong query params")
  }
  public readonly validateNumberQuery = (number: any): number | undefined => {
    if (!number) return undefined
    if (parseInt(number)) return parseInt(number)
    throw new Error("Wrong query params")
  }

  public readonly removeAllDocuments = async (): Promise<void> => {
    await this.userModel.deleteMany({})
  }
}