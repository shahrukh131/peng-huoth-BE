const { User, Role } = require("@models");

const isAdmin = async (req, res, next) => {
  try {
    // req.user should be set by your auth middleware and contain the user id
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user with roles
    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: "roles",
        attributes: ["name"],
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has 'admin' role
    const isAdmin = user.roles.some(role => role.name === "admin");
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = isAdmin;