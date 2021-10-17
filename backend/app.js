const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const errorMiddleWare = require("./middleware/error")

const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1", product)
app.use("/api/v1",user)
app.use(errorMiddleWare)
module.exports = app