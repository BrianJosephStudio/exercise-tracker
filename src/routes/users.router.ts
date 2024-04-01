import { NextFunction, Request, Response, Router } from 'express';
import { Database } from "../util/database/Database"

const router = Router()

router.post("/:_id/exercises", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const database = await Database.getInstance()
    const _id = req.params._id

    const exercise = database.createExercise(req.body)

    const response = await database.logExercise(_id, exercise)
    console.log(response)
    res.json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const database = await Database.getInstance()
    const username = req.body.username
    if (!username) {
      res.json({ error: "missing 'username' parameter" })
    }

    const newUser = await database.createUser(username)
    res.json(newUser)
  } catch (e) {
    next(e)
  }
})

router.get("/:_id/logs", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const database = await Database.getInstance()
    const _id = req.params._id

    let { from, to, limit } = req.query

    const fromQuery = database.validateDateQuery(from)
    const toQuery = database.validateDateQuery(to)
    const limitQuery = database.validateNumberQuery(limit)


    const userDocument = await database.getExerciseLogs(_id, fromQuery, toQuery, limitQuery)
    res.json(userDocument)
  } catch (e) {
    next(e)
  }
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const database = await Database.getInstance()

    const allUsers = await database.userModel.find({})
    res.json(allUsers)
  } catch (e) {
    next(e)
  }
})

export default router

