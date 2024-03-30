require("dotenv").config()
const mongoose = require("mongoose")
import { userModel } from "./mongoose/models"

export class Database {
  private static instance: Database
  public userModel: any
  private mongoose: any

  private constructor() {
    this.mongoose = mongoose
  }

  private readonly connect = async (): Promise<any | Error> => {
    try {
      const dbUri = process.env.DB_URI
      if (!dbUri) { throw new Error("DB_URI env is not properly set.") }
      this.userModel = userModel(this.mongoose)

      await this.mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })

    } catch (e) {
      console.error("Error connecting to database:", e);
    }
  }

  public static getInstance = async (): Promise<Database> => {
    if (!Database.instance) {
      Database.instance = new Database()
      await Database.instance.connect()
    }
    return Database.instance
  }

  public readonly disconnect = async (): Promise<void> => {
    await this.mongoose.disconnect()
  }

  public readonly createUser = async (username: string) => {
    const newUserDocument = this.userModel({
      username: username
    })
    
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

  public readonly removeAllDocuments = async (): Promise<void> => {
    await this.userModel.deleteMany({})
  }
}