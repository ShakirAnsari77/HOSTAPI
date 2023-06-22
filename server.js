const express = require("express")
const connectDb = require("./config/dbConnection")
const errorHandler = require("./middleware/errorHandler")
const dotenv = require('dotenv').config()

connectDb()
const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use("/api/admin", require("./routes/adminRoutes"))
app.use("/api/organization", require("./routes/organizationRoutes"))
app.use("/api/team", require("./routes/teamRoutes"))
app.use("/api/employee", require("./routes/employeeRoutes"))
app.use("/api/lead", require("./routes/leadRoutes"))
app.use(errorHandler)

app.listen(port, () => {
    console.log('Server is running on port http://localhost:'+port)
})