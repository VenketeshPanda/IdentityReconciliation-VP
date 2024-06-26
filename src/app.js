import express from "express"
import cookieParser from "cookie-parser"
import userRouter from "./router/identifyRouter.router.js"

const app = express()


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1", userRouter)

export { app }