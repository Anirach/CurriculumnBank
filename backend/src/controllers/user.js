exports.getUsers = async (req, res) => {
  try {
    const db = require("../database");

    // Get users from database with role information
    db.all(
      `SELECT u.id, u.email, u.name, u.role_id, r.name as role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.name ASC`,
      [],
      (err, rows) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ message: "Failed to retrieve users" });
        }

        // Format users for the response
        const users = rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          role: {
            id: row.role_id,
            name: row.role_name,
          },
        }));

        res.json({ users });
      }
    );
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = require("../database");

    // Get user from database with role information
    db.get(
      `SELECT u.id, u.email, u.name, u.role_id, r.name as role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id],
      (err, row) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ message: "Failed to retrieve user" });
        }

        if (!row) {
          return res.status(404).json({ message: "User not found" });
        }

        // Format user for the response
        const user = {
          id: row.id,
          name: row.name,
          email: row.email,
          role: {
            id: row.role_id,
            name: row.role_name,
          },
        };

        res.json({ user });
      }
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const db = require("../database");

    // Validate role ID
    if (!roleId || ![1, 2, 3].includes(parseInt(roleId))) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    // Check if user exists
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Failed to retrieve user" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user role
      db.run(
        "UPDATE users SET role_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [roleId, id],
        function (err) {
          if (err) {
            console.error("Database update error:", err);
            return res
              .status(500)
              .json({ message: "Failed to update user role" });
          }

          if (this.changes === 0) {
            return res
              .status(404)
              .json({ message: "User not found or role not changed" });
          }

          // Get the updated user with role name
          db.get(
            `SELECT u.id, u.email, u.name, u.role_id, r.name as role_name 
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.id = ?`,
            [id],
            (err, updatedUser) => {
              if (err) {
                console.error("Database query error:", err);
                return res
                  .status(500)
                  .json({ message: "Failed to retrieve updated user" });
              }

              res.json({
                user: {
                  id: updatedUser.id,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  role: {
                    id: updatedUser.role_id,
                    name: updatedUser.role_name,
                  },
                },
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};
