const permissionData =  require("../models/data.json");
const authorizeRoles = (module, permission) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        console.log(module, permission)
        // if(!allowedRoles.includes(req.user.role)) {
        //     return res.status(403).json({ message: "Access denied" });
        // }

        const userRole = req.user.role;
        const permissionRole = permissionData[userRole];
        
        if(!permissionRole) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        const permissionModule = permissionRole[module];
        if(!permissionModule) {
            return res.status(403).json({ message: "Access denied" });
        }
        console.log({userRole, permissionRole, permissionModule});

        if(!permissionModule.includes(permission)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    }
}

module.exports = authorizeRoles;