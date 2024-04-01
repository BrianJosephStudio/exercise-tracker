
import userRouter from "./users.router"
import { Router } from "express"

const router = Router()
// leo

router.use("/users", userRouter)

export default router