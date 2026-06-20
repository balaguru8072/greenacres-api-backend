const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const isAuthenticatedAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authontication please login first"
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
            message: "Invalid or expried token or expried your login"
        });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${req.user.role} is not allowed to access this resource`
            });
        }
        next();
    };
};

// const protect = async (req, res, next) => {
//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//     ) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.admin = await Admin.findById(decoded.id).select("-password");
//             next();
//         } catch (error) {
//             res.status(401);
//             return next(new Error("Not authorized, token failed"));
//         }
//     }

//     if (!token) {
//         res.status(401);
//         return next(new Error("Not authorized, no token"));
//     }
// };

module.exports = {
    isAuthenticatedAdmin,
    authorizeRole,
    // protect,
};