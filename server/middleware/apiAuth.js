const jwt = require("jsonwebtoken");

const authenticateApiUser = (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

};

module.exports = authenticateApiUser;