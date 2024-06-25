import dotenv from "dotenv"
import { app } from "./app.js"
import { connectToMysql } from "./db/connectDb.js"

dotenv.config({
    path: './env'
})

//Connection to database and starting the server
connectToMysql()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        })
    })
    .catch(() => {
        console.log("MySQL connection failed at index.js", err);
    })

