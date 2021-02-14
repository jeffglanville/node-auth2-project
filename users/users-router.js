const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const restrictUser = require("../middleware/restrictUser")

const router = express.Router()

router.get("/", restrictUser("user"), async (req, res, next) => {
    try {
        res.json(await Users.find())
    }catch(err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken please choose another"
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
        })
        res.status(201).json(newUser)
    }catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try{
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (!user) {
            return res.status(401).json({
                message: "You shall not pass!",
            })
        }
        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: "You shall not pass!",
            })
        }

        const token = jwt.sign({
            userID: user.id,
            userRole: "admin"
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.json({
            message: `Welcome ${user.username}`
        })
    }catch(err) {
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const { username, password, department } = req.body
        const user = await Users.findBy({ username, department }).first()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken please consider another one"
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14),
            department
        })
        res.status(201).json(newUser)
    }catch (err) {
        next(err)
    }
})

router.get("/logout", async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err)
            }else {
                res.status(204).end()
            }
        })
    }catch(err) {
        next(err)
    }
})

module.exports = router