
import userRouter from "./users.router"
import { Router } from "express"

const router = Router()

router.use("/user", userRouter)
router.get("/", (req, res) => {
  res.send("hola")
})

export default router