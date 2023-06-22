const express = require("express")
const { addEmployee, loginEmployee, updateEmployee, getAllEmployees, getAllEmployeesByTeam, getEmployeeDetails, deleteEmployee } = require("../controllers/employeeController")
const validateToken = require("../middleware/validateTokenHandler")

const router = express.Router()

// router.use()

router.post("/add", validateToken, addEmployee)

router.post("/login", loginEmployee)

router.put("/update/:id",validateToken, updateEmployee)

router.get("/all", validateToken, getAllEmployees)

router.get("/allEmployeesByTeam", validateToken, getAllEmployeesByTeam)

router.get("/details/:id", validateToken, getEmployeeDetails)

router.delete("/delete/:id", validateToken, deleteEmployee)


module.exports = router