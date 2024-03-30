require("dotenv").config()
import { Database } from "./util/database/Database"
import apiRouter from "./routes/"
import errorHandler from "./util/middleware/ErrorHandler"
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()

const serve = async (): Promise<void> => {
    await Database.getInstance()

    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded())

    app.use("/api", bodyParser.json())
    app.use("/api", bodyParser.urlencoded())
    app.use("/api", apiRouter)

    app.use("/api", errorHandler)

    const port = process.env.PORT
    app.listen(port, () => {
        console.clear()
        console.log(`Listening on port ${port}`)
    })
}
serve()