const jwt = require("jsonwebtoken")

function restrictUser(role) {
    const roles = ["user", "admin"]
    return async (req, res, next) => {
        const authError = {
            message: "Invalid Credentials"
        }
        try {
            const token = req.cookies.token
            if (!token) {
                return res.status(401).json(authError)
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json(authError)
                }
                if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
                    return res.status(403).json({
                        message: "You shall not pass!"
                    })
                }
                req.token = decoded


                next()
            })
        }catch(err) {
            next(err)
        }
    }
}

module.exports = restrictUser