const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const isAuthenticatedAdmin = async (req, res, next) => {
    try {
        let token;

        // 1. Cookie la check pannu - production ku
        if (req.cookies.token) {
            token = req.cookies.token;
        }
        // 2. Header la check pannu - local dev ku
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin not Found"
            });
        }

        req.user = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user ||!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${req.user?.role} is not allowed to access this resource`
            });
        }
        next();
    };
};

module.exports = {
    isAuthenticatedAdmin,
    authorizeRole,
};
