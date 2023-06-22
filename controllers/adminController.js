const expressAsyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Admin = require("../models/adminModel")

//@desc Register an admin
//@route POST /api/admin/register
//@access public
const registerAdmin = expressAsyncHandler(async(req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const adminAvailable = await Admin.findOne({ email })
    if (adminAvailable) {
        res.status(400);
        throw new Error("Admin already registered")
    }
    //Hashed password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed Password: ", hashedPassword)

    const admin = await Admin.create({
        name,
        email,
        password: hashedPassword
    })

    console.log(`Admin created ${admin}`)
    if (admin) {
        res.status(201).json({ _id: admin.id, email: admin.email })
    } else {
        res.status(400)
        throw new Error("Admin data is not valid.")
    }
    res.json({ message: "Registered the Admin" })
})

//@desc Login admin
//@route POST /api/admin/login
//@access public
const loginAdmin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const admin = await Admin.findOne({ email })
    //compare password with hashedpassword
    if (admin && (await bcrypt.compare(password, admin.password))) {
        const accessToken = jwt.sign({
            tokenObj: {
                name: admin.name,
                email: admin.email,
                id: admin.id,
                org_id: admin.org_id,
                role: "admin"
            }
        },
            process.env.ACCESS_TOKEN_SECRET
            // { expiresIn: "200m" }
        )
        res.status(200).json({ accessToken, org_id: admin.org_id })
    } else {
        res.status(401)
        throw new Error("Email or password is not valid.")
    }
})

module.exports = { registerAdmin, loginAdmin }