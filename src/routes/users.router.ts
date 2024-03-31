import { NextFunction, Request, Response, Router } from 'express';
import { Database } from "../util/database/Database"

const router = Router()

router.post("/:_id/exercises", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("entra a post /user/:_id/exercises")
        const database = await Database.getInstance()
        const _id = req.params._id

        const response = await database.logExercise(_id, req.body)
        res.json(response)
    } catch (e) {
        next(e)
    }
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("entra a post /user")
        const database = await Database.getInstance()
        const username = req.body.username
        console.log("username:", username)
        if (!username) {
            res.json({ error: "missing 'username' parameter" })
        }

        const newUser = await database.createUser(username)
        res.json(newUser)
    } catch (e) {
        next(e)
    }
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("entra a get /user")
        const database = await Database.getInstance()

        const allUsers = await database.userModel.find({})
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

export default router

