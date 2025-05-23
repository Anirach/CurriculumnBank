const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database connection
const dbPath = path.resolve(__dirname, "../../db/curriculum_bank.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the SQLite database");
    initDatabase();
  }
});

// Initialize database with tables if they don't exist
function initDatabase() {
  db.serialize(() => {
    // Roles table
    db.run(`CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      permissions TEXT
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles (id)
    )`);

    // Curriculum files table
    db.run(`CREATE TABLE IF NOT EXISTS curriculum_files (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      file_id TEXT NOT NULL, /* Google Drive file ID */
      uploader_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploader_id) REFERENCES users (id)
    )`);

    // Tags table
    db.run(`CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )`);

    // Junction table for file-tag relationships
    db.run(`CREATE TABLE IF NOT EXISTS file_tags (
      file_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (file_id, tag_id),
      FOREIGN KEY (file_id) REFERENCES curriculum_files (id),
      FOREIGN KEY (tag_id) REFERENCES tags (id)
    )`);

    // Insert default roles if they don't exist
    db.get(`SELECT COUNT(*) as count FROM roles`, (err, row) => {
      if (err) {
        console.error("Error checking roles:", err.message);
        return;
      }

      if (row.count === 0) {
        const roles = [
          {
            id: 1,
            name: "admin",
            permissions: JSON.stringify([
              "manage_users",
              "manage_files",
              "view_files",
            ]),
          },
          {
            id: 2,
            name: "teacher",
            permissions: JSON.stringify([
              "upload_files",
              "manage_own_files",
              "view_files",
            ]),
          },
          {
            id: 3,
            name: "student",
            permissions: JSON.stringify(["view_files"]),
          },
        ];

        roles.forEach((role) => {
          db.run(`INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)`, [
            role.id,
            role.name,
            role.permissions,
          ]);
        });

        console.log("Default roles created");
      }
    });
  });
}

module.exports = db;
