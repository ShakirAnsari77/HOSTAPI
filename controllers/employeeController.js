const expressAsyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Employee = require("../models/employeeModel")
const Team = require("../models/teamModel")
const Lead = require("../models/leadModel")

//@desc Register an employee
//@route POST /api/employee/add
//@access public
const addEmployee = expressAsyncHandler(async (req, res) => {
    const { name, email, password, role, team_id } = req.body
    if (!name || !email || !password || !role || !team_id) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    try {
        const employeeAvailable = await Employee.findOne({ email })
        if (employeeAvailable) {
            res.status(400);
            throw new Error("Employee already registered")
        }
        //Hashed password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log("Hashed Password: ", hashedPassword)

        const employee = await Employee.create({
            name,
            email,
            password: hashedPassword,
            role,
            org_id: req.tokenObj.org_id,
            admin_id: req.tokenObj.id,
            team_id
        })

        await Team.findByIdAndUpdate(employee.id, { employees: [employee.id] })

        console.log(`Employee created ${employee}`)
        if (employee) {
            res.status(201).json(employee)
        } else {
            res.status(400)
            throw new Error("Employee data is not valid.")
        }
    } catch (error) {
        console.log(error)
    }
})

//@desc Login employee
//@route POST /api/employee/login
//@access public
const loginEmployee = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const employee = await Employee.findOne({ email })
    //compare password with hashedpassword
    if (employee && (await bcrypt.compare(password, employee.password))) {
        const accessToken = jwt.sign({
            tokenObj: {
                name: employee.name,
                email: employee.email,
                id: employee.id,
                role: employee.role,
                team_id: employee.team_id,
                org_id: employee.org_id
            }
        },
            process.env.ACCESS_TOKEN_SECRET
            // { expiresIn: "200m" }
        )
        res.status(200).json({ accessToken, role: employee.role })
    } else {
        res.status(401)
        throw new Error("Email or password is not valid.")
    }
})


//@desc Update an employee details
//@route PUT /api/employee/update/:id
//@access public
const updateEmployee = expressAsyncHandler(async (req, res) => {
    const { name, email, password, role, team_id } = req.body
    if (!name || !email || !password || !role || !team_id) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const employee = await Employee.findById(req.params.id)
    if (!employee) {
        res.status(404);
        throw new Error("Employee not found")
    }

    //Hashed password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed Password: ", hashedPassword)

    if ((req.tokenObj.org_id == employee.org_id) && ((req.tokenObj.role == "admin") || ((req.tokenObj.role == "teamLeader") && (req.tokenObj.team_id == employee.team_id)))) {

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, password: hashedPassword, role, team_id },
            { new: true })
        res.status(200).json(updatedEmployee)
    } else {
        res.status(401)
        throw new Error("User don't have permission to update other organization's or teams employee data.")
    }

})

//@desc Get all employees
//@route GET /api/employee/all
//@access private
const getAllEmployees = expressAsyncHandler(async (req, res) => {
    if (req.tokenObj.role != "admin") {
        res.status(401)
        throw new Error("User don't have permission to view the employees list!")
    }
    const employees = await Employee.find({ org_id: req.tokenObj.org_id })
    res.status(200).json(employees)
})

//@desc Get all employees
//@route GET /api/employee/allEmployeesByTeam
//@access private
const getAllEmployeesByTeam = expressAsyncHandler(async (req, res) => {
    if (req.tokenObj.role != "teamLeader") {
        res.status(401)
        throw new Error("User don't have permission to view the employees list!")
    }
    const employees = await Employee.find({ team_id: req.tokenObj.team_id })
    res.status(200).json(employees)
})

//@desc Get employee details
//@route GET /api/employee/details/:id
//@access public
const getEmployeeDetails = expressAsyncHandler(async (req, res) => {
    const emp_id = req.params.id
    if (!emp_id) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const employee = await Employee.findById(req.params.id)
    if (employee) {
        if ((req.tokenObj.org_id == employee.org_id) && ((req.tokenObj.id == employee.id) || (req.tokenObj.role == "admin") || ((req.tokenObj.role == "teamLeader") && (req.tokenObj.team_id == employee.team_id)))) {
            res.status(200).json(employee)
        } else {
            res.status(401)
            throw new Error("User don't have permission to view other organization's or teams employee data.")
        }
    } else {
        res.status(401)
        throw new Error("Employee not found.")
    }
})

//@desc Delete Employee
//@route DELETE /api/employee/:id
//@access private
const deleteEmployee = expressAsyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
        res.status(404);
        throw new Error("Employee not found")
    }

    if (employee.admin_id.toString() !== req.tokenObj.id) {
        res.status(403)
        throw new Error("User don't have permission to delete other employee.")
    }

    try {
        // await Employee.findOneAndDelete(req.params.id)
        await Employee.deleteOne({ _id: req.params.id })
    } catch (error) {
        console.log(error)
    }

    res.status(200).json(employee)
})


module.exports = { addEmployee, loginEmployee, updateEmployee, getAllEmployees, getAllEmployeesByTeam, getEmployeeDetails, deleteEmployee }