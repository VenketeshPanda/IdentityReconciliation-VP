import mysql from "mysql2/promise"

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

const connectToMysql = async function () {
    try {
        const connectionInstance = await db.getConnection()
        console.log(`Connection to MySQL successful!`);
    } catch (error) {
        console.error("Connection to DB failed! :(", error)
        process.exit(1)
    }
}

export { connectToMysql, db }