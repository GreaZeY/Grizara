const app = require("./app")
const dotenv = require('dotenv')
const connectDatabase = require('./database/db')

const host = 'localhost'

//handling Uncaught Exceptions
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server")
    process.exit(1)
})
// configs
dotenv.config({ path: "backend/configs/config.env" })
const port = process.env.PORT

connectDatabase()


const server =  app.listen(port, () => {
    console.log(`Server : ${host}:${port}`)
})


// Unhandeled promise Rejections
process.on("unhandledRejection",err=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server")
    server.close(()=>{
        process.exit(1)
    })
})