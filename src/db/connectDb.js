import mysql from "mysql2/promise"

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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