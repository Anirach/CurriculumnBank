exports.hasRole = (roles) => {
  return (req, res, next) => {
    try {
      // Role mapping - in real implementation, this would come from database
      const roleMap = {
        1: "admin",
        2: "teacher",
        3: "student",
      };

      const userRole = roleMap[req.user.role_id];

      if (!userRole || !roles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      res.status(500).json({ message: "Authorization check failed" });
    }
  };
};
